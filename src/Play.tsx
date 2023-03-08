import Button from "@mui/material/Button/Button";
import { useNavigate } from 'react-router-dom'

export const Play = () => {

    const nav = useNavigate ();

    return(
        <>
            <h2>Play</h2>
            <Button variant="contained" size="large" onClick={() => nav(-2)}>Done</Button>
            <p> Something goes here... I don't know what...</p>
        </>
    );
};