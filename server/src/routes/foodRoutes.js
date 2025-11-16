// routes/foodRoutes.js
import express from 'express';
import { addFoodItem, getFoodItems } from '../controllers/foodController.js';

const router = express.Router();

router.post('/', addFoodItem);
router.get('/', getFoodItems);

export default router;