import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Game() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const playerName = location.state?.playerName || "Guest";

  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(40);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth * 0.85,
    height: window.innerHeight * 0.6,
  });

  const keysRef = useRef({});
  const mobileKeysRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  // ✅ Responsive canvas
  useEffect(() => {
    const handleResize = () =>
      setCanvasSize({
        width: window.innerWidth * 0.85,
        height: window.innerHeight * 0.6,
      });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Save score
  const saveScore = async () => {
    try {
      console.log("💾 Saving score:", { playerName, score, level });
      await axios.post("http://localhost:5000/api/scores", {
        playerName,
        score,
        level,
      });
    } catch (err) {
      console.error("❌ Error saving score:", err);
    }
  };

  // ✅ Game loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    let playerBall = createPlayerBall(width, height);
    let { stars, obstacles } = makeLevelEntities(level, width, height);

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    let animation;

    const gameOverTrigger = () => {
      cancelAnimationFrame(animation);
      clearInterval(timer);
      setGameOver(true);
      saveScore();
    };

    const loop = () => {
      if (isPaused) return;

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#a1c4fd");
      gradient.addColorStop(0.5, "#c2e9fb");
      gradient.addColorStop(1, "#fbc2eb");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      drawBall(ctx, playerBall.x, playerBall.y, playerBall.r, playerBall.color);
      stars.forEach((s) => drawStar(ctx, s.x, s.y, s.r, s.color));

      obstacles.forEach((o) => {
        ctx.fillStyle = "rgba(255,70,70,0.9)";
        ctx.fillRect(o.x, o.y, o.w, o.h);
        o.x += o.dx;
        if (o.x < 0 || o.x + o.w > width) o.dx *= -1;
      });

      const step = 7;
      if (keysRef.current["ArrowUp"] || mobileKeysRef.current.up)
        playerBall.y -= step;
      if (keysRef.current["ArrowDown"] || mobileKeysRef.current.down)
        playerBall.y += step;
      if (keysRef.current["ArrowLeft"] || mobileKeysRef.current.left)
        playerBall.x -= step;
      if (keysRef.current["ArrowRight"] || mobileKeysRef.current.right)
        playerBall.x += step;

      playerBall.x = Math.max(
        playerBall.r,
        Math.min(width - playerBall.r, playerBall.x)
      );
      playerBall.y = Math.max(
        playerBall.r,
        Math.min(height - playerBall.r, playerBall.y)
      );

      stars = stars.filter((s) => {
        const dist = Math.hypot(playerBall.x - s.x, playerBall.y - s.y);
        if (dist < playerBall.r + s.r) {
          setScore((prev) => prev + 10);
          return false;
        }
        return true;
      });

      for (let o of obstacles) {
        if (
          playerBall.x + playerBall.r > o.x &&
          playerBall.x - playerBall.r < o.x + o.w &&
          playerBall.y + playerBall.r > o.y &&
          playerBall.y - playerBall.r < o.y + o.h
        ) {
          return gameOverTrigger();
        }
      }

      if (stars.length === 0) {
        setLevel((prev) => prev + 1);
        setTimeLeft(40);
        const next = makeLevelEntities(level + 1, width, height);
        stars = next.stars;
        obstacles = next.obstacles;
      }

      animation = requestAnimationFrame(loop);
    };

    loop();

    const handleKeyDown = (e) => (keysRef.current[e.key] = true);
    const handleKeyUp = (e) => (keysRef.current[e.key] = false);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animation);
      clearInterval(timer);
    };
  }, [level, isPaused, canvasSize]);

  // ✅ Save score when timer ends
  useEffect(() => {
    if (timeLeft <= 0 && !gameOver) {
      setGameOver(true);
      saveScore();
    }
  }, [timeLeft]);

  // ✅ Bright-dark collecting ball
  const createPlayerBall = (width, height) => ({
    x: width / 2,
    y: height / 2,
    r: 15,
    color: `hsl(${Math.random() * 360}, 90%, 45%)`,
  });

  const drawBall = (ctx, x, y, r, color) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.restore();
  };

  const drawStar = (ctx, x, y, r, color) => {
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(
        x + r * Math.cos(((18 + i * 72) / 180) * Math.PI),
        y - r * Math.sin(((18 + i * 72) / 180) * Math.PI)
      );
      ctx.lineTo(
        x + (r / 2) * Math.cos(((54 + i * 72) / 180) * Math.PI),
        y - (r / 2) * Math.sin(((54 + i * 72) / 180) * Math.PI)
      );
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.restore();
  };

  // ✅ Stars darker
  const makeLevelEntities = (lvl, width, height) => {
    const stars = Array.from({ length: 5 + lvl }, () => ({
      x: Math.random() * (width - 60) + 30,
      y: Math.random() * (height - 60) + 30,
      r: 10 + Math.random() * 5,
      color: `hsl(${Math.random() * 360}, 100%, 40%)`,
    }));

    const obstacles = Array.from({ length: lvl }, () => ({
      x: Math.random() * (width - 60) + 20,
      y: Math.random() * (height - 60) + 20,
      w: 40 + Math.random() * 20,
      h: 10 + Math.random() * 10,
      dx: Math.random() < 0.5 ? -2 : 2,
    }));

    return { stars, obstacles };
  };

  const handleMobileMove = (key, state) =>
    (mobileKeysRef.current[key] = state);

  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "sans-serif",
        minHeight: "100vh",
        backgroundColor: "black",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: gameOver ? "center" : "flex-start",
        alignItems: "center",
        position: "relative",
      }}
    >
      {!gameOver ? (
        <>
          {/* ✅ Centered Info Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px 0",
              color: "#b3ef0ffd",
              width: "100%",
              textAlign: "center",
            }}
          >
            <h2>
              {playerName} | Score: {score} | Level: {level} | Time: {timeLeft}
            </h2>
          </div>

          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            style={{
              border: "3px solid white",
              borderRadius: "15px",
              display: "block",
              margin: "0 auto",
              maxWidth: "90%",
            }}
          />

          {/* ✅ Mobile Controls */}
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <button
              onTouchStart={() => handleMobileMove("up", true)}
              onTouchEnd={() => handleMobileMove("up", false)}
            >
              ⬆️
            </button>
            <button
              onTouchStart={() => handleMobileMove("left", true)}
              onTouchEnd={() => handleMobileMove("left", false)}
            >
              ⬅️
            </button>
            <button
              onTouchStart={() => handleMobileMove("down", true)}
              onTouchEnd={() => handleMobileMove("down", false)}
            >
              ⬇️
            </button>
            <button
              onTouchStart={() => handleMobileMove("right", true)}
              onTouchEnd={() => handleMobileMove("right", false)}
            >
              ➡️
            </button>
          </div>

          {/* ✅ Pause Button below arrows */}
          <button
            onClick={() => setIsPaused((p) => !p)}
            style={{
              marginTop: "15px",
              padding: "8px 16px",
              borderRadius: "6px",
              background: "#5fe8a6ff",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        </>
      ) : (
        <div
          style={{
            textAlign: "center",
            background:
              "linear-gradient(135deg, #fbc2eb, #b2ecacff, #15c6e5ff)",
            padding: "40px 70px",
            borderRadius: "25px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            color: "#333",
            animation: "fadeIn 1s ease",
          }}
        >
          <h2
            style={{
              fontSize: "2.2rem",
              marginBottom: "10px",
              color: "#0f1ee7ff",
              textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
            }}
          >
            Game Over!
          </h2>
          <p
            style={{
              fontSize: "1.3rem",
              marginBottom: "20px",
              color: "#fff",
            }}
          >
            Score: {score}
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Restart
            </button>
            <button
              onClick={() => navigate("/leaderboard")}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Leaderboard
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}
