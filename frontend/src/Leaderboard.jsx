import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch leaderboard data
  useEffect(() => {
    const fetchScores = async () => {
      try {
        // ✅ Use the correct route name
        const res = await axios.get("http://localhost:5000/api/scores");
        setScores(res.data);
      } catch (err) {
        console.error("❌ Error fetching leaderboard:", err);
      }
    };
    fetchScores();
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background:
          "linear-gradient(135deg, #a1c4fd, #c2e9fb, #fbc2eb, #fcd3e1)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxSizing: "border-box",
        padding: "20px",
      }}
    >
      <h1
        style={{
          marginBottom: "30px",
          color: "#fff",
          textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
          textAlign: "center",
          fontSize: "2.5rem",
        }}
      >
        Leaderboard
      </h1>

      <div
        style={{
           minHeight: "50vh", // ✅ full viewport height
           width: "90vw", // ✅ full viewport width
          overflowX: "auto",
        }}
      >
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          }}
        >
          <thead style={{ background: "#6a11cb", color: "#fff" }}>
            <tr>
              <th style={{ padding: "12px" }}>Player</th>
              <th style={{ padding: "12px" }}>Score</th>
              <th style={{ padding: "12px" }}>Level</th>
            </tr>
          </thead>
          <tbody>
            {scores.length > 0 ? (
              scores.map((s, i) => (
                <tr key={i} style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
                  {/* ✅ Match your backend model (playerName, score, level) */}
                  <td style={{ padding: "10px" }}>{s.playerName}</td>
                  <td style={{ padding: "10px" }}>{s.score}</td>
                  <td style={{ padding: "10px" }}>{s.level}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ padding: "15px", textAlign: "center" }}>
                  No scores yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          background: "#6a11cb",
          color: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        Restart Game
      </button>

      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
}
