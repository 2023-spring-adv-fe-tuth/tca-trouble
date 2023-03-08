import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Home } from './Home'
import Box from '@mui/material/Box';




function App() {
  return (
    <div>
    <Box m={2} p={4}>
      <div className="App">
        <h1>Tca Trouble</h1>
        <h2>Companion App</h2>
        <Home />
      </div>
    </Box>
  </div>
  );
}

export default App;
