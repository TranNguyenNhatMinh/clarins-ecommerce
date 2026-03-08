import express from 'express';
import { subscribe } from './controller.js';
import { subscribeValidation, validate } from './validator.js';

const router = express.Router();

router.post('/subscribe', subscribeValidation, validate, subscribe);

export default router;
