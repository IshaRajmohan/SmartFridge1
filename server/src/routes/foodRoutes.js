import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import FoodItem from '../models/FoodItem.js';

const router = express.Router();

// Get all food items for user
router.get('/', protect, async (req, res) => {
  try {
    const items = await FoodItem.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single food item
router.get('/:id', protect, async (req, res) => {
  try {
    const item = await FoodItem.findOne({ _id: req.params.id, userId: req.user._id });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new food item
router.post('/', protect, async (req, res) => {
  try {
    const { name, barcode, category, imageUrl, expiryDate, quantity, metadata } = req.body;
    
    const item = new FoodItem({
      userId: req.user._id,
      name,
      barcode,
      category,
      imageUrl,
      expiryDate,
      quantity,
      metadata
    });
    
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update food item
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, barcode, category, imageUrl, expiryDate, quantity, metadata } = req.body;
    
    const item = await FoodItem.findOne({ _id: req.params.id, userId: req.user._id });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    item.name = name || item.name;
    item.barcode = barcode || item.barcode;
    item.category = category || item.category;
    item.imageUrl = imageUrl || item.imageUrl;
    item.expiryDate = expiryDate || item.expiryDate;
    item.quantity = quantity !== undefined ? quantity : item.quantity;
    item.metadata = metadata || item.metadata;
    
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete food item
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await FoodItem.findOne({ _id: req.params.id, userId: req.user._id });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    await item.remove();
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;