import React, { useState, useEffect } from 'react';

const MoneyGame = () => {
  const [targetAmount, setTargetAmount] = useState(0); // Target amount to reach
  const [selectedCoins, setSelectedCoins] = useState({ 1: 0, 2: 0 }); // Track the number of each coin (1p and 2p)
  const [message, setMessage] = useState(''); // Feedback message
  const [isComplete, setIsComplete] = useState(false); // Completion flag

  const coins = [1, 2]; // Coin denominations in pence

  // Generate a random target amount between 0 and 20
  const generateTargetAmount = () => {
    const randomAmount = Math.floor(Math.random() * 21); // Random number between 0 and 20
    setTargetAmount(randomAmount);
    setSelectedCoins({ 1: 0, 2: 0 }); // Reset selected coins
    setMessage('');
    setIsComplete(false);
  };

  useEffect(() => {
    generateTargetAmount();
  }, []);

  // Calculate the total of selected coins
  const calculateTotal = () => {
    return Object.keys(selectedCoins).reduce(
      (sum, coin) => sum + selectedCoins[coin] * coin,
      0
    );
  };

  // Handle adding a coin
  const handleAddCoin = (coin) => {
    if (isComplete) return; // Prevent interaction if the game is complete
  
    // Calculate new selected coins state
    const newSelectedCoins = { ...selectedCoins, [coin]: selectedCoins[coin] + 1 };
  
    // Calculate the new total based on the updated coins
    const newTotal = Object.keys(newSelectedCoins).reduce(
      (sum, key) => sum + newSelectedCoins[key] * parseInt(key),
      0
    );
  
    setSelectedCoins(newSelectedCoins); // Update state with new selected coins
  
    // Logic to check if the user has reached or exceeded the target amount
    if (newTotal === targetAmount) {
      setMessage('Well done! 🎉 You matched the amount!');
      setIsComplete(true);
    } else if (newTotal > targetAmount) {
      setMessage('Oops! That’s too much. Try again.');
      setSelectedCoins({ 1: 0, 2: 0 }); // Reset selected coins if over the target
    } else {
      setMessage(`You're at ${newTotal}p. Keep going!`);
    }
  };
  

  

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Coin Matching Game</h1>
      <p style={styles.instructions}>
        Use the coins to match the target amount below. Click on the coins to add them to your tray.
      </p>

      {/* Display the target amount */}
      <div style={styles.target}>
        <h2>Target: {targetAmount}p</h2>
      </div>

      {/* Display the coins */}
      <div style={styles.coinContainer}>
        {coins.map((coin, index) => (
          <button
            key={index}
            style={styles.coinButton}
            onClick={() => handleAddCoin(coin)}
          >
            <img 
              src={`/images/${coin}.jpg`} // Image path referencing the public folder
              alt={`${coin}p coin`}
              style={styles.coinImage}
            />
            <br />
            {coin}p
          </button>
        ))}
      </div>

      {/* User's tray */}
      <div style={styles.tray}>
    <h2>Your Tray</h2>
    <div style={styles.coinDisplay}>
        {selectedCoins[1] > 0 &&
        Array.from({ length: selectedCoins[1] }).map((_, index) => (
            <img
            key={`1p-${index}`}
            src={`/images/1.jpg`} // Image path for 1p coin
            alt="1p coin"
            style={styles.trayCoinImage}
            />
        ))}
        {selectedCoins[2] > 0 &&
        Array.from({ length: selectedCoins[2] }).map((_, index) => (
            <img
            key={`2p-${index}`}
            src={`/images/2.jpg`} // Image path for 2p coin
            alt="2p coin"
            style={styles.trayCoinImage}
            />
        ))}
        {selectedCoins[1] === 0 && selectedCoins[2] === 0 && (
        <p>No coins added yet.</p>
        )}
    </div>
    <p style={styles.total}>Total: {calculateTotal()}p</p>
    </div>


      {/* Feedback Message */}
      {message && <h3 style={styles.message}>{message}</h3>}

      {/* Reset Game Button */}
      {isComplete && (
        <button style={styles.resetButton} onClick={generateTargetAmount}>
          Play Again
        </button>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: '"Arial", sans-serif',
    padding: '20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    marginBottom: '10px',
    color: '#3B4CCA',
  },
  instructions: {
    fontSize: '18px',
    marginBottom: '20px',
  },
  target: {
    fontSize: '22px',
    marginBottom: '20px',
    color: '#FF4500',
  },
  coinContainer: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
  },
  coinButton: {
    padding: '10px 20px',
    fontSize: '28px',
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column', // Stack the image and text vertically
    alignItems: 'center', // Center the content
  },
  coinImage: {
    width: '80px',
    height: '80px',
    marginBottom: '10px', // Space between image and text
  },
  tray: {
    marginTop: '20px',
    padding: '15px',
    border: '2px solid #3B4CCA',
    borderRadius: '10px',
    width: '300px',
    textAlign: 'center',
  },
  total: {
    fontSize: '18px',
    marginTop: '10px',
  },
  message: {
    marginTop: '20px',
    fontSize: '20px',
    color: '#FF4500',
  },
  resetButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '18px',
    backgroundColor: '#FF4500',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  trayCoinImage: {
    width: '40px',
    height: '40px',
    margin: '5px',
  },
  coinDisplay: {
    display: 'flex',
    flexWrap: 'wrap', // Allow wrapping if there are many coins
    justifyContent: 'center',
    marginBottom: '10px',
  },
  
};

export default MoneyGame;
