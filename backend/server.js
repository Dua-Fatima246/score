import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import scoreRoutes from "./routes/scores.js"; // ✅ must match actual filename

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Mount routes
app.use("/api", scoreRoutes);

mongoose
  .connect("mongodb+srv://sitara:Pakistan@cluster0.bunqn28.mongodb.net/score?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
