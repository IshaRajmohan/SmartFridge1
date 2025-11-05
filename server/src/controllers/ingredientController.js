// controllers/ingredientController.js
import Ingredient from "../models/Ingredient.js";

export const getIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.json(ingredients);
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    res.status(500).json({ message: "Failed to fetch ingredients" });
  }
};

export const addIngredient = async (req, res) => {
  try {
    console.log("Request body:", req.body); // 👈 Debug log
    const { name, quantity } = req.body;

    const ingredient = new Ingredient({ name, quantity });
    await ingredient.save();

    res.status(201).json(ingredient);
  } catch (error) {
    console.error("Error adding ingredient:", error);
    res.status(500).json({ message: "Failed to add ingredient" });
  }
};
