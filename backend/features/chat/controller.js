/**
 * Chat - private chat: only participants can access. Message status: sent → delivered/read.
 */
import Conversation from '../../models/Conversation.js';

const SUPPORT = 'support';

function canAccess(conv, userId) {
  if (!conv || !userId) return false;
  const uid = userId.toString();
  return conv.participantIds.some((p) => {
    const id = p && (p._id != null ? p._id : p);
    return id && id.toString() === uid;
  });
}

function markMessagesAsRead(conv, viewerId) {
  let changed = false;
  conv.messages.forEach((m) => {
    const fromSupport = m.from === SUPPORT || m.from === 'admin';
    const fromOtherUser = !fromSupport && m.from && m.from.toString() !== viewerId.toString();
    if (fromSupport || fromOtherUser) {
      if (m.status !== 'read') {
        m.status = 'read';
        m.readAt = new Date();
        changed = true;
      }
    }
  });
  return changed;
}

function toMessageDto(m, viewerId) {
  const isFromSupport = m.from === SUPPORT || m.from === 'admin';
  return {
    _id: m._id,
    from: isFromSupport ? 'support' : 'user',
    fromId: isFromSupport ? null : m.from,
    text: m.text,
    status: m.status || 'sent',
    readAt: m.readAt || null,
    createdAt: m.createdAt,
  };
}

export const createOrGetConversation = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let conv = await Conversation.findOne({
      participantIds: userId,
      isSupport: true,
    }).populate('participantIds', 'name email');

    if (!conv) {
      conv = await Conversation.create({
        participantIds: [userId],
        isSupport: true,
        messages: [
          { from: SUPPORT, text: 'Hello! How can we help you today?', status: 'sent' },
        ],
      });
      conv = await Conversation.findById(conv._id).populate('participantIds', 'name email');
    }

    if (!canAccess(conv, userId)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    markMessagesAsRead(conv, userId);
    await conv.save();

    res.json({
      success: true,
      data: {
        conversationId: conv._id,
        participants: conv.participantIds,
        messages: (conv.messages || []).map((m) => toMessageDto(m, userId)),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getMyConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const list = await Conversation.find({ participantIds: userId })
      .sort({ updatedAt: -1 })
      .populate('participantIds', 'name email')
      .select('participantIds isSupport messages updatedAt')
      .lean();

    const data = list.map((c) => {
      const lastMsg = c.messages?.length ? c.messages[c.messages.length - 1] : null;
      return {
        _id: c._id,
        isSupport: c.isSupport,
        participantIds: c.participantIds,
        lastMessage: lastMsg
          ? {
              _id: lastMsg._id,
              from: lastMsg.from === SUPPORT || lastMsg.from === 'admin' ? 'support' : 'user',
              text: lastMsg.text,
              status: lastMsg.status,
              readAt: lastMsg.readAt,
              createdAt: lastMsg.createdAt,
            }
          : null,
        messageCount: c.messages?.length || 0,
        updatedAt: c.updatedAt,
      };
    });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const conv = await Conversation.findById(req.params.id);
    if (!conv) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }
    if (!canAccess(conv, userId)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const changed = markMessagesAsRead(conv, userId);
    if (changed) await conv.save();

    res.json({
      success: true,
      data: (conv.messages || []).map((m) => toMessageDto(m, userId)),
    });
  } catch (err) {
    next(err);
  }
};

export const sendCustomerMessage = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ success: false, message: 'text is required.' });
    }

    const conv = await Conversation.findById(req.params.id);
    if (!conv) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }
    if (!canAccess(conv, userId)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    conv.messages.push({
      from: userId,
      text: text.trim(),
      status: 'sent',
    });
    await conv.save();
    const added = conv.messages[conv.messages.length - 1];

    res.status(201).json({
      success: true,
      data: toMessageDto(added, userId),
    });
  } catch (err) {
    next(err);
  }
};
