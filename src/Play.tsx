import Button from "@mui/material/Button/Button";
import { useNavigate } from "react-router-dom";
import { GameResult, SetupInfo } from "./front-end-model";
import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  AddCircleOutline,
  ArrowForward,
  CancelOutlined,
} from "@mui/icons-material";
import CasinoIcon from "@mui/icons-material/Casino";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import UndoIcon from "@mui/icons-material/Undo";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

interface PlayProps {
  addGameResultFunction: (r: GameResult) => void;
  setupInfo: SetupInfo;
  addPlayerRollCounts: (playerRollCounts: {
    [playerName: string]: number;
  }) => void;
  addPlayerBumpedCounts: (playerBumpedCounts: {
    [playerName: string]: number;
  }) => void;

  chosenPlayers: { name: string; color: string }[];
}

export const Play: React.FC<PlayProps> = ({
  addGameResultFunction,
  setupInfo,
  chosenPlayers,
  addPlayerRollCounts,
  addPlayerBumpedCounts,
}) => {
  const nav = useNavigate();
  const [elapsedTime, setElapsedTime] = useState(0);

  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  

  const [open, setOpen] = useState(false);
  const [winner, setWinner] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleWinner = (winner: string) => {
    setWinner(winner);
    setOpen(false);
  };

 const endGame = (winner: string) => {
    addGameResultFunction({
      winner: winner,
      players: chosenPlayers.map((player) => player.name),
      start: setupInfo.start,
      end: new Date().toISOString(),
      playerBumpedCounts: playerBumpedCounts,
      playerRollCounts: playerRollCounts,
    })
    nav(-2)
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const showDialog = (message: string) => {
    setDialogMessage(message);
    setDialogOpen(true);
  };

  const [figuresAtHome, setFiguresAtHome] = useState<{
    [playerName: string]: number;
  }>(
    chosenPlayers.reduce((obj, player) => {
      obj[player.name] = 4;
      return obj;
    }, {} as { [playerName: string]: number })
  );

  const [figuresAtFinish, setFiguresAtFinish] = useState<{
    [playerName: string]: number;
  }>({});
  const [playerRollCounts, setPlayerRollCounts] = useState<{
    [playerName: string]: number;
  }>({});
  const [playerBumpedCounts, setPlayerBumpedCounts] = useState<{
    [playerName: string]: number;
  }>({});

  const [undoDisabled, setUndoDisabled] = useState(true);

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [confirmationAction, setConfirmationAction] = useState<
    (() => void) | null
  >(null);
  const openConfirmationDialog = (action: () => void) => {
    setConfirmationAction(action);
    setIsConfirmationDialogOpen(true);
  };

  const addFigureAtHome = (playerName: string) => {
    setPrevGameState({
      figuresAtHome,
      figuresAtFinish,
      playerRollCounts,
      playerBumpedCounts,
    });
    setFiguresAtHome((prevState) => ({
      ...prevState,
      [playerName]: (prevState[playerName] || 0) + 1,
    }));
    setUndoDisabled(false);
    setIsConfirmationDialogOpen(false);
    const message = `${playerName} looks like you scored!`;
    showDialog(message);
  };

  const addFigureAtFinish = (playerName: string) => {
    openConfirmationDialog(() => {
      setPrevGameState({
        figuresAtHome,
        figuresAtFinish,
        playerRollCounts,
        playerBumpedCounts,
      });
      setFiguresAtHome((prevState) => ({
        ...prevState,
        [playerName]: (prevState[playerName] || 0) - 1,
      }));
      setFiguresAtFinish((prevState) => ({
        ...prevState,
        [playerName]: (prevState[playerName] || 0) + 1,
      }));
      setUndoDisabled(false);
      setIsConfirmationDialogOpen(false);
      const message = `${playerName} looks like you scored!`;
      showDialog(message);
    });
  };

  const incrementPlayerBumpedCount = (playerName: string) => {
    openConfirmationDialog(() => {
      setPrevGameState({
        figuresAtHome,
        figuresAtFinish,
        playerRollCounts,
        playerBumpedCounts,
      });

      setPlayerBumpedCounts((prevState) => ({
        ...prevState,
        [playerName]: (prevState[playerName] || 0) + 1,
      }));
      setUndoDisabled(false);
      setIsConfirmationDialogOpen(false);
      const message = `It looks like you been bumped ${playerName}!`;
      showDialog(message);
    });
  };

  const incrementPlayerRollCount = (playerName: string) => {
    openConfirmationDialog(() => {
      setPrevGameState({
        figuresAtHome,
        figuresAtFinish,
        playerRollCounts,
        playerBumpedCounts,
      });
      setPlayerRollCounts((prevState) => ({
        ...prevState,
        [playerName]: (prevState[playerName] || 0) + 1,
      }));
      setUndoDisabled(false);
      setIsConfirmationDialogOpen(false);
      const message = `It looks like you rolled 6 ${playerName}!`;
      showDialog(message);
    });
  };

  const [prevGameState, setPrevGameState] = useState<{
    figuresAtHome: { [playerName: string]: number };
    figuresAtFinish: { [playerName: string]: number };
    playerRollCounts: { [playerName: string]: number };
    playerBumpedCounts: { [playerName: string]: number };
  }>({
    figuresAtHome: {},
    figuresAtFinish: {},
    playerRollCounts: {},
    playerBumpedCounts: {},
  });

  const undoLastAction = () => {
    setFiguresAtHome(prevGameState.figuresAtHome);
    setFiguresAtFinish(prevGameState.figuresAtFinish);
    setPlayerRollCounts(prevGameState.playerRollCounts);
    setPlayerBumpedCounts(prevGameState.playerBumpedCounts);
    setUndoDisabled(true);
  };

  useEffect(() => {
    addPlayerRollCounts(playerRollCounts);
  }, [playerRollCounts, addPlayerRollCounts]);
  useEffect(() => {
    addPlayerBumpedCounts(playerBumpedCounts);
  }, [playerBumpedCounts, addPlayerBumpedCounts]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
          <HourglassEmptyIcon sx={{ mr: 2 }} />
          {minutes}:{seconds < 10 ? "0" : ""}
          {seconds}
        </Typography>

        <IconButton onClick={handleClickOpen}>
          Choose the winner !<CasinoIcon sx={{ fontSize: "3rem" }} />
        </IconButton>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Who won?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please select the winner of the game.
            </DialogContentText>
            <Divider sx={{ margin: "1rem" }} />
            {chosenPlayers.map((player) => (
              <Button
                key={player.name}
                onClick={() => endGame(player.name)}
                sx={{ margin: "1rem" }}
              >
                {player.name}
              </Button>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              <CancelOutlined />
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Dialog
        open={isConfirmationDialogOpen}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
        disableEscapeKeyDown
      >
        <DialogTitle id="confirmation-dialog-title">
          {dialogMessage}
        </DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          <Button
            onClick={() => {
              setIsConfirmationDialogOpen(false);
              confirmationAction?.();
            }}
            color="success"
            variant="contained"
            startIcon={<CheckCircleOutlineIcon />}
            sx={{ mr: 1, mb: 1 }}
          >
            Confirm
          </Button>
          <Button
            onClick={() => {
              undoLastAction();
              setIsConfirmationDialogOpen(false);
            }}
            color="error"
            autoFocus
            variant="contained"
            startIcon={<UndoIcon />}
            sx={{ mr: 1, mb: 1 }}
          >
            Undo
          </Button>
        </DialogContent>
      </Dialog>

      <Box>
        {chosenPlayers.map((player) => (
          <Card
            sx={{
              mb: 2,
              backgroundImage: `linear-gradient(to bottom right, white, ${player.color})`,
            }}
            key={player.name}
          >
            <CardContent>
              <Typography
                variant="h5"
                component="h2"
                sx={{ fontSize: "2rem", fontWeight: "bold", mb: 1 }}
              >
                {player.name}
              </Typography>

              <Button
                sx={{
                  mr: 1,
                  background: "linear-gradient(to right, #34D399, #10B981)",
                  color: "#fff",
                  "&:hover": {
                    background: "linear-gradient(to right, #10B981, #34D399)",
                  },
                }}
                variant="contained"
                size="small"
                startIcon={
                  <AddCircleOutline sx={{ fontSize: 24, fontWeight: "bold" }} />
                }
                onClick={() => addFigureAtFinish(player.name)}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Score
                </Typography>
              </Button>

              <Button
                sx={{
                  mr: 1,
                  background: "linear-gradient(to right, #EF4444, #DC2626)",
                  color: "#fff",
                  "&:hover": {
                    background: "linear-gradient(to right, #DC2626, #EF4444)",
                  },
                }}
                variant="contained"
                size="small"
                startIcon={
                  <CancelOutlined sx={{ fontSize: 24, fontWeight: "bold" }} />
                }
                onClick={() => incrementPlayerBumpedCount(player.name)}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Bump
                </Typography>
              </Button>

              <Button
                sx={{
                  mr: 1,
                  background: "linear-gradient(to right, #3B82F6, #2563EB)",
                  color: "#fff",
                  "&:hover": {
                    background: "linear-gradient(to right, #2563EB, #3B82F6)",
                  },
                }}
                variant="contained"
                size="small"
                startIcon={
                  <CasinoIcon sx={{ fontSize: 24, fontWeight: "bold" }} />
                }
                onClick={() => incrementPlayerRollCount(player.name)}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Roll 6
                </Typography>
              </Button>

              <Typography variant="body1" sx={{ mt: 1 }}>
                Finish: {figuresAtFinish[player.name] || 0}
              </Typography>
              <Divider sx={{ mb: 1, mt: 1 }} />
              <Typography variant="body1">
                Home or in play: {figuresAtHome[player.name] || 0} figures
              </Typography>
              <Divider sx={{ mb: 1, mt: 1 }} />
              <Typography variant="body1">
                You been bumped {playerBumpedCounts[player.name] || 0}{" "}
                {playerBumpedCounts[player.name] === 1 ? "time" : "times"}
              </Typography>
              <Divider sx={{ mb: 1, mt: 1 }} />
              <Typography variant="body1">
                You rolled SIX {playerRollCounts[player.name] || 0}{" "}
                {playerRollCounts[player.name] === 1 ? "time" : "times"}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
