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
import { Typography, createTheme, Button, TextField } from "@mui/material";

import localforage from "localforage";

const hardcodedGameResults: GameResult[] = [
  {
    winner: "Hristijan",
    players: ["Hristijan", "Eric"],
    start: "2023-04-05T00:03:23.912Z",
    end: "2023-04-05T00:03:33.912Z",
  },
  {
    winner: "Phil",
    players: ["Phil", "Taylor"],
    start: "2023-04-05T00:03:23.912Z",
    end: "2023-04-05T00:03:33.912Z",
  },
  {
    winner: "Taylor",
    players: ["Phil", "Taylor", "Jack"],
    start: "2023-04-05T00:03:23.912Z",
    end: "2023-04-05T00:03:33.912Z",
  },
  {
    winner: "Robbie",
    players: ["Robbie", "Joe"],
    start: "2023-04-05T00:03:23.912Z",
    end: "2023-04-05T00:03:33.912Z",
  },
  {
    winner: "Stefanie",
    players: ["Stefanie", "Ezekiel"],
    start: "2023-04-05T00:03:23.912Z",
    end: "2023-04-05T00:03:33.912Z",
  },
];

const App = () => {
  const [results, setGameResults] = useState(hardcodedGameResults);

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

  const addGameResult = (r: GameResult) => {
    setGameResults([...results, r]);
  };

  const [emailKey, setEmailKey] = useState("");

  useEffect (
    () => {

      const loadEmailKey = async () => {

        try {
          setEmailKey(
            await localforage.getItem("emailKey") ?? ""
          );
        }
        catch (err) {console.error(err)};

      };
      loadEmailKey();

    }, []
  )

  const saveEmailKey = async () => {
    try {
      await localforage.setItem(
        "emailKey", emailKey

      );
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
  return (
    <Box m={1} p={2}>
      <ThemeProvider theme={theme}>
        <Typography variant="h4" sx={{ m: 1 }}>
          Tca Trouble
        </Typography>
        <Typography variant="h5" sx={{ m: 1 }}>
          Companion App
        </Typography>
        
        <TextField
          id="input-with-sx"
          label="Enter your mail"
          variant="standard"
          value={emailKey}
          onChange={(e) => setEmailKey(e.target.value)}
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
