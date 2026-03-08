import express from 'express';
import { protect } from '../../middleware/auth.js';
import { adminOnly } from '../../middleware/admin.js';
import { validateObjectId } from '../../middleware/validateObjectId.js';
import {
  getUsers,
  deleteUser,
  getSubscribers,
  deleteSubscriber,
  getConversations,
  getConversationMessages,
  replyConversation,
} from './controller.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/users', getUsers);
router.delete('/users/:id', validateObjectId('id'), deleteUser);

router.get('/subscribers', getSubscribers);
router.delete('/subscribers/:id', validateObjectId('id'), deleteSubscriber);

router.get('/chat/conversations', getConversations);
router.get('/chat/conversations/:id/messages', validateObjectId('id'), getConversationMessages);
router.post('/chat/conversations/:id/messages', validateObjectId('id'), replyConversation);

export default router;
