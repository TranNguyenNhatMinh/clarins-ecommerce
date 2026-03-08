import express from 'express';
import { register, login } from './controller.js';
import { registerValidation, loginValidation, validate } from './validator.js';

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

export default router;
