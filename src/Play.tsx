import Button from "@mui/material/Button/Button";
import { useNavigate } from 'react-router-dom';
import { GameResult } from './front-end-model';

interface PlayProps {
    addGameResultFunction: (r: GameResult) => void;
};

export const Play: React.FC<PlayProps> = ({addGameResultFunction}) => {

    const nav = useNavigate ();

    const endGame = () => {
        addGameResultFunction({winner: "Bridgette", players: ["Dan", "Kaityn", "Bridgette"]})
    };

    nav (-2);

    return(
        <>
            <h2>Play</h2>
            <Button variant="contained" size="large" onClick={endGame}>Done</Button>
            <p> Something goes here... I don't know what...</p>
        </>
    );
};