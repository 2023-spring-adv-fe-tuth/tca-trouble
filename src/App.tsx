import React, { useEffect, useState } from "react";
import "./App.css";

import { Home } from "./Home";
import { Setup } from "./Setup";
import { Play } from "./Play";

import { HashRouter, Routes, Route } from "react-router-dom";

import Box from "@mui/material/Box";

import {
  GameResult,
  calculateLeaderboard,
  SetupInfo,
  getPreviousPlayers,
  getShortestGameDuration,
  getLongestGameDuration,
} from "./front-end-model";
import { ThemeProvider } from "@emotion/react";
import { Typography, createTheme, Button, TextField, styled } from "@mui/material";

import localforage from "localforage";

import { saveGameToCloud, loadGamesFromCloud } from "./tca-cloud-api";



const App = () => {
  const [results, setGameResults] = useState<GameResult[]>([]);

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
const getPlayerCountsTotal = (playerCounts: Record<string, number>[]) => {
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



  return (
    <Box m={1} p={2}>
      <ThemeProvider theme={theme}>
      <Box sx={{ mb: 1 }}>
      <AppContainer sx={{justifyContent: 'center', alignItems: 'center'}}>
        <Logo variant="h3">Tca Trouble</Logo>
        <Heading variant="h4">Companion app</Heading>
        
      </AppContainer>
    </Box>
        
        <TextField
          id="input-with-sx"
          label="Enter your mail"
          variant="standard"
          value={emailKeyInput}
          onChange={(e) => setEmailKeyInput(e.target.value)}
        />

        <Button
          variant="contained"
          onClick={saveEmailKey}
          size="small"
          
          sx={{
            borderRadius: 8,
            py: 1.5,
            px: 3,
            fontWeight: "bold",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            color: "white",
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          Save Mail
        </Button>

        <p>
  Player Bumped Counts:
  {Object.entries(getPlayerCountsTotal(results.map((result) => result.playerBumpedCounts)))
    .map(([player, count]) => `${player}: ${count}`)
    .join(", ")}
</p>

<p>
  Player Roll Counts:
  {Object.entries(getPlayerCountsTotal(results.map((result) => result.playerRollCounts)))
    .map(([player, count]) => `${player}: ${count}`)
    .join(", ")}
</p>
        
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
