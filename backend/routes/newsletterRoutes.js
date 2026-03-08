/**
 * Newsletter routes - đăng ký nhận tin (public)
 */
import express from 'express';
import { subscribe } from '../controllers/newsletterController.js';
import { subscribeValidation, validate } from '../validators/subscriberValidator.js';

const router = express.Router();

router.post('/subscribe', subscribeValidation, validate, subscribe);

export default router;
