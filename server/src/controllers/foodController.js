// controllers/foodController.js
import FoodItem from "../models/FoodItem.js";

export const addFoodItem = async (req, res) => {
  try {
    const { name, barcode, expiryDate } = req.body;

    if (!name || !expiryDate) {
      return res.status(400).json({ message: "Name and expiryDate are required" });
    }

    const foodItem = new FoodItem({
      userId: req.user?.id || "anonymous", // adjust if you have auth
      name,
      barcode,
      expiryDate: new Date(expiryDate),
    });

    await foodItem.save();
    res.status(201).json(foodItem);
  } catch (error) {
    console.error("Error adding food item:", error);
    res.status(500).json({ message: "Failed to add item" });
  }
};

export const getFoodItems = async (req, res) => {
  try {
    const items = await FoodItem.find({ userId: req.user?.id || "anonymous" })
      .sort({ expiryDate: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
};