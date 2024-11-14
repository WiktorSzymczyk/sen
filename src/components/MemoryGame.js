import React, { useState, useEffect } from 'react';

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [question, setQuestion] = useState(""); // Store the question
  const [options, setOptions] = useState([]); // Store the multiple choice options
  const [correctAnswer, setCorrectAnswer] = useState(""); // Store correct answer
  const [selectedAnswer, setSelectedAnswer] = useState(""); // Store user's answer
  const [pokemonImage, setPokemonImage] = useState(""); // Store the Pokémon image
  const [questionAsked, setQuestionAsked] = useState(false); // Track if the question has been answered

  // Fetch 6 random Pokémon images
  const fetchPokemonImages = async () => {
    setLoading(true);
    const pokemonData = [];
    const fetchPromises = [];

    for (let i = 0; i < 6; i++) {
      const randomId = Math.floor(Math.random() * 150) + 1;
      fetchPromises.push(
        fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
          .then((res) => res.json())
          .then((data) => {
            pokemonData.push({
              id: data.id,
              name: data.name,
              color: data.color, // Add color information
              src: data.sprites.front_default,
            });
          })
      );
    }

    await Promise.all(fetchPromises);
    setLoading(false);
    return pokemonData;
  };

  // Initialize the cards
  const initializeCards = async () => {
    const images = await fetchPokemonImages();
    const allPairs = [...images, ...images];
    const shuffledCards = allPairs
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setGameOver(false);
    setQuestion(""); // Reset question when reloading
    setOptions([]); // Reset options when reloading
    setPokemonImage(""); // Reset Pokémon image when reloading
    setQuestionAsked(false); // Reset the question state
  };

  useEffect(() => {
    initializeCards();
  }, []);

  const handleFlip = (card) => {
    if (disabled) return;
    if (flippedCards.length < 2 && !flippedCards.includes(card.id)) {
      setFlippedCards((prev) => [...prev, card.id]);
    }
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setDisabled(true);
      const [firstCard, secondCard] = flippedCards.map((id) =>
        cards.find((card) => card.id === id)
      );

      // Set a trivia question based on the first flipped card
      if (firstCard.name === secondCard.name) {
        setMatchedCards((prev) => [...prev, firstCard.name]);
        setFlippedCards([]);
        setDisabled(false);
      } else {
        // Show question
        const questionText = `What color is ${firstCard.name}?`;
        const correctAnswer = firstCard.color;
        const options = generateOptions(correctAnswer, firstCard.color);

        setQuestion(questionText);
        setCorrectAnswer(correctAnswer);
        setOptions(options);
        setPokemonImage(firstCard.src); // Set the Pokémon image to display
        setQuestionAsked(true); // Mark that the question was asked
        setTimeout(() => {
          setFlippedCards([]); // Reset flipped cards after delay
          setDisabled(false);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  const generateOptions = (correctAnswer, color) => {
    const colors = ['red', 'green', 'blue', 'yellow', 'black', 'purple']; // Example options
    const shuffledColors = colors.sort(() => Math.random() - 0.5);
    const options = shuffledColors.slice(0, 3);
    options.push(correctAnswer);
    return options.sort(() => Math.random() - 0.5); // Shuffle options
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    if (answer === correctAnswer) {
      // Answer is correct
      setMatchedCards((prev) => [...prev, correctAnswer]);
      setFlippedCards([]);
      setQuestion(""); // Hide the question box
      setOptions([]); // Clear the options
      setPokemonImage(""); // Remove the image
      setQuestionAsked(false); // Reset question asked state
    } else {
      // Answer is incorrect, reset flipped cards
      setTimeout(() => {
        setFlippedCards([]);
        setQuestion(""); // Hide the question box
        setOptions([]); // Clear the options
        setPokemonImage(""); // Remove the image
        setQuestionAsked(false); // Reset question asked state
        setDisabled(false); // Enable clicking on cards again
      }, 1000);
    }
  };

  // Check if game is over (all pairs matched)
  useEffect(() => {
    if (matchedCards.length === cards.length / 2) {
      setGameOver(true);
    }
  }, [matchedCards, cards]);

  return (
      <div style={styles.container}>
        <div><button onClick={MemoryGame}>Page</button></div>
      <h1 style={styles.title}>Pokémon Memory Game</h1>
      <button style={styles.reloadButton} onClick={initializeCards}>
        Reload Game
      </button>
      {loading ? (
        <h2 style={styles.loadingText}>Loading Pokémon...</h2>
      ) : (
        <div style={styles.grid}>
          {cards.map((card) => (
            <div
              key={card.id}
              style={{
                ...styles.card,
                ...(flippedCards.includes(card.id) || matchedCards.includes(card.name)
                  ? styles.flipped
                  : {}),
              }}
              onClick={() => handleFlip(card)}
            >
              {flippedCards.includes(card.id) || matchedCards.includes(card.name) ? (
                <img src={card.src} alt={card.name} style={styles.image} />
              ) : (
                <div style={styles.cover}></div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Display Question if Two Cards are Flipped */}
      {questionAsked && (
        <div style={styles.questionBox}>
          <h2 style={styles.questionText}>{question}</h2>
          {/* Display the Pokémon image below the question */}
          <img src={pokemonImage} alt="Pokémon" style={styles.pokemonImage} />
          <div style={styles.optionsContainer}>
            {options.map((option, index) => (
              <button
                key={index}
                style={styles.optionButton}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Show "You Won!" bar in the middle of the screen */}
      {gameOver && (
        <div style={styles.gameOverBar}>
          <h2 style={styles.gameOverText}>You Won!</h2>
        </div>
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
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
    backgroundImage: 'url("https://pbs.twimg.com/media/EWoQbTdUcAII_pP.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  title: {
    fontFamily: '"Press Start 2P", cursive',
    fontSize: '28px',
    color: '#FFDE00',
    textShadow: '2px 2px 4px #3B4CCA',
    marginBottom: '20px',
  },
  reloadButton: {
    fontFamily: '"Press Start 2P", cursive',
    padding: '12px 24px',
    margin: '20px',
    cursor: 'pointer',
    fontSize: '16px',
    backgroundColor: '#FF0000',
    color: '#fff',
    border: '2px solid #3B4CCA',
    borderRadius: '12px',
    boxShadow: '0px 4px #3B4CCA',
    transition: 'transform 0.2s ease',
  },
  loadingText: {
    fontFamily: '"Press Start 2P", cursive',
    fontSize: '24px',
    color: '#FFF',
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 120px)',
    gap: '15px',
    marginTop: '30px',
  },
  card: {
    width: '120px',
    height: '120px',
    position: 'relative',
    cursor: 'pointer',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '3px solid #3B4CCA',
  },
  flipped: {
    transform: 'rotateY(0deg)',
  },
  cover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: '10px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '10px',
  },
  gameOverBar: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '20px',
    textAlign: 'center',
    zIndex: 1000,
  },
  gameOverText: {
    fontFamily: '"Press Start 2P", cursive',
    fontSize: '48px',
    color: '#FFDE00',
    textShadow: '2px 2px 4px #3B4CCA',
  },
  questionBox: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0px 4px 10px rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  questionText: {
    fontFamily: '"Press Start 2P", cursive',
    fontSize: '22px',
    marginBottom: '10px',
  },
  pokemonImage: {
    width: '100px',
    height: '100px',
    marginBottom: '10px',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  optionButton: {
    fontFamily: '"Press Start 2P", cursive',
    padding: '10px 20px',
    margin: '10px',
    cursor: 'pointer',
    fontSize: '18px',
    backgroundColor: '#FF0000',
    color: '#fff',
    border: '2px solid #3B4CCA',
    borderRadius: '12px',
    transition: 'transform 0.2s ease',
  },
};

export default MemoryGame;
