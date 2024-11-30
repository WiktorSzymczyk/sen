import React, { useState, useEffect } from 'react';

const ShapeGuessingGame = () => {
  const [shape, setShape] = useState(''); // Store the current shape to display
  const [options, setOptions] = useState([]); // Store the answer options
  const [correctAnswer, setCorrectAnswer] = useState(''); // Store the correct answer
  const [message, setMessage] = useState(''); // Feedback message
  const [isWaiting, setIsWaiting] = useState(false); // Disable interaction during wait

  // List of possible shapes
  const shapes = ['Circle', 'Square', 'Triangle', 'Rectangle', 'Hexagon'];

  // Initialize a random shape and options
  const initializeGame = () => {
    const correct = shapes[Math.floor(Math.random() * shapes.length)];

    // Generate unique options (exclude the correct answer)
    const remainingShapes = shapes.filter((shape) => shape !== correct);
    const randomOptions = remainingShapes
      .sort(() => Math.random() - 0.5) // Shuffle remaining shapes
      .slice(0, 2); // Take two unique shapes
    const allOptions = [...randomOptions, correct].sort(() => Math.random() - 0.5); // Add correct answer and shuffle

    setShape(correct);
    setOptions(allOptions);
    setCorrectAnswer(correct);
    setMessage('');
    setIsWaiting(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  // Handle when a user clicks an option
  const handleOptionClick = (option) => {
    if (isWaiting) return; // Prevent interaction during wait
    if (option === correctAnswer) {
      setMessage('Correct! 🎉');
      setIsWaiting(true); // Set waiting state
      setTimeout(() => {
        initializeGame(); // Load the next shape after 5 seconds
      }, 2000);
    } else {
      setMessage('Wrong! Try again. 😢');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Guess the Shape</h1>
      {/* Shape Display */}
      <div style={styles.shapeContainer}>
        {shape === 'Circle' && <div style={styles.circle}></div>}
        {shape === 'Square' && <div style={styles.square}></div>}
        {shape === 'Triangle' && <div style={styles.triangle}></div>}
        {shape === 'Rectangle' && <div style={styles.rectangle}></div>}
        {shape === 'Hexagon' && (
          <div style={styles.hexagon}>
            <div style={styles.hexagonBefore}></div>
            <div style={styles.hexagonAfter}></div>
          </div>
        )}
      </div>
      {/* Options */}
      <div style={styles.optionsContainer}>
        {options.map((option, index) => (
          <button
            key={index}
            style={styles.optionButton}
            onClick={() => handleOptionClick(option)}
            disabled={isWaiting} // Disable buttons during waiting
          >
            {option}
          </button>
        ))}
      </div>
      {/* Feedback Message */}
      {message && <h2 style={styles.message}>{message}</h2>}
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontFamily: '"Press Start 2P", cursive',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#3B4CCA',
  },
  shapeContainer: {
    margin: '20px auto',
    width: '150px',
    height: '150px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: '100px',
    height: '100px',
    backgroundColor: '#FF0000',
    borderRadius: '50%',
  },
  square: {
    width: '100px',
    height: '100px',
    backgroundColor: '#008000',
  },
  triangle: {
    width: '0',
    height: '0',
    borderLeft: '50px solid transparent',
    borderRight: '50px solid transparent',
    borderBottom: '100px solid #FFA500',
  },
  rectangle: {
    width: '150px',
    height: '100px',
    backgroundColor: '#0000FF',
  },
  hexagon: {
    width: '100px',
    height: '57.74px',
    backgroundColor: '#800080',
    position: 'relative',
    margin: '28.87px auto',
  },
  hexagonBefore: {
    content: '""',
    position: 'absolute',
    top: '-28.87px',
    left: '0',
    width: '0',
    height: '0',
    borderLeft: '50px solid transparent',
    borderRight: '50px solid transparent',
    borderBottom: '28.87px solid #800080',
  },
  hexagonAfter: {
    content: '""',
    position: 'absolute',
    bottom: '-28.87px',
    left: '0',
    width: '0',
    height: '0',
    borderLeft: '50px solid transparent',
    borderRight: '50px solid transparent',
    borderTop: '28.87px solid #800080',
  },
  optionsContainer: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  optionButton: {
    padding: '12px 20px',
    fontSize: '16px',
    backgroundColor: '#fff',
    color: '#f44265',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  message: {
    marginTop: '20px',
    fontSize: '20px',
    color: '#000',
  },
};

export default ShapeGuessingGame;
