/**
 * Chat API - private chat: requires auth. Only the owning/participating account can see conversations.
 * Message status: sent, delivered, read (Seen/Read).
 */
import api from '../axios.js';

/** User: create or get my support conversation. Returns { conversationId, participants, messages } */
export async function createOrGetConversation() {
  const { data } = await api.post('/chat/conversations');
  return data.data;
}

/** User: list my conversations (filtered by backend by user ID) */
export async function getMyConversations() {
  const { data } = await api.get('/chat/conversations');
  return data.data;
}

/** User: get messages for a conversation (participant only). Backend marks as read when fetched. */
export async function getMessages(conversationId) {
  const { data } = await api.get(`/chat/conversations/${conversationId}/messages`);
  return data.data;
}

/** User: send message */
export async function sendMessage(conversationId, text) {
  const { data } = await api.post(`/chat/conversations/${conversationId}/messages`, { text });
  return data.data;
}

/** Admin: list support conversations */
export async function getConversations() {
  const { data } = await api.get('/admin/chat/conversations');
  return data.data;
}

/** Admin: get messages (marks customer messages as read) */
export async function getConversationMessages(conversationId) {
  const { data } = await api.get(`/admin/chat/conversations/${conversationId}/messages`);
  return data.data;
}

/** Admin: reply to conversation */
export async function replyConversation(conversationId, text) {
  const { data } = await api.post(`/admin/chat/conversations/${conversationId}/messages`, { text });
  return data.data;
}
