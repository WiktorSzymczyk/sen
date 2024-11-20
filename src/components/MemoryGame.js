import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate(); // Declare navigate hook

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
              src: data.sprites.front_default,
            });
          })
      );
    }

    await Promise.all(fetchPromises);
    setLoading(false);
    return pokemonData;
  };

  const initializeCards = async () => {
    const images = await fetchPokemonImages();
    const allPairs = [...images, ...images];
    const shuffledCards = allPairs
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, uniqueId: `${card.id}-${index}` }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setGameOver(false);
    setGameStarted(false);
  };

  useEffect(() => {
    initializeCards();
  }, []);

  const handleFlip = (card) => {
    if (disabled || flippedCards.includes(card.uniqueId)) return;

    setFlippedCards((prev) => [...prev, card.uniqueId]);

    if (flippedCards.length === 1) {
      setDisabled(true);

      const firstCard = cards.find((c) => c.uniqueId === flippedCards[0]);
      const secondCard = card;

      if (firstCard.name === secondCard.name) {
        setMatchedCards((prev) => [...prev, firstCard.name]);
        setFlippedCards([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matchedCards.length === cards.length / 2) {
      setGameOver(true);
    }
  }, [matchedCards, cards]);

  const startGame = () => {
    // Play the music
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error('Error playing audio:', err);
      });
    }
    setIsMusicPlaying(true);

    // Reveal all cards briefly
    setFlippedCards(cards.map((card) => card.uniqueId));

    setTimeout(() => {
      setFlippedCards([]);
      setGameStarted(true);
    }, 2000); // Cards are revealed for 2 seconds
  };

  const handleSwitchToJumping = () => {
    // Navigate to Jumping Game
    navigate('/jumping');
  };

  return (
    <div>
      <div style={styles.container}>
        <audio ref={audioRef} src="/sounds/background.mp3" loop />
        <h1 style={styles.title}>Pokémon Memory Game</h1>

        {!gameStarted && !gameOver && (
          <button style={styles.startGameButton} onClick={startGame}>
            Play Game
          </button>
        )}

        {loading ? (
          <h2 style={styles.loadingText}>Loading Pokémon...</h2>
        ) : (
          <div style={styles.grid}>
            {cards.map((card) => (
              <div
                key={card.uniqueId}
                style={{
                  ...styles.card,
                  ...(flippedCards.includes(card.uniqueId) || matchedCards.includes(card.name)
                    ? styles.flipped
                    : {}),
                  ...(matchedCards.includes(card.name) ? styles.matched : {}),
                }}
                onClick={() => (gameStarted ? handleFlip(card) : null)}
              >
                {flippedCards.includes(card.uniqueId) || matchedCards.includes(card.name) ? (
                  <img src={card.src} alt={card.name} style={styles.image} />
                ) : (
                  <div style={styles.cover}></div>
                )}
              </div>
            ))}
          </div>
        )}

        {gameOver && (
          <div style={styles.gameOverBar}>
            <h2 style={styles.gameOverText}>You Won!</h2>
            <button style={styles.playAgainButton} onClick={initializeCards}>
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

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
  startGameButton: {
    fontFamily: '"Press Start 2P", cursive',
    padding: '12px 24px',
    cursor: 'pointer',
    fontSize: '16px',
    backgroundColor: '#3B4CCA',
    color: '#fff',
    border: '2px solid #FFDE00',
    borderRadius: '12px',
    boxShadow: '0px 4px #FFDE00',
    marginTop: '20px',
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
    transform: 'rotateY(180deg)',
    transition: 'transform 0.6s',
  },
  flipped: {
    transform: 'rotateY(0deg)',
  },
  matched: {
    border: '3px solid #FFD700',
    boxShadow: '0px 0px 20px #FFD700',
  },
  cover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: '10px',
    boxShadow: 'inset 0px 0px 5px rgba(0, 0, 0, 0.3)',
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
    textAlign: 'center',
    backgroundColor: '#FFDE00',
    padding: '20px',
    borderRadius: '15px',
  },
  gameOverText: {
    fontFamily: '"Press Start 2P", cursive',
    fontSize: '24px',
    color: '#3B4CCA',
  },
  playAgainButton: {
    fontFamily: '"Press Start 2P", cursive',
    padding: '12px 24px',
    cursor: 'pointer',
    fontSize: '16px',
    backgroundColor: '#3B4CCA',
    color: '#fff',
    border: '2px solid #FFDE00',
    borderRadius: '12px',
    marginTop: '10px',
  },
};

export default MemoryGame;
