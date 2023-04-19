import Button from "@mui/material/Button/Button";
import { useNavigate } from 'react-router-dom';
import { GameResult, SetupInfo } from './front-end-model';
import { useEffect, useState } from 'react';
import { Typography, Box, Card, CardContent } from "@mui/material";

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
        setPrevGameState({
            figuresAtHome,
            figuresAtFinish,
            playerRollCounts,
            playerBumpedCounts,
          });
        setFiguresAtHome(prevState => ({ ...prevState, [playerName]: (prevState[playerName] || 0) - 1 }));
        setFiguresAtFinish(prevState => ({ ...prevState, [playerName]: (prevState[playerName] || 0) + 1 }));
        setUndoDisabled(false);
      };

      

    const incrementPlayerRollCount = (playerName: string) => {
        setPrevGameState({
            figuresAtHome,
            figuresAtFinish,
            playerRollCounts,
            playerBumpedCounts,
          });
        setPlayerRollCounts(prevState => ({ ...prevState, [playerName]: (prevState[playerName] || 0) + 1 }));
        setUndoDisabled(false);
    };

    const incrementPlayerBumpedCount = (playerName: string) => {
        setPrevGameState({
            figuresAtHome,
            figuresAtFinish,
            playerRollCounts,
            playerBumpedCounts,
          });
          
        setPlayerBumpedCounts(prevState => ({ ...prevState, [playerName]: (prevState[playerName] || 0) + 1 }));
        setUndoDisabled(false);
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
      <Typography variant="h2">Play</Typography>
      {
        setupInfo.chosenPlayers.map(x => (
          <Box key={x} sx={{ mb: 2 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 1 }}>{x}</Typography>
                
                <Button variant="contained" size="small" onClick={() => addFigureAtFinish(x)} sx={{ mr: 1 }}>Score</Button>
                <Button variant="contained" size="small" onClick={() => incrementPlayerBumpedCount(x)} sx={{ mr: 1 }}>Bumped</Button>
                <Button variant="contained" size="small" onClick={() => incrementPlayerRollCount(x)} sx={{ mr: 1 }}>Roll 6 count</Button>
                <Typography variant="body1" sx={{ mt: 1 }}>Finish {figuresAtFinish[x] || 0}</Typography>
                <Typography variant="body1">Home: {figuresAtHome[x] || 0} figures</Typography>

                <Typography variant="body1"><Typography variant="body1">You been bumped {playerBumpedCounts[x] || 0} {playerBumpedCounts[x] === 1 ? 'time' : 'times'}</Typography></Typography>

                <Typography variant="body1"><Typography variant="body1">You rolled SIX {playerRollCounts[x] || 0} {playerRollCounts[x] === 1 ? 'time' : 'times'}</Typography></Typography>
                <Button variant="contained" size="small" onClick={() => endGame(x)} sx={{ mr: 1 }}>{x} Won</Button>
                <Button variant="contained" size="small" onClick={undoLastAction} sx={{ mr: 1 }} disabled={undoDisabled}>
    Undo Last Action
</Button>
              </CardContent>
            </Card>
          </Box>
        ))
      }
    </>
    );
};
