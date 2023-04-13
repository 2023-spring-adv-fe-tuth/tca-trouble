import React, { useState } from 'react';
import './App.css';

import { Home } from './Home';
import { Setup } from './Setup';
import { Play } from './Play';

import {HashRouter, Routes, Route} from 'react-router-dom';

import Box from '@mui/material/Box';

import { GameResult, calculateLeaderboard, SetupInfo, getPreviousPlayers, getShortestGameDuration, getLongestGameDuration } from './front-end-model';
import { ThemeProvider } from '@emotion/react';
import { Typography, createTheme } from '@mui/material';

const hardcodedGameResults: GameResult[] = [
        {
          winner: "Hristijan", players: ["Hristijan", "Eric"], start: "2023-04-05T00:03:23.912Z", end: "2023-04-05T00:03:33.912Z"
        },
        {
          winner: "Phil", players: ["Phil", "Taylor"], start: "2023-04-05T00:03:23.912Z", end: "2023-04-05T00:03:33.912Z"
        },
        {
          winner: "Taylor" , players: ["Phil", "Taylor", "Jack"], start: "2023-04-05T00:03:23.912Z", end: "2023-04-05T00:03:33.912Z"
        },
        {
          winner: "Robbie" , players: ["Robbie", "Joe"], start: "2023-04-05T00:03:23.912Z", end: "2023-04-05T00:03:33.912Z"
        }
  ];

const App = () => {

  const [results, setGameResults] = useState(hardcodedGameResults);
  
  const [setupInfo, setSetupInfo] = useState <SetupInfo>({start: "", chosenPlayers: []});
  
  const addGameResult = (r: GameResult) => {setGameResults([...results, r]);};
  const theme = createTheme({
    typography: {
        fontSize: 16,
     
      fontFamily: [
        'quicksand',
        'sans-serif',
      ].join(','),
    },});
  return (
    <ThemeProvider theme={theme}>
    <Box m={2} p={4}>
      
    <Typography variant="h4">Tca Trouble</Typography>
<Typography variant="h5">Companion App</Typography>

 
              <HashRouter>
                <Routes>
                    <Route 
                      path="/" 
                      element={<Home 
                          leaderboardData={calculateLeaderboard(results)}
                          shortestGameDuration={getShortestGameDuration(results)}
                          longestGameDuration={getLongestGameDuration(results)} 
                          
                        />} 
                    />
                    
                    <Route 
                      path="/setup" 
                      element={<Setup 
                        
                          previousPlayers={getPreviousPlayers(results)}
                          setSetupInfo={setSetupInfo}
                        />} 
                    />
                    <Route 
                      path="/play" 
                      element={<Play 
                          addGameResultFunction={addGameResult}
                          setupInfo={setupInfo} 
                          
                        />} 
                    />
                </Routes>
              </HashRouter>
 
    </Box>
    </ThemeProvider>
  );
}

export default App;
