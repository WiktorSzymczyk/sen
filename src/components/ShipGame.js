// src/ShipGame.js
import React, { useState, useEffect, useRef } from "react";
import "./ShipGame.css"; // Custom CSS for the game

function ShipGame() {
  const [shipPosition, setShipPosition] = useState(50); // Ship position (percentage from left)
  const [riverWidth, setRiverWidth] = useState(50); // Width of the safe river path
  const [gameOver, setGameOver] = useState(false);
  const gameRef = useRef(null);

  // Move ship left or right
  const handleKeyDown = (e) => {
    if (gameOver) return;

    if (e.key === "ArrowLeft") {
      setShipPosition((prev) => Math.max(prev - 5, 0)); // Prevent moving beyond left boundary
    } else if (e.key === "ArrowRight") {
      setShipPosition((prev) => Math.min(prev + 5, 100)); // Prevent moving beyond right boundary
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameOver]);

  // Check if the ship hits the riverbank
  useEffect(() => {
    const interval = setInterval(() => {
      const riverLeft = (100 - riverWidth) / 2; // Calculate river bounds
      const riverRight = riverLeft + riverWidth;

      if (shipPosition < riverLeft || shipPosition > riverRight) {
        setGameOver(true);
        clearInterval(interval);
      }
    }, 100); // Check every 100ms

    return () => clearInterval(interval);
  }, [shipPosition, riverWidth]);

  // Gradually decrease river width to increase difficulty
  useEffect(() => {
    const difficultyInterval = setInterval(() => {
      setRiverWidth((prev) => Math.max(prev - 1, 20)); // Minimum width of 20%
    }, 2000); // Every 2 seconds

    if (gameOver) {
      clearInterval(difficultyInterval);
    }

    return () => clearInterval(difficultyInterval);
  }, [gameOver]);

  const restartGame = () => {
    setShipPosition(50);
    setRiverWidth(50);
    setGameOver(false);
  };

  return (
    <div className="game-container" ref={gameRef}>
      <h1>Steer the Ship!</h1>
      {/* <p>Use the left and right arrow keys to steer the ship.</p>
      {gameOver ? (
        <div className="game-over">
          <h2>Game Over!</h2>
          <button onClick={restartGame}>Restart</button>
        </div>
      ) : (
        <>
          <div
            className="river"
            style={{
              width: `${riverWidth}%`,
              left: `${(100 - riverWidth) / 2}%`,
            }}
          ></div>
          <div
            className="ship"
            style={{
              left: `${shipPosition}%`,
            }}
          >
            <img src="/images/ship.png" alt="Ship" />
          </div>
        </>
      )} */}
    </div>
  );
}

export default ShipGame;
