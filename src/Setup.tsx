import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SetupInfo } from "./front-end-model";

import Button from "@mui/material/Button/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export interface SetupProps {
  previousPlayers: string[];
  setSetupInfo: (si: SetupInfo) => void;
}

export const Setup: React.FC<SetupProps> = ({ previousPlayers, setSetupInfo }) => {
  const nav = useNavigate();

  const [chosenPlayers, setChosenPlayers] = useState(
    previousPlayers.map((x) => ({ name: x, checked: false }))
  );

  const [addPlayer, setAddPlayer] = useState("");

  const togglePlayer = (name: string) =>
    setChosenPlayers(
      chosenPlayers.map((x) => ({
        ...x,
        checked: x.name === name ? !x.checked : x.checked,
      }))
    );

  const startGame = () => {
    setSetupInfo({
      start: new Date().toISOString(),
      chosenPlayers: chosenPlayers.filter((x) => x.checked).map((x) => x.name),
    });
    nav("/play");
  };

  const validateAddNewPlayer = () => {
    if (
      addPlayer.length == 0 || chosenPlayers.some((x) => x.name.localeCompare(addPlayer) == 0)
    ) 
    
    {
      return;
    }

    setChosenPlayers([...chosenPlayers,
      {
        name: addPlayer,
        checked: true,
      },
    ]);
    setAddPlayer("");
  };

  const numSelected = chosenPlayers.filter((x) => x.checked).length;
  const maxPlayers = 4;
  const disableStartButton = numSelected === 0 || numSelected > maxPlayers;

  return (
    <>
      <h2>Setup</h2>
      <Alert severity="info">
                <AlertTitle><strong> Trouble </strong> can be played with maximum 4 players.</AlertTitle>
        </Alert>

      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
        <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <TextField
          id="input-with-sx"
          label="Enter your name"
          variant="standard"
          value={addPlayer}
          onChange={(e) => setAddPlayer(e.target.value)}
        />

        <Button variant="contained" size="large" onClick={validateAddNewPlayer}>
          Add Player
        </Button>
      </Box>

      {
        chosenPlayers.map((x) => (
          <FormGroup key={x.name}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={x.checked}
                  onChange={() => togglePlayer(x.name)}
                  disabled={numSelected === maxPlayers && !x.checked}
                  color="success"
                />
              }
              label={x.name}
            />
            
          </FormGroup>
      ))}
            <Button variant="contained" size="large"
                onClick={startGame} disabled={disableStartButton}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                  }}
              > Start Game
            </Button>
        </>
    );
};
