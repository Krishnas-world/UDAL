// src/controllers/inventoryController.ts
import { Request, Response } from 'express';
import Inventory, { IInventory } from '../models/Inventory';
import { getIo } from '../sockets/socket'; // Import the Socket.IO instance
import { createAuditLog } from './auditController'; 
// Helper function to check for low stock and emit alert
const checkAndEmitLowStock = async (inventoryItem: IInventory) => {
  if (inventoryItem.currentStock <= inventoryItem.reorderThreshold) {
    const io = getIo();
    io.emit('lowStockAlert', {
      drugName: inventoryItem.drugName,
      currentStock: inventoryItem.currentStock,
      reorderThreshold: inventoryItem.reorderThreshold,
      message: `${inventoryItem.drugName} stock is low! Current: ${inventoryItem.currentStock}, Threshold: ${inventoryItem.reorderThreshold}`,
      timestamp: new Date(),
    });
  }
};

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Protected (pharmacy_staff, admin, general_staff)
export const getInventory = async (_req: Request, res: Response) => {
  try {
    const inventory = await Inventory.find({});
    res.json(inventory);
  } catch (error: any) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single inventory item by ID
// @route   GET /api/inventory/:id
// @access  Protected (pharmacy_staff, admin, general_staff)
export const getInventoryItemById = async (req: Request, res: Response) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.json(item);
  } catch (error: any) {
    console.error('Error fetching inventory item by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get low stock inventory items
// @route   GET /api/inventory/low-stock
// @access  Protected (pharmacy_staff, admin)
export const getLowStockItems = async (_req: Request, res: Response) => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ['$currentStock', '$reorderThreshold'] }
    });
    res.json(lowStockItems);
  } catch (error: any) {
    console.error('Error fetching low stock items:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// @desc    Add a new inventory item
// @route   POST /api/inventory
// @access  Protected (pharmacy_staff, admin)
export const createInventoryItem = async (req: Request, res: Response) => {
  const { drugName, currentStock, reorderThreshold, location, notes } = req.body;

  if (!drugName || currentStock === undefined || reorderThreshold === undefined) {
    return res.status(400).json({ message: 'Please enter drug name, current stock, and reorder threshold' });
  }

  try {
    const itemExists = await Inventory.findOne({ drugName });
    if (itemExists) {
      return res.status(400).json({ message: 'Drug with this name already exists' });
    }

    const newItem = new Inventory({
      drugName,
      currentStock,
      reorderThreshold,
      location,
      notes,
    });

    const createdItem = await newItem.save();

    // NEW: Log inventory item creation
    if (req.user) {
      await createAuditLog(
        req.user._id.toString(),
        req.user.username,
        'inventory_create',
        `Created new inventory item: ${createdItem.drugName} (Stock: ${createdItem.currentStock})`,
        createdItem._id?.toString(),
        'Inventory',
        req
      );
    }

    // Emit real-time update for inventory change
    const io = getIo();
    io.emit('inventoryUpdate', { action: 'create', item: createdItem });
    await checkAndEmitLowStock(createdItem); // Check for low stock immediately

    res.status(201).json(createdItem);
  } catch (error: any) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update an inventory item (stock, threshold, etc.)
// @route   PUT /api/inventory/:id
// @access  Protected (pharmacy_staff, admin)
export const updateInventoryItem = async (req: Request, res: Response) => {
  const { drugName, currentStock, reorderThreshold, location, notes } = req.body;

  try {
    const item: IInventory | null = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    if (drugName && drugName !== item.drugName) {
        const drugNameExists: IInventory | null = await Inventory.findOne({ drugName });
        if (
          drugNameExists &&
          (drugNameExists._id as unknown as { toString(): string }).toString() !==
            (item._id as unknown as { toString(): string }).toString()
        ) {
            return res.status(400).json({ message: 'Another drug with this name already exists' });
        }
    }

    const oldStock = item.currentStock; // Capture old stock for logging
    const oldThreshold = item.reorderThreshold; // Capture old threshold for logging

    item.drugName = drugName || item.drugName;
    item.currentStock = currentStock !== undefined ? currentStock : item.currentStock;
    item.reorderThreshold = reorderThreshold !== undefined ? reorderThreshold : item.reorderThreshold;
    item.location = location || item.location;
    item.notes = notes || item.notes;

    const updatedItem = await item.save();

    // NEW: Log inventory item update
    if (req.user) {
      let details = `Updated inventory item: ${updatedItem.drugName} (ID: ${updatedItem._id}).`;
      if (updatedItem.currentStock !== oldStock) {
        details += ` Stock changed from ${oldStock} to ${updatedItem.currentStock}.`;
      }
      if (updatedItem.reorderThreshold !== oldThreshold) {
        details += ` Threshold changed from ${oldThreshold} to ${updatedItem.reorderThreshold}.`;
      }
      await createAuditLog(
        req.user._id.toString(),
        req.user.username,
        'inventory_update',
        details,
        updatedItem._id?.toString(),
        'Inventory',
        req
      );
    }

    // Emit real-time update for inventory change
    const io = getIo();
    io.emit('inventoryUpdate', { action: 'update', item: updatedItem });
    await checkAndEmitLowStock(updatedItem); // Check for low stock after update

    res.json(updatedItem);
  } catch (error: any) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete an inventory item
// @route   DELETE /api/inventory/:id
// @access  Protected (admin)
export const deleteInventoryItem = async (req: Request, res: Response) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    const deletedItemName = item.drugName;
    const deletedItemId = item._id;

    await Inventory.deleteOne({ _id: req.params.id });

    // NEW: Log inventory item deletion
    if (req.user) {
      await createAuditLog(
        req.user._id.toString(),
        req.user.username,
        'inventory_delete',
        `Deleted inventory item: ${deletedItemName} (ID: ${deletedItemId}) by ${req.user.username}`,
        deletedItemId?.toString(),
        'Inventory',
        req
      );
    }

    // Emit real-time update for inventory change
    const io = getIo();
    io.emit('inventoryUpdate', { action: 'delete', itemId: req.params.id });

    res.json({ message: 'Inventory item removed' });
  } catch (error: any) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
