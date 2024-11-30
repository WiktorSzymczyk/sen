import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MemoryGame.css';

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
  const navigate = useNavigate();

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
      .map((card, index) => ({ ...card, uniqueId: `${card.id}-${index}` }))
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
    <div className="container">
      <audio ref={audioRef} src="/sounds/background.mp3" loop />
      <h1 className="title">Pokémon Memory Game</h1>

      {!gameStarted && !gameOver && (
        <button className="startGameButton" onClick={startGame}>
          Play Game
        </button>
      )}

      {loading ? (
        <h2 className="loadingText">Loading Pokémon...</h2>
      ) : (
        <div className="grid">
          {cards.map((card) => (
            <div
              key={card.uniqueId}
              className={`card ${
                flippedCards.includes(card.uniqueId) ? "flipped" : ""
              } ${matchedCards.includes(card.name) ? "matched" : ""}`}
              onClick={() => (gameStarted ? handleFlip(card) : null)}
            >
              {flippedCards.includes(card.uniqueId) || matchedCards.includes(card.name) ? (
                <img src={card.src} alt={card.name} className="image" />
              ) : (
                <div className="cover"></div>
              )}
            </div>
          ))}
        </div>
      )}

      {gameOver && (
        <div className="gameOverBar">
          <h2 className="gameOverText">You Won!</h2>
          <button className="playAgainButton" onClick={initializeCards}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;