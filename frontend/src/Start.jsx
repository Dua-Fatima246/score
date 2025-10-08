import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Start() {
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  const startGame = () => {
    const trimmedName = playerName.trim();
    if (!trimmedName) {
      alert("Please enter your name before starting the game!");
      return;
    }
    navigate("/game", { state: { playerName: trimmedName } });
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(-45deg, #a1c4fd, #c2e9fb, #fbc2eb, #fcd1d1)",
    backgroundSize: "400% 400%",
    animation: "gradientAnimation 15s ease infinite",
  };

  const h1Style = {
    fontSize: "3rem",
    color: "#1a800fe1",
    textShadow: "2px 2px 10px rgba(0,0,0,0.3)",
  };

  const inputStyle = {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    width: "250px",
    textAlign: "center",
    transition: "transform 0.2s, boxShadow 0.2s",
  };

  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#1de8e8ff",
    color: "#300ab9ff",
    fontWeight: "bold",
    transition: "transform 0.2s, boxShadow 0.2s",
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes gradientAnimation {
            0% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
            100% {background-position: 0% 50%;}
          }
          input:focus {
            transform: scale(1.05);
            box-shadow: 0 0 10px rgba(255,255,255,0.7);
          }
          button:hover {
            transform: scale(1.05);
            box-shadow: 0 0 15px rgba(255,255,255,0.7);
          }
        `}
      </style>
      <h1 style={h1Style}>Fun Game</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        style={inputStyle}
      />
      <br />
      <br />
      <button onClick={startGame} style={buttonStyle}>
        Start Game
      </button>
    </div>
  );
}
