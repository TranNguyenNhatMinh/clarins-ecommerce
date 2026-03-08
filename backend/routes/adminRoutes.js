import express from 'express';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import { validateObjectId } from '../middleware/validateObjectId.js';
import { getUsers, deleteUser } from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/users', getUsers);
router.delete('/users/:id', validateObjectId('id'), deleteUser);

export default router;
