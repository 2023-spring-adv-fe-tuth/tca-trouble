import React, { useEffect, useState } from "react";
import "./App.css";

import { Home } from "./Home";
import { Setup } from "./Setup";
import { Play } from "./Play";

import { HashRouter, Routes, Route } from "react-router-dom";

import Box from "@mui/material/Box";
import { Stepper, Step, StepLabel } from "@mui/material";
import {
  GameResult,
  calculateLeaderboard,
  SetupInfo,
  getPreviousPlayers,
  getShortestGameDuration,
  getLongestGameDuration,
} from "./front-end-model";
import { ThemeProvider } from "@emotion/react";
import { Typography, createTheme, Button, TextField, styled, CardContent, Card, Modal } from "@mui/material";

import localforage from "localforage";

import { saveGameToCloud, loadGamesFromCloud } from "./tca-cloud-api";

export const getPlayerCountsTotal = (playerCounts: Record<string, number>[]) => {
  const countsTotal: Record<string, number> = {};

  playerCounts.forEach((counts) => {
    if (typeof counts === 'object' && counts !== null) {
      Object.entries(counts).forEach(([player, count]) => {
        countsTotal[player] = (countsTotal[player] || 0) + count;
      });
    }
  });

  return countsTotal;
};

export const App = () => {
  const [results, setGameResults] = useState<GameResult[]>([]);
  const [modalOpen, setModalOpen] = useState(true);
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  
  const steps = ["Home", "Setup", "Play"];
  const [activeStep, setActiveStep] = useState(0);

  const [emailError, setEmailError] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleSaveMail = () => {
    if (validateEmail(emailKeyInput)) {
      saveEmailKey();
      handleCloseModal();
    } else {
      setEmailError(true);
    }
  };
  
  const [setupInfo, setSetupInfo] = useState<SetupInfo>({
    start: "",
    chosenPlayers: [],
  });
  const [playerRollCounts, setPlayerRollCounts] = useState<{
    [playerName: string]: number;
  }>({});

  const [playerBumpedCounts, setPlayerBumpedCounts] = useState<{
    [playerName: string]: number;
  }>({});

  const addPlayerRollCounts = (playerRollCounts: {
    [playerName: string]: number;
  }) => {
    setPlayerRollCounts((prevState) => ({
      ...prevState,
      ...playerRollCounts,
    }));
  };

  const addPlayerBumpedCounts = (playerBumpedCounts: {
    [playerName: string]: number;
  }) => {
    setPlayerBumpedCounts((prevState) => ({
      ...prevState,
      ...playerBumpedCounts,
    }));
  };

  const addGameResult = async (r: GameResult) => {

    // Save to cloud
    await saveGameToCloud(
      emailKeySaved,
      "tca-trouble",
      r.end,
      r
      );


    setGameResults([...results, r]);
  };

  const [emailKeyInput, setEmailKeyInput] = useState("");
  const [emailKeySaved, setEmailKeySaved] = useState("");

  useEffect (
    () => {

      const loadEmailKeyAndGameResults = async () => {

        try {
          const ek = String (await localforage.getItem("emailKey")) ?? ""; 

          if (ek.length > 0) {
            const resultsFromCloud =  await loadGamesFromCloud(
              ek,
              "tca-trouble"
            );

            if (!ignore) {
              setGameResults(resultsFromCloud);
            }
          }


          
          if (!ignore) {
          setEmailKeyInput(ek);
          setEmailKeySaved(ek);
          }
        }
        catch (err) {console.error(err)};

      };
      
      let ignore = false;
      loadEmailKeyAndGameResults();
      return () => {
        ignore = true;
      };

    }, [emailKeySaved]
  )

  const saveEmailKey = async () => {
    try {
      await localforage.setItem(
        "emailKey", emailKeyInput

      );

      setEmailKeySaved(emailKeyInput);
    }
    catch (err) {
      console.error(err);
    }
   };



  const theme = createTheme({
    typography: {
      fontSize: 16,

      fontFamily: ["quicksand", "sans-serif"].join(","),
    },
  });
  const primaryColor = "#0c1b28";
const secondaryColor = "#ffbb54";



// Define styled components
const AppContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
 
  backgroundColor: primaryColor,
  padding: "1rem",
 
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  borderRadius: "16px",
});

const Logo = styled(Typography)({
  fontWeight: "bold",
  color: secondaryColor,
  marginBottom: "1rem",
});

const Heading = styled(Typography)({
  fontWeight: "bold",
  marginBottom: "0.5rem",
  color: "white",
});

const [totalCounts, setTotalCounts] = useState<Record<string, number>>({});

  return (
    <Box m={1} p={2}>
      <ThemeProvider theme={theme}>
      <Box sx={{ mb: 1 }}>
      <AppContainer sx={{justifyContent: 'center', alignItems: 'center'}}>
        <Logo variant="h3">Tca Trouble</Logo>
        <Heading variant="h4">Companion app</Heading>
        
      </AppContainer>
    </Box>
        
    
    <Modal open={modalOpen} onClose={handleCloseModal}>
    <Box
  sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '350px',
    maxWidth: '100%',
    outline: 'none',
    borderRadius: '16px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    p: 1,
    bgcolor: '#F9F9FB',
    color: '#444444',
  }}
>
  <Typography variant="h4" sx={{ textAlign: 'center', mb: 1 }}>
    Enter Your Email
  </Typography>
  <Typography variant="h6" sx={{ textAlign: 'center', mb: 1 }}>
    To load and save your game results
  </Typography>

  <TextField
    id="input-with-sx"
    label="Email"
    variant="outlined"
    value={emailKeyInput}
    onChange={(e) => {
      setEmailKeyInput(e.target.value);
      setEmailError(false);
    }}
    fullWidth
    error={emailError}
    helperText={emailError && 'Please enter a valid email'}
    sx={{ mb: 2 }}
    InputProps={{
      sx: {
        color: '#444444',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#999999',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#999999',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#999999',
        },
      },
    }}
    InputLabelProps={{
      sx: {
        color: '#444444',
      },
    }}
  />

  <Button
    variant="contained"
    onClick={handleSaveMail}
    size="large"
    fullWidth
    disabled={!validateEmail(emailKeyInput)}
    sx={{
      borderRadius: '8px',
      fontWeight: 'bold',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
      bgcolor: '#FFC107',
      color: '#FFFFFF',
      '&:hover': {
        bgcolor: '#FFA000',
      },
    }}
  >
    Save Mail
  </Button>
</Box>





</Modal>


      
 
        
        <HashRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  leaderboardData={calculateLeaderboard(results)}
                  shortestGameDuration={getShortestGameDuration(results)}
                  longestGameDuration={getLongestGameDuration(results)}
                  playerRollCounts={playerRollCounts}
                  playerBumpedCounts={playerBumpedCounts}
                  results = {results}
                  
                />
              }
            />

            <Route
              path="/setup"
              element={
                <Setup
                  previousPlayers={getPreviousPlayers(results)}
                  setSetupInfo={setSetupInfo}
                />
              }
            />
            <Route
              path="/play"
              element={
                <Play
                  addGameResultFunction={addGameResult}
                  setupInfo={setupInfo}
                  addPlayerRollCounts={addPlayerRollCounts}
                  addPlayerBumpedCounts={addPlayerBumpedCounts}
                  chosenPlayers={setupInfo.chosenPlayers}
                />
              }
            />
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </Box>
  );
};

export default App;
