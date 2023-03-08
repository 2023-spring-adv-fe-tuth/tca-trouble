import Button from "@mui/material/Button/Button";
import { useNavigate } from 'react-router-dom'

export const Setup = () => {

    const nav = useNavigate ();

    return(
        <>
            <h2>Setup</h2>
            <Button variant="contained" size="large" onClick={() => nav("/play")}>Play</Button>
            <p> Setup goes here...</p>
        </>
    );
};