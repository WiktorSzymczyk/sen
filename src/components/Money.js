import React, { useState, useEffect } from "react";

const MoneyGame = () => {
  const [targetAmount, setTargetAmount] = useState(0); // Target amount to reach
  const [selectedCoins, setSelectedCoins] = useState({ 1: 0, 2: 0 }); // Track the number of each coin (1p and 2p)
  const [disabledCoins, setDisabledCoins] = useState({ 1: false, 2: false }); // Track if a coin in the middle is disabled
  const [message, setMessage] = useState(""); // Feedback message
  const [isComplete, setIsComplete] = useState(false); // Completion flag

  const coins = [1, 2]; // Coin denominations in pence

  // Generate a random target amount between 1 and 20
  const generateTargetAmount = () => {
    const randomAmount = Math.floor(Math.random() * 20) + 1; // Random number between 1 and 20
    setTargetAmount(randomAmount);
    setSelectedCoins({ 1: 0, 2: 0 }); // Reset selected coins
    setDisabledCoins({ 1: false, 2: false }); // Reset disabled coins
    setMessage("");
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

  // Handle click on the coins on the left
  const handleLeftCoinClick = (coin) => {
    // Toggle the disabled state for the corresponding coin in the middle
    setDisabledCoins((prev) => ({ ...prev, [coin]: !prev[coin] }));
  };

  // Handle click on the coins in the middle
  const handleMiddleCoinClick = (coin) => {
    if (disabledCoins[coin]) return; // Prevent interaction if the coin is disabled

    // Update selected coins
    const newSelectedCoins = { ...selectedCoins, [coin]: selectedCoins[coin] + 1 };
    setSelectedCoins(newSelectedCoins);

    const newTotal = calculateTotal() + coin;

    // Logic to check if the user has reached or exceeded the target amount
    if (newTotal === targetAmount) {
      setMessage("Well done! 🎉 You matched the amount!");
      setIsComplete(true);
    } else if (newTotal > targetAmount) {
      setMessage("Try again.");
      setSelectedCoins({ 1: 0, 2: 0 }); // Reset selected coins if over the target
    } else {
      setMessage(`You're at ${newTotal}p. Keep going!`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Coin Matching Game</h1>
      <p style={styles.instructions}>
        Click the coins on the **left** to toggle enable/disable coins in the **middle**. Use the coins in the middle to match the target amount.
      </p>

      {/* Display the target amount */}
      <div style={styles.target}>
        <h2>Target: {targetAmount}p</h2>
      </div>

      {/* Coins aligned vertically on the left */}
      <div style={styles.leftContainer}>
        {coins.map((coin, index) => (
          <button
            key={index}
            style={styles.coinButton}
            onClick={() => handleLeftCoinClick(coin)}
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

      {/* Coins in the center */}
      <div style={styles.centerContainer}>
        {coins.map((coin, index) => (
          <button
            key={index}
            style={{
              ...styles.coinButton,
              backgroundColor: disabledCoins[coin] ? "#ccc" : "#fff",
              cursor: disabledCoins[coin] ? "not-allowed" : "pointer",
            }}
            disabled={disabledCoins[coin]}
            onClick={() => handleMiddleCoinClick(coin)}
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: '"Arial", sans-serif',
    padding: "20px",
    textAlign: "center",
    position: "relative",
  },
  title: {
    fontSize: "24px",
    marginBottom: "10px",
    color: "#3B4CCA",
  },
  instructions: {
    fontSize: "18px",
    marginBottom: "20px",
  },
  target: {
    fontSize: "22px",
    marginBottom: "20px",
    color: "#FF4500",
  },
  leftContainer: {
    position: "fixed",
    left: "20px",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  centerContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "20px",
  },
  coinButton: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "5px",
    cursor: "pointer",
    textAlign: "center",
  },
  coinImage: {
    width: "50px",
    height: "50px",
  },
  tray: {
    marginTop: "20px",
    padding: "15px",
    border: "2px solid #3B4CCA",
    borderRadius: "10px",
    width: "300px",
    textAlign: "center",
  },
  total: {
    fontSize: "18px",
    marginTop: "10px",
  },
  trayCoinImage: {
    width: "40px",
    height: "40px",
    margin: "5px",
  },
  coinDisplay: {
    display: "flex",
    flexWrap: "wrap", // Allow wrapping if there are many coins
    justifyContent: "center",
    marginBottom: "10px",
  },
  message: {
    marginTop: "20px",
    fontSize: "20px",
    color: "#FF4500",
  },
  resetButton: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "18px",
    backgroundColor: "#FF4500",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
};

export default MoneyGame;
