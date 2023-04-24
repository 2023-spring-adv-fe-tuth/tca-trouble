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
    chosenPlayers: { name: string; color: string }[];
}; 

export const Play: React.FC<PlayProps> = ({addGameResultFunction, setupInfo, addPlayerRollCountsFunction, chosenPlayers}) => {

    const nav = useNavigate ();

    const endGame = () => {
        nav(-2);
    }

    const [open, setOpen] = useState(false);
    const [winner, setWinner] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleWinner = (winner: string) => {
        setWinner(winner);
        setOpen(false);
    }

    useEffect(() => {
        if (winner !== "") {
            const newGameResult: GameResult = {
                winner: winner,
                players: chosenPlayers.map((player) => player.name),
                start: setupInfo.start,
                end: new Date().toISOString()
            };
            addGameResultFunction(newGameResult);
            endGame();
        }
    }, [winner]);

    const [playerRollCounts, setPlayerRollCounts] = useState<{ [playerName: string]: {score: number, bumped: number, roll6: number} }>({});

    const handleScore = (playerName: string) => {
        setPlayerRollCounts((prevCounts) => {
            const updatedCounts = {...prevCounts};
            if (updatedCounts[playerName]) {
                updatedCounts[playerName].score += 1;
            } else {
                updatedCounts[playerName] = {score: 1, bumped: 0, roll6: 0};
            }
            return updatedCounts;
        });
    };

    const handleBumped = (playerName: string) => {
        setPlayerRollCounts((prevCounts) => {
            const updatedCounts = {...prevCounts};
            if (updatedCounts[playerName]) {
                updatedCounts[playerName].bumped += 1;
            } else {
                updatedCounts[playerName] = {score: 0, bumped: 1, roll6: 0};
            }
            return updatedCounts;
        });
    };

    const handleRoll6 = (playerName: string) => {
        setPlayerRollCounts((prevCounts) => {
            const updatedCounts = {...prevCounts};
            if (updatedCounts[playerName]) {
                updatedCounts[playerName].roll6 += 1;
            } else {
                updatedCounts[playerName] = {score: 0, bumped: 0, roll6: 1};
            }
            return updatedCounts;
        });
    };

   


    
    return (
        <Box>
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                

                <IconButton onClick={handleClickOpen}>
                    <CasinoIcon sx={{fontSize: "3rem"}}/>
                </IconButton>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Who won?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please select the winner of the game.
                        </DialogContentText>
                        <Divider sx={{margin: "1rem"}}/>
                        {chosenPlayers.map((player) => (
                            <Button key={player.name} onClick={() => handleWinner(player.name)} sx={{margin: "1rem"}}>
                                {player.name}
                            </Button>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>
                            <CancelOutlined/>
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
                            
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
                  <Typography variant="h5" component="h2" sx={{ fontSize: "2rem", color: "primary.main" }}>
  {player.name}
</Typography>

<Button
  sx={{
    mr: 1,
    background: 'linear-gradient(to right, #34D399, #10B981)',
    color: '#fff',
    '&:hover': {
      background: 'linear-gradient(to right, #10B981, #34D399)',
    },
  }}
  variant="contained"
  size="small"
  startIcon={<AddCircleOutline sx={{ fontSize: 24, fontWeight: 'bold' }} />}
  onClick={() => handleScore(player.name)}
>
  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
    Score
  </Typography>
</Button>

<Button
  sx={{
    mr: 1,
    background: 'linear-gradient(to right, #EF4444, #DC2626)',
    color: '#fff',
    '&:hover': {
      background: 'linear-gradient(to right, #DC2626, #EF4444)',
    },
  }}
  variant="contained"
  size="small"
  startIcon={<CancelOutlined sx={{ fontSize: 24, fontWeight: 'bold' }} />}
  onClick={() => handleBumped(player.name)}
>
  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
    Bump
  </Typography>
</Button>

<Button
  sx={{
    mr: 1,
    background: 'linear-gradient(to right, #3B82F6, #2563EB)',
    color: '#fff',
    '&:hover': {
      background: 'linear-gradient(to right, #2563EB, #3B82F6)',
    },
  }}
  variant="contained"
  size="small"
  startIcon={<CasinoIcon sx={{ fontSize: 24, fontWeight: 'bold' }} />}
  onClick={() => handleRoll6(player.name)}
>
  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
    Roll 6
  </Typography>
</Button>

                    <Divider sx={{ m: 1 }} />
                    <Typography variant="body2" component="p" sx={{ color: 'black', fontSize: '16px', fontWeight: 'bold', mb: 1 }}>
  {playerRollCounts[player.name] ? playerRollCounts[player.name].score : 0} scores
</Typography>
<Typography variant="body2" component="p" sx={{ color: 'black', fontSize: '16px', fontWeight: 'bold', mb: 1 }}>
  {playerRollCounts[player.name] ? playerRollCounts[player.name].bumped : 0} bumped
</Typography>
<Typography variant="body2" component="p" sx={{ color: 'black', fontSize: '16px', fontWeight: 'bold', mb: 1 }}>
  {playerRollCounts[player.name] ? playerRollCounts[player.name].roll6 : 0} rolled 6
</Typography>

                  </CardContent>
                </Card>
                
                 
                ))}
            </Box>
            
            <Button onClick={endGame} sx={{margin: "1rem"}}>
                <ArrowForward/>
            </Button>
            
        </Box>
    );
};
