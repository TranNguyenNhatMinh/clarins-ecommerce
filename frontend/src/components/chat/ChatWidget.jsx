/**
 * Private support chat — icon luôn hiển thị; khi chưa đăng nhập thì nhắc đăng nhập.
 */
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  createOrGetConversation,
  getMessages,
  sendMessage,
} from '../../api/services/chatService.js';

const ChatIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

function formatTime(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function StatusLabel({ status, from }) {
  if (from !== 'user') return null;
  if (status === 'read') return <span className="text-[10px] text-white/90 mt-0.5">Read</span>;
  if (status === 'delivered') return <span className="text-[10px] text-white/80 mt-0.5">Delivered</span>;
  return <span className="text-[10px] text-white/70 mt-0.5">Sent</span>;
}

export default function ChatWidget() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!open || !isAuthenticated) return;
    setError('');
    setLoading(true);
    createOrGetConversation()
      .then(({ conversationId: cid, messages: list }) => {
        setConversationId(cid);
        setMessages(
          (list || []).map((m) => ({
            id: m._id,
            text: m.text,
            from: m.from,
            status: m.status || 'sent',
            readAt: m.readAt,
            time: formatTime(m.createdAt),
          }))
        );
      })
      .catch((err) => {
        const msg =
          err.response?.status === 404
            ? 'Chat service is not available. Please try again later.'
            : err.response?.data?.message || 'Cannot load chat.';
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [open, isAuthenticated]);

  useEffect(() => {
    if (!open || !conversationId || !isAuthenticated) return;
    const poll = () => {
      getMessages(conversationId)
        .then((list) => {
          setMessages(
            (list || []).map((m) => ({
              id: m._id,
              text: m.text,
              from: m.from,
              status: m.status || 'sent',
              readAt: m.readAt,
              time: formatTime(m.createdAt),
            }))
          );
        })
        .catch(() => {});
    };
    const interval = setInterval(poll, 4000);
    poll();
    return () => clearInterval(interval);
  }, [open, conversationId, isAuthenticated]);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [open, messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || !conversationId || sending) return;
    setSending(true);
    setMessage('');
    try {
      const added = await sendMessage(conversationId, trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: added._id,
          text: added.text,
          from: added.from,
          status: added.status || 'sent',
          readAt: added.readAt,
          time: formatTime(added.createdAt),
        },
      ]);
      scrollToBottom();
    } catch (err) {
      setError(err.response?.data?.message || 'Send failed.');
    } finally {
      setSending(false);
    }
  };

  const showLoginPrompt = open && !isAuthenticated;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-brand text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
        aria-label="Open chat"
      >
        <ChatIcon />
      </button>

      {open && (
        <div className="fixed inset-0 z-[101]" aria-modal="true" role="dialog">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute bottom-6 right-6 w-full max-w-md h-[480px] max-h-[85vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Support Chat</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {showLoginPrompt ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <p className="text-gray-600 mb-4">Đăng nhập để sử dụng chat hỗ trợ.</p>
                <div className="flex gap-3">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2.5 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand-600 transition"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
                  >
                    Đăng ký
                  </Link>
                </div>
              </div>
            ) : (
            <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              {loading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                        m.from === 'user'
                          ? 'bg-brand text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p>{m.text}</p>
                      <p className={`text-[10px] mt-1 ${m.from === 'user' ? 'text-white/80' : 'text-gray-500'}`}>
                        {m.time}
                      </p>
                      <StatusLabel status={m.status} from={m.from} />
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  disabled={!conversationId || loading}
                  className="flex-1 min-w-0 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand disabled:bg-gray-100"
                />
                <button
                  type="submit"
                  disabled={!conversationId || loading || sending}
                  className="shrink-0 w-11 h-11 rounded-lg bg-brand text-white flex items-center justify-center hover:bg-brand-600 transition focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-70"
                  aria-label="Send"
                >
                  <SendIcon />
                </button>
              </div>
            </form>
            </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
