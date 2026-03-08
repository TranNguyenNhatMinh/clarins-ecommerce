/**
 * Admin - quản lý user, newsletter subscribers, chat
 */
import User from '../../models/User.js';
import Subscriber from '../../models/Subscriber.js';
import Conversation from '../../models/Conversation.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const CHAT_SUPPORT = 'support';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const targetId = req.params.id;
    if (targetId === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete yourself.' });
    }

    const user = await User.findByIdAndDelete(targetId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, message: 'User deleted.' });
  } catch (err) {
    next(err);
  }
};

export const getSubscribers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || DEFAULT_PAGE);
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit, 10) || DEFAULT_LIMIT));
    const search = (req.query.search || '').trim();
    const sortOrder = req.query.sort === 'oldest' ? 1 : -1;
    const sortField = { subscribedAt: sortOrder };

    const filter = {};
    if (search) {
      filter.email = { $regex: search, $options: 'i' };
    }

    const [list, total] = await Promise.all([
      Subscriber.find(filter).sort(sortField).skip((page - 1) * limit).limit(limit).lean(),
      Subscriber.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: list,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSubscriber = async (req, res, next) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Subscriber not found.' });
    }
    res.json({ success: true, message: 'Subscriber removed.' });
  } catch (err) {
    next(err);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const list = await Conversation.find({ isSupport: true })
      .sort({ updatedAt: -1 })
      .populate('participantIds', 'name email')
      .select('participantIds isSupport messages updatedAt')
      .lean();
    const data = list.map((c) => {
      const lastMsg = c.messages?.length ? c.messages[c.messages.length - 1] : null;
      const isFromSupport = lastMsg && (lastMsg.from === CHAT_SUPPORT || lastMsg.from === 'admin');
      return {
        _id: c._id,
        participantIds: c.participantIds,
        lastMessage: lastMsg
          ? {
              _id: lastMsg._id,
              from: isFromSupport ? 'support' : 'user',
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

function markCustomerMessagesAsRead(conv) {
  let changed = false;
  conv.messages.forEach((m) => {
    const fromSupport = m.from === CHAT_SUPPORT || m.from === 'admin';
    if (!fromSupport && m.from && m.status !== 'read') {
      m.status = 'read';
      m.readAt = new Date();
      changed = true;
    }
  });
  return changed;
}

function toAdminMessageDto(m) {
  const isFromSupport = m.from === CHAT_SUPPORT || m.from === 'admin';
  return {
    _id: m._id,
    from: isFromSupport ? 'support' : 'user',
    text: m.text,
    status: m.status || 'sent',
    readAt: m.readAt || null,
    createdAt: m.createdAt,
  };
}

export const getConversationMessages = async (req, res, next) => {
  try {
    const conv = await Conversation.findById(req.params.id);
    if (!conv) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }
    if (!conv.isSupport) {
      return res.status(403).json({ success: false, message: 'Not a support conversation.' });
    }
    const changed = markCustomerMessagesAsRead(conv);
    if (changed) await conv.save();
    res.json({
      success: true,
      data: (conv.messages || []).map(toAdminMessageDto),
    });
  } catch (err) {
    next(err);
  }
};

export const replyConversation = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ success: false, message: 'text is required.' });
    }
    const conv = await Conversation.findById(req.params.id);
    if (!conv) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }
    if (!conv.isSupport) {
      return res.status(403).json({ success: false, message: 'Not a support conversation.' });
    }
    conv.messages.push({
      from: CHAT_SUPPORT,
      text: text.trim(),
      status: 'sent',
    });
    await conv.save();
    const added = conv.messages[conv.messages.length - 1];
    res.status(201).json({
      success: true,
      data: toAdminMessageDto(added),
    });
  } catch (err) {
    next(err);
  }
};
