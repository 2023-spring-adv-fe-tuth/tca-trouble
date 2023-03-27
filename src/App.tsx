import React, { useState } from 'react';
import './App.css';

import { Home } from './Home';
import { Setup } from './Setup';
import { Play } from './Play';

import {HashRouter, Routes, Route} from 'react-router-dom';

import Box from '@mui/material/Box';

import { GameResult, calculateLeaderboard } from './front-end-model';

const hardcodedGameResults: GameResult[] = [
        {winner: "Hristijan", players: ["Natalija", "Eric"]},
        {winner: "Phil", players: ["Phil", "Taylor"]},
        {winner: "Taylor" , players: ["Phil", "Taylor", "Jack"]},
        {winner: "Robbie" , players: ["Robbie", "Joe"]}
  ];

const App = () => {

  const [results, setGameResults] = useState(hardcodedGameResults);
  
  return (
    <div>
    <Box m={2} p={4}>
      <div className="App">
          <h1>Tca Trouble</h1>
          <h2>Companion App</h2>
          <hr /> 
              <HashRouter>
                <Routes>
                  <Route 
                  path="/" 
                  element={
                    <Home 
                      leaderboardData={calculateLeaderboard(results)} 
                      />
                    } 
                  />
                  <Route path="/setup" element={<Setup />} />
                  <Route path="/play" element={<Play />} />
                </Routes>
              </HashRouter>
      </div>
    </Box>
  </div>
  );
}

export default App;
