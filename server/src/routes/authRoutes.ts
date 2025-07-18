import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware';
const router = express.Router();

router.post('/register',protect,authorizeRoles('admin'),registerUser);
router.post('/login', loginUser);

export default router;
