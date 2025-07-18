import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware';
import { UserRole } from '../models/User';
const router = express.Router();
const restrictRole =  (req:any, res:any, next:any) => {
    const allowedRoles: UserRole[] = ['admin', 'ot_staff', 'pharmacy_staff', 'general_staff'];
    if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Not authorized' });
    }
    console.log(req.user.role)
    // If not admin, force role = req.user.role
    if (req.user.role !== 'admin') {
        req.body.role = req.user.role;
    }
    next();
}
router.post('/register', protect, restrictRole, registerUser)
.post('/login', loginUser);

export default router;
