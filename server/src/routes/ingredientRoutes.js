// routes/ingredientRoutes.js
import express from "express";
import { getIngredients, addIngredient } from "../controllers/ingredientController.js";

const router = express.Router();

router.get("/", getIngredients);
router.post("/", addIngredient);

export default router;