import React, { useState, useEffect } from 'react';

const JumpingGame = () => {
  const [jumping, setJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [obstaclePosition, setObstaclePosition] = useState(500); // position of obstacle (right side of the screen)
  const [playerBottom, setPlayerBottom] = useState(50); // Player position (used for detecting jumping height)
  const [rotation, setRotation] = useState(0); // Rotation angle of the player

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setObstaclePosition(prev => prev - 5); // Move the obstacle left
      if (obstaclePosition < 0) {
        setObstaclePosition(500); // Reset obstacle position
        setScore(prev => prev + 1); // Increase score as obstacle passes
      }

      // Check for collision with jumping state
      // Collision only happens when player is in the air (playerBottom > 50)
      // and the obstacle is in the same horizontal range
      if (jumping && playerBottom > 50 && playerBottom < 200 && 
          obstaclePosition < 100 && obstaclePosition > 50) {
        setGameOver(true);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [obstaclePosition, jumping, playerBottom, gameOver]);

  const handleJump = () => {
    if (!jumping && !gameOver) {
      setJumping(true);
      setRotation(20); // Start rotating the square when jumping

      // Start the jump with animation
      setPlayerBottom(200); // Initial jump position (upwards)
      setTimeout(() => {
        setPlayerBottom(50); // Fall back to the ground (bouncy effect)
        setRotation(-20); // Rotate back while falling
        setTimeout(() => {
          setRotation(0); // Reset rotation when player hits the ground
          setJumping(false); // End the jump
        }, 200);
      }, 750); // Full jump lasts 750ms
    }
  };

  return (
    <div style={styles.container}>
      {/* <h1 style={styles.title}>Jumping Game</h1>
      <p>Score: {score}</p>
      <div
        style={{
          ...styles.player,
          bottom: `${playerBottom}px`, // Player position based on jumping state
          transform: `rotate(${rotation}deg)`, // Apply rotation during jump
        }}
      ></div>
      <div
        style={{
          ...styles.obstacle,
          left: `${obstaclePosition}px`, // Move obstacle left
        }}
      ></div>
      {gameOver && (
        <div style={styles.gameOver}>
          <h2>Game Over!</h2>
          <button onClick={() => window.location.reload()} style={styles.playAgainButton}>
            Play Again
          </button>
        </div>
      )}
      <button onClick={handleJump} style={styles.jumpButton}>
        Jump
      </button> */}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '400px',
    backgroundColor: '#87CEEB',
    overflow: 'hidden',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff',
  },
  player: {
    position: 'absolute',
    bottom: '50px',
    left: '50px',
    width: '50px',
    height: '50px',
    backgroundColor: '#FFD700', // Representing player with a yellow square
    borderRadius: '10px',
    transition: 'transform 0.2s ease', // Smooth rotation transition
    animation: 'jump 1s ease-out', // Apply the jumping animation (bounce effect)
  },
  obstacle: {
    position: 'absolute',
    bottom: '50px',
    width: '30px',
    height: '50px',
    backgroundColor: '#8B0000', // Representing obstacle with a red block
    borderRadius: '5px',
  },
  gameOver: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '20px',
    color: '#fff',
    borderRadius: '10px',
  },
  playAgainButton: {
    padding: '10px 20px',
    backgroundColor: '#FF4500',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  jumpButton: {
    position: 'absolute',
    bottom: '10px',
    padding: '10px 20px',
    backgroundColor: '#32CD32',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

// CSS for the jumping effect and bounce
const stylesKeyframes = `
  @keyframes jump {
    0% {
      bottom: 50px; /* Start at the ground */
    }
    30% {
      bottom: 200px; /* Reach the peak of the jump */
    }
    50% {
      bottom: 180px; /* Simulate a small bounce */
    }
    70% {
      bottom: 190px; /* Slight overshoot */
    }
    100% {
      bottom: 50px; /* Return to the ground */
    }
  }
`;

export default JumpingGame;
