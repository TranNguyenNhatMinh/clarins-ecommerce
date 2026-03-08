import express from 'express';
import { protect } from '../middleware/auth.js';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { updateProfileValidation, validate } from '../validators/userValidator.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfileValidation, validate, updateProfile);

export default router;
