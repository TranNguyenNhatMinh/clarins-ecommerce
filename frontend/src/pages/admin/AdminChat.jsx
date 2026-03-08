/**
 * Admin Chat — support conversations filtered by backend; message status (Sent / Delivered / Read).
 */
import { useState, useEffect, useRef } from 'react';
import {
  getConversations,
  getConversationMessages,
  replyConversation,
} from '../../api/services/chatService.js';

function formatTime(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString();
}

function participantLabel(c) {
  if (!c.participantIds?.length) return 'Customer';
  const p = c.participantIds[0];
  const name = p?.name || p?.email;
  return name || p?._id || 'Customer';
}

function StatusLabel({ message, isAdminMessage }) {
  if (isAdminMessage) {
    if (message.status === 'read') return <span className="text-[10px] text-white/90 mt-0.5">Read</span>;
    if (message.status === 'delivered') return <span className="text-[10px] text-white/80 mt-0.5">Delivered</span>;
    return <span className="text-[10px] text-white/70 mt-0.5">Sent</span>;
  }
  if (message.status === 'read') return <span className="text-[10px] text-gray-500 mt-0.5">Seen</span>;
  return null;
}

export default function AdminChat() {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const loadConversations = () => {
    setError('');
    setLoading(true);
    getConversations()
      .then((data) => {
        setConversations(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        const msg =
          err.response?.status === 401
            ? 'Please log in as admin.'
            : err.response?.status === 404
              ? 'Chat API not found (404). Restart the backend server.'
              : err.response?.data?.message || err.message || 'Failed to load conversations.';
        setError(msg);
        setConversations([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }
    const load = () => {
      getConversationMessages(selectedId)
        .then(setMessages)
        .catch(() => setMessages([]));
    };
    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, [selectedId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleReply = async (e) => {
    e.preventDefault();
    const trimmed = replyText.trim();
    if (!trimmed || !selectedId || sending) return;
    setSending(true);
    setError('');
    try {
      const added = await replyConversation(selectedId, trimmed);
      setMessages((prev) => [...prev, added]);
      setReplyText('');
      loadConversations();
    } catch (err) {
      setError(err.response?.data?.message || 'Send failed.');
    } finally {
      setSending(false);
    }
  };

  const selected = conversations.find((c) => c._id === selectedId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-admin-text">Chat hỗ trợ</h1>
          <p className="mt-1 text-sm text-admin-muted">Quản lý hội thoại với khách hàng</p>
        </div>
        {error && (
          <span className="text-sm text-red-600 flex items-center gap-2">
            {error}
            <button
              type="button"
              onClick={() => loadConversations()}
              className="px-3 py-1.5 rounded-admin border border-admin-border bg-admin-card text-admin-text hover:bg-gray-50 text-sm font-medium"
            >
              Thử lại
            </button>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[520px]">
        <div className="bg-admin-card rounded-admin-lg border border-admin-border overflow-hidden flex flex-col shadow-admin">
          <div className="px-4 py-3.5 border-b border-admin-border bg-gray-50">
            <span className="text-sm font-medium text-admin-text">Hội thoại</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <p className="p-4 text-sm text-admin-muted">Đang tải...</p>
            ) : conversations.length === 0 ? (
              <p className="p-4 text-sm text-admin-muted">Chưa có hội thoại.</p>
            ) : (
              <ul className="divide-y divide-admin-border">
                {conversations.map((c) => (
                  <li key={c._id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(c._id)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-l-2 ${
                        selectedId === c._id ? 'bg-brand/10 border-brand' : 'border-transparent'
                      }`}
                    >
                      <p className="text-xs text-admin-muted truncate">{participantLabel(c)}</p>
                      <p className="text-sm text-admin-text truncate mt-0.5">
                        {c.lastMessage?.text || '—'}
                      </p>
                      <p className="text-xs text-admin-muted mt-1">{formatDate(c.updatedAt)}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-admin-card rounded-admin-lg border border-admin-border flex flex-col overflow-hidden shadow-admin">
          {selected ? (
            <>
              <div className="px-4 py-3.5 border-b border-admin-border bg-gray-50">
                <p className="text-xs text-admin-muted">Khách: {participantLabel(selected)}</p>
                <p className="text-sm font-medium text-admin-text">Trả lời khách hàng</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => {
                  const isAdminMessage = m.from === 'support' || m.from === 'admin';
                  return (
                    <div
                      key={m._id}
                      className={`flex ${isAdminMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-admin px-3 py-2 text-sm ${
                          isAdminMessage
                            ? 'bg-brand text-white'
                            : 'bg-gray-100 text-admin-text'
                        }`}
                      >
                        <p>{m.text}</p>
                        <p className={`text-[10px] mt-1 ${isAdminMessage ? 'text-white/80' : 'text-admin-muted'}`}>
                          {formatTime(m.createdAt)}
                        </p>
                        <StatusLabel message={m} isAdminMessage={isAdminMessage} />
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleReply} className="p-3 border-t border-admin-border bg-gray-50/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 min-w-0 px-4 py-2.5 rounded-admin border border-admin-border text-sm text-admin-text placeholder-admin-muted focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-admin-card"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="shrink-0 px-4 py-2.5 rounded-admin bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors disabled:opacity-70"
                  >
                    {sending ? '...' : 'Gửi'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-admin-muted text-sm">
              Chọn một hội thoại để trả lời
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-admin-muted">
        Tổng <strong className="text-admin-text">{conversations.length}</strong> cuộc hội thoại
      </p>
    </div>
  );
}
