import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import scoreRoutes from "./routes/scores.js";

dotenv.config(); // ✅ Load environment variables first

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Mount routes
app.use("/api", scoreRoutes);

// ✅ MongoDB connection
mongoose
  .connect("mongodb+srv://sitara:Pakistan@cluster0.bunqn28.mongodb.net/score?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// 🕵️ Debug info — shows which DB and host are being used
mongoose.connection.on("connected", () => {
  console.log("📂 Connected to DB:", mongoose.connection.name);
  console.log("🌐 Host:", mongoose.connection.host);
});

// ✅ Server setup
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is busy. Try a different one.`);
    process.exit(1);
  } else {
    console.error(err);
  }
});
