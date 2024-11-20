import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import MemoryGame from './components/MemoryGame';
import JumpingGame from './components/JumpingGame';

function App() {
  return (
    <Router>
      <div style={styles.navbar}>
        <NavLink 
          to="/memory" 
          style={({ isActive }) => ({
            ...styles.link,
            backgroundColor: isActive ? '#61dafb' : 'transparent', // Highlight active link
            color: isActive ? '#282c34' : '#61dafb' // Change text color when active
          })}
        >
          Memory Game
        </NavLink>
        <NavLink 
          to="/jumping" 
          style={({ isActive }) => ({
            ...styles.link,
            backgroundColor: isActive ? '#61dafb' : 'transparent', // Highlight active link
            color: isActive ? '#282c34' : '#61dafb' // Change text color when active
          })}
        >
          Jumping Game
        </NavLink>
      </div>

      <Routes>
        <Route path="/memory" element={<MemoryGame />} />
        <Route path="/jumping" element={<JumpingGame />} />
      </Routes>
    </Router>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    padding: '10px',
    backgroundColor: '#282c34',
  },
  link: {
    fontFamily: '"Press Start 2P", cursive',
    textDecoration: 'none',
    fontSize: '18px',
    padding: '5px 10px',
    borderRadius: '4px',
    transition: 'background-color 0.3s, color 0.3s', // Smooth color transition
    display: 'inline-block',
  },
};

export default App;
