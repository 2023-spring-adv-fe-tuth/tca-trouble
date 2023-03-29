import Button from "@mui/material/Button/Button";
import { useNavigate } from 'react-router-dom';
import { GameResult, SetupInfo } from './front-end-model';

interface PlayProps {
    addGameResultFunction: (r: GameResult) => void;
    setupInfo: SetupInfo;
};

export const Play: React.FC<PlayProps> = ({addGameResultFunction, setupInfo}) => {

    const nav = useNavigate ();

    console.log (setupInfo);

    const endGame = (winner: string) => {
        addGameResultFunction({winner: winner, players: setupInfo.chosenPlayers})
    };

    nav (-2);

    return(
        <>
            <h2>Play</h2>
           
            {
                setupInfo.chosenPlayers.map(x =>(
                    <Button variant="contained" size="large" onClick={() => endGame(x)}>{x} Won </Button>
                ))

            }
        </>
    );
};