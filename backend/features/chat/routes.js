import express from 'express';
import { protect } from '../../middleware/auth.js';
import {
  createOrGetConversation,
  getMyConversations,
  getMessages,
  sendCustomerMessage,
} from './controller.js';
import { validateObjectId } from '../../middleware/validateObjectId.js';

const router = express.Router();

router.get('/health', (req, res) => res.json({ ok: true, service: 'chat' }));

router.use(protect);

router.get('/conversations', getMyConversations);
router.post('/conversations', createOrGetConversation);
router.get('/conversations/:id/messages', validateObjectId('id'), getMessages);
router.post('/conversations/:id/messages', validateObjectId('id'), sendCustomerMessage);

export default router;
