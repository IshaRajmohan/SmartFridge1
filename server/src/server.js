// src/server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// ─── Import Routes ─────────────────────────────────────
import authRoutes from "./routes/authRoutes.js";
import ingredientRoutes from "./routes/ingredientRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";

import cors from "cors";

dotenv.config();
connectDB();

const app = express();

// 🧠 Body parser middleware
app.use(express.json());

// 🛡️ Enable CORS
app.use(cors());

// 🧭 Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/food", foodRoutes);

// 🩺 Health check
app.get("/", (req, res) => {
  res.send("FridgeWise API running...");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));