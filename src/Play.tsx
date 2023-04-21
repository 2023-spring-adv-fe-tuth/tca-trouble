import Button from "@mui/material/Button/Button";
import { useNavigate } from 'react-router-dom';
import { GameResult, SetupInfo } from './front-end-model';
import { useEffect, useState } from 'react';
import { Typography, Box, Card, CardContent, IconButton, Divider } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { AddCircleOutline, ArrowForward, CancelOutlined } from "@mui/icons-material";
import CasinoIcon from '@mui/icons-material/Casino';
interface PlayProps {
    addGameResultFunction: (r: GameResult) => void;
    setupInfo: SetupInfo;
    addPlayerRollCountsFunction: (playerRollCounts: { [playerName: string]: number }) => void;
}; 

export const Play: React.FC<PlayProps> = ({addGameResultFunction, setupInfo, addPlayerRollCountsFunction}) => {

    const nav = useNavigate ();
    const [figuresAtHome, setFiguresAtHome] = useState<{ [playerName: string]: number }>(
        setupInfo.chosenPlayers.reduce((obj, player) => ({ ...obj, [player ]: 4 }), {})
    );    const [figuresAtFinish, setFiguresAtFinish] = useState<{ [playerName: string]: number }>({});
    const [playerRollCounts, setPlayerRollCounts] = useState<{ [playerName: string]: number }>({});
    const [playerBumpedCounts, setPlayerBumpedCounts] = useState<{ [playerName: string]: number }>({});

    console.log (setupInfo);

    const endGame = (winner: string) => {
        addGameResultFunction({winner: winner, players: setupInfo.chosenPlayers, start: setupInfo.start, end: new Date().toISOString()})
        nav (-2);
    };
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
const [confirmationAction, setConfirmationAction] = useState<(() => void) | null>(null);
const openConfirmationDialog = (action: () => void) => {
  setConfirmationAction(action);
  setIsConfirmationDialogOpen(true);
};

const [dialogOpen, setDialogOpen] = useState(false);
const [dialogMessage, setDialogMessage] = useState("");

const showDialog = (message: string) => {
  setDialogMessage(message);
  setDialogOpen(true);
};
    const [undoDisabled, setUndoDisabled] = useState(true);

    const addFigureAtHome = (playerName: string) => {
        setPrevGameState({
            figuresAtHome,
            figuresAtFinish,
            playerRollCounts,
            playerBumpedCounts,
          });
        setFiguresAtHome(prevState => ({ ...prevState, [playerName]: (prevState[playerName] || 0) + 1 }));
        setUndoDisabled(false);
    };

    const addFigureAtFinish = (playerName: string) => {
      openConfirmationDialog(() => {
          setPrevGameState({
              figuresAtHome,
              figuresAtFinish,
              playerRollCounts,
              playerBumpedCounts,
          });
          setFiguresAtHome((prevState) => ({ ...prevState, [playerName]: (prevState[playerName] || 0) - 1 }));
          setFiguresAtFinish((prevState) => ({ ...prevState, [playerName]: (prevState[playerName] || 0) + 1 }));
          setUndoDisabled(false);
          setIsConfirmationDialogOpen(false);
    const message = `${playerName} looks like you scored!`
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
  
          setPlayerBumpedCounts((prevState) => ({ ...prevState, [playerName]: (prevState[playerName] || 0) + 1 }));
          setUndoDisabled(false);
          setIsConfirmationDialogOpen(false);
    const message = `It looks like you been bumped ${playerName}!`
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
          setPlayerRollCounts((prevState) => ({ ...prevState, [playerName]: (prevState[playerName] || 0) + 1 }));
          setUndoDisabled(false);
          setIsConfirmationDialogOpen(false);
          const message = `It looks like you rolled 6 ${playerName}!`
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
        addPlayerRollCountsFunction(playerRollCounts);
      }, [playerRollCounts, addPlayerRollCountsFunction]);

    return(
        <>
        <Dialog open={isConfirmationDialogOpen} onClose={() => setIsConfirmationDialogOpen(false)}>
    <DialogTitle>Confirm Action</DialogTitle>
    <DialogContent>
        <DialogContentText>
        {dialogMessage}
        </DialogContentText>
    </DialogContent>
    <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={() => {
            setIsConfirmationDialogOpen(false);
            confirmationAction?.();
        }} color="primary">
            Confirm
        </Button>
        <Button onClick={() => {
    undoLastAction();
    setIsConfirmationDialogOpen(false);
}} color="secondary" autoFocus>
    Cancel
</Button>

    </DialogActions>
</Dialog>

      <Typography variant="h2">Play</Typography>
      {
        setupInfo.chosenPlayers.map(x => (
          

<Box sx={{ mb: 2 }}>
<Card>
  <CardContent>
    <Typography variant="h5" sx={{ mb: 1 }}>{x}</Typography>
    
    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      <Button sx={{ mr: 1}} variant="outlined" color="success" size="small" startIcon={<AddCircleOutline />} onClick={() => addFigureAtFinish(x)}>Score</Button>
      <Button sx={{ mr: 1}} variant="outlined" color="error" size="small" startIcon={<CancelOutlined />} onClick={() => incrementPlayerBumpedCount(x)}>Bumped</Button>
      <Button variant="outlined" size="small" startIcon={<CasinoIcon />} onClick={() => incrementPlayerRollCount(x)}>Roll 6 </Button>
    </Box>

    <Box sx={{ display: "flex", flexDirection: "column", mb: 1 }}>
      <Typography variant="body1" sx={{ mb: 1 }}>Finish: {figuresAtFinish[x] || 0} figures</Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>Home or In-Play: {figuresAtHome[x] || 0} figures</Typography>
    </Box>
          <Divider sx={{ mb: 1 }} />
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="body1" sx={{ mb: 1 }}>You have been bumped {playerBumpedCounts[x] || 0} {playerBumpedCounts[x] === 1 ? 'time' : 'times'}</Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>You rolled SIX {playerRollCounts[x] || 0} {playerRollCounts[x] === 1 ? 'time' : 'times'}</Typography>
    </Box>

    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
      <Button size="small" onClick={() => endGame(x)}> {x} Won</Button>
    
    </Box>

  </CardContent>
</Card>
</Box>
        ))
      }
    </>
    );
};
