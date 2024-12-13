import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import MemoryGame from './components/MemoryGame';
import JumpingGame from './components/JumpingGame';
import ShipGame from './components/ShipGame';
import ContinentsMap from './components/ContinentsMap';
import Shapes from './components/Shapes';
import MoneyGame from './components/Money';
import './App.css'; // Import the external CSS

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Router>
      <div className="app">
        <img
          src={menuOpen ? "/images/close.png" : "/images/menu.png"}
          className="menu-icon"
          onClick={toggleMenu}
          alt={menuOpen ? "Close menu" : "Open menu"}
          aria-label="Toggle navigation menu"
        />

        <div className={`navbar ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/memory" className={({ isActive }) => (isActive ? 'link active' : 'link')}>
            Memory Game
          </NavLink>
          <NavLink to="/ship" className={({ isActive }) => (isActive ? 'link active' : 'link')}>
            Ship Game
          </NavLink>
          <NavLink to="/jumping" className={({ isActive }) => (isActive ? 'link active' : 'link')}>
            Jumping Game
          </NavLink>
          <NavLink to="/continents" className={({ isActive }) => (isActive ? 'link active' : 'link')}>
            Continents
          </NavLink>
          <NavLink to="/shapes" className={({ isActive }) => (isActive ? 'link active' : 'link')}>
            Shapes
          </NavLink>
          <NavLink to="/money" className={({ isActive }) => (isActive ? 'link active' : 'link')}>
            Money Game
          </NavLink>
        </div>

        <Routes>
          <Route path="/memory" element={<MemoryGame />} />
          <Route path="/jumping" element={<JumpingGame />} />
          <Route path="/ship" element={<ShipGame />} />
          <Route path="/continents" element={<ContinentsMap />} />
          <Route path="/shapes" element={<Shapes />} />
          <Route path="/money" element={<MoneyGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;