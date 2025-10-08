import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Start from "./Start";
import Game from "./Game";
import Leaderboard from "./Leaderboard";

export default function App() {
  return (
    <Router>
      {/* Background music for all pages */}
      <audio src="/starMusic.mp3" autoPlay loop style={{ display: "none" }} />

      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/game" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}
