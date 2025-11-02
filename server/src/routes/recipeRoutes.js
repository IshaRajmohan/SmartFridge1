import express from "express";
import { generateRecipes, getRecipeDetails } from "../controllers/recipeController.js"; // 👈 include both

const router = express.Router();

// Generate recipes based on ingredients
router.get("/generate", generateRecipes);

// Get details for a specific recipe
router.get("/:id", getRecipeDetails);

export default router;
