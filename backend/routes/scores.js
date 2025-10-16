import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Schema
const scoreSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  score: { type: Number, required: true },
  level: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Model
const Score = mongoose.models.Score || mongoose.model("Score", scoreSchema);

// ✅ POST /api/scores → Save new score
router.post("/scores", async (req, res) => {
  try {
    const { playerName, score, level } = req.body;
    console.log("📩 Received score:", req.body);

    const newScore = new Score({ playerName, score, level });

    console.log("🧠 Using DB:", mongoose.connection.name);
    console.log("📁 Collection:", Score.collection.name);

    const saved = await newScore.save();

    console.log("✅ Saved to MongoDB:", saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error saving score:", err.message);
    console.error(err.stack);
    res.status(500).json({ error: "Failed to save score" });
  }
});

// ✅ GET /api/scores → Fetch all scores
router.get("/scores", async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1 });
    res.json(scores);
  } catch (err) {
    console.error("❌ Error fetching scores:", err);
    res.status(500).json({ error: "Failed to fetch scores" });
  }
});

export default router;
