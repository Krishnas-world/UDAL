// src/routes/inventoryRoutes.ts
import express from 'express';
import {
  getInventory,
  getInventoryItemById,
  getLowStockItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '../controllers/inventoryController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

// Get inventory items (accessible by pharmacy staff, admin, general staff)
router.get('/', protect, authorizeRoles('admin', 'pharmacy_staff', 'general_staff'), getInventory);

// IMPORTANT: Place specific routes before general ones to avoid ID casting errors
// Get low stock items (accessible by pharmacy staff, admin)
router.get('/low-stock', protect, authorizeRoles('admin', 'pharmacy_staff'), getLowStockItems);

// Get a single inventory item by ID (accessible by pharmacy staff, admin, general staff)
router.get('/:id', protect, authorizeRoles('admin', 'pharmacy_staff', 'general_staff'), getInventoryItemById);


// Create/Update inventory items (accessible by pharmacy staff, admin)
router.post('/', protect, authorizeRoles('admin', 'pharmacy_staff'), createInventoryItem);
router.put('/:id', protect, authorizeRoles('admin', 'pharmacy_staff'), updateInventoryItem);

// Delete inventory item (only accessible by Admin)
router.delete('/:id', protect, authorizeRoles('admin'), deleteInventoryItem);

export default router;
