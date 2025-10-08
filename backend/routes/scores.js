import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Schema
const scoreSchema = new mongoose.Schema({
  playerName: String,
  score: Number,
  level: Number,
  createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite error in dev
const Score = mongoose.models.Score || mongoose.model("Score", scoreSchema);

// ✅ POST /api/scores → Save new score
router.post("/scores", async (req, res) => {
  try {
    const { playerName, score, level } = req.body;
    const newScore = new Score({ playerName, score, level });
    await newScore.save();
    res.status(201).json(newScore);
  } catch (err) {
    console.error("❌ Error saving score:", err);
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
