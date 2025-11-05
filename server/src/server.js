// src/server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import ingredientRoutes from "./routes/ingredientroutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

// 🧠 Body parser middleware (required for POST JSON)
app.use(express.json());

// 🛡️ Enable CORS if frontend will connect
app.use(cors());

// 🧭 Mount routes
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/recipes", recipeRoutes);

// 🩺 Default route for testing
app.get("/", (req, res) => {
  res.send("FridgeWise API running...");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
