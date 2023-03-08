import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Home } from './Home';
import { Setup } from './Setup';
import { Play } from './Play';

import {HashRouter, Routes, Route} from 'react-router-dom';

import Box from '@mui/material/Box';




function App() {
  return (
    <div>
    <Box m={2} p={4}>
      <div className="App">
          <h1>Tca Trouble</h1>
          <h2>Companion App</h2>
          <hr /> 
              <HashRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
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
