import Ingredient from "../models/Ingredient.js";
import axios from "axios";

// 🧩 Generate recipes based on available ingredients
export const generateRecipes = async (req, res) => {
  try {
    // 1️⃣ Fetch all ingredients from DB
    const ingredients = await Ingredient.find();
    const ingredientNames = ingredients.map(i => i.name).join(",");

    if (!ingredientNames.length) {
      return res.status(400).json({ message: "No ingredients found in database." });
    }

    // 2️⃣ Call Spoonacular API
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientNames}&number=5&ranking=2&apiKey=${apiKey}`;

    const response = await axios.get(apiUrl);

    // 3️⃣ Simplify the API response
    const recipes = response.data.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      usedIngredients: recipe.usedIngredients.map(i => i.name),
      missedIngredients: recipe.missedIngredients.map(i => i.name),
    }));

    res.json(recipes);
  } catch (error) {
    console.error("Error generating recipes:", error);
    res.status(500).json({ error: "Failed to generate recipes" });
  }
};

// 🍽️ Get full details for a specific recipe by ID
// Fetch full recipe details by ID
export const getRecipeDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const apiUrl = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;

    const response = await axios.get(apiUrl);
    const data = response.data;

    // Clean and simplify response
    const recipeDetails = {
      id: data.id,
      title: data.title,
      image: data.image,
      readyInMinutes: data.readyInMinutes,
      servings: data.servings,
      summary: data.summary,
      ingredients: data.extendedIngredients.map((i) => i.original),
      instructions: data.instructions || "No instructions available",
    };

    res.json(recipeDetails);
  } catch (error) {
    console.error("Error fetching recipe details:", error.response?.data || error);
    res.status(500).json({ error: "Failed to fetch recipe details" });
  }
};
