import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import roleHandler from '../controllers/helperController';
const router = express.Router();

router.get('/roles',protect,roleHandler);
export default router;