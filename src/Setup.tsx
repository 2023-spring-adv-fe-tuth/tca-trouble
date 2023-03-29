import Button from "@mui/material/Button/Button";

import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { SetupInfo } from "./front-end-model";

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';

export interface SetupProps {
    previousPlayers: string[];
    setSetupInfo: (si: SetupInfo) => void;
}
export const Setup: React.FC <SetupProps> = ({ previousPlayers, setSetupInfo}) => {

    const nav = useNavigate ();

    const [chosenPlayers, setChosenPlayers] = useState(
        previousPlayers.map (x => ({name: x, checked: false}))
    );

    const [addPlayer, setAddPlayer] = useState ("");

    const togglePlayer = (name: string) => setChosenPlayers(
        chosenPlayers.map(x => ({
            ...x, checked: x.name === name ? !x.checked : x.checked
        }))
    );

    const startGame = () => {
        setSetupInfo({
            start: new Date().toISOString(),
            chosenPlayers: chosenPlayers.filter(x => x.checked).map(x => x.name)
        });
        nav ("/play");
    };

    const validateAddNewPlayer = () => {
        if (addPlayer.length == 0 || chosenPlayers.some(x => x.name.localeCompare(addPlayer))) {
            return;
        }
        setChosenPlayers([
            ...chosenPlayers,
            {
                name: addPlayer, 
                checked: true
            }
        ]
        );
        setAddPlayer("");
    };

    return(
        <>
            <h2>Setup</h2>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <TextField id="input-with-sx" label="Enter your name" variant="standard" value={addPlayer} onChange={(e) => setAddPlayer(e.target.value)}/>
                
                <Button variant="contained" size="large" onClick={validateAddNewPlayer}>
                    Add Player
                </Button>
                
            </Box>
    
            
            {
                chosenPlayers.map(x =>(
                    <FormGroup>
                         <FormControlLabel
                            control={<Checkbox checked={x.checked} 
                            onChange={() => togglePlayer(x.name)} />}
                            label={x.name}
                        />
                    </FormGroup>
                )) 
            }

            <Button variant="contained" size="large" 
                onClick={startGame}>Start Game
            </Button>
        </>
    );
};