import { useEffect, useState } from "react";
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

import * as React from 'react';


import FormControl from "@mui/material/FormControl/FormControl";
import { Avatar, Dialog, DialogActions, DialogContent, DialogTitle, Typography, createMuiTheme } from "@mui/material";
 



export interface SetupProps {
  previousPlayers: string[];
  setSetupInfo: (si: SetupInfo) => void;
}

export const Setup: React.FC<SetupProps> = ({ previousPlayers, setSetupInfo }) => {
  const nav = useNavigate();
  

  const [chosenPlayers, setChosenPlayers] = useState(
    previousPlayers.map((x) => ({ name: x, checked: false, color: ""}))
  );

  const [addPlayer, setAddPlayer] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const togglePlayer = (name: string) => {
    setChosenPlayers((prev) =>
      prev.map((x) => {
        if (x.name === name) {
          const newChecked = !x.checked;
          if (!newChecked && x.color) {
            setAvailableColors([...availableColors, x.color]); // add the color back to available colors
          }
          return { ...x, checked: newChecked, color: newChecked ? x.color : "" };
        } else {
          return x;
        }
      })
    );
  };



  const startGame = () => {
    setSetupInfo({
      start: new Date().toISOString(),
      chosenPlayers: chosenPlayers.filter((x) => x.checked).map((x) => x.name),
    });
    nav("/play");
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const handleColorChange = (color: string, playerName: string) => {
    const updatedPlayers = chosenPlayers.map((player) => {
      if (player.name === playerName) {
        if (color === "") {
          return { ...player, checked: false };
        } else {
          return { ...player, color: color };
        }
      } else {
        return player;
      }
    });
    setChosenPlayers(updatedPlayers);
    setSelectedPlayer("");
    setAnchorEl(null);
  
    // If the player is being unchecked, add their color back to the available colors
    if (color === "") {
      const player = chosenPlayers.find((p) => p.name === playerName);
      if (player && player.color) {
        setAvailableColors([...availableColors, player.color]);
      }
    }
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
        color: "",
      },
    ]);
    setAddPlayer("");
  };

  const numSelected = chosenPlayers.filter((x) => x.checked).length;
  const maxPlayers = 4;
  const disableAddButton = numSelected === maxPlayers; 
  const disableStartButton = numSelected === 0 || numSelected > maxPlayers;
const [dialogOpen, setDialogOpen] = React.useState(false);

const [availableColors, setAvailableColors] = useState(["red", "blue", "green", "yellow"]);

const handleClose = () => {
  setAvailableColors(["red", "blue", "green", "yellow"]);
  setDialogOpen(false);
};

const handleColorClick = (color: string) => {
  handleColorChange(color, selectedPlayer);
  setAvailableColors(availableColors.filter((c) => c !== color));
};


  
  return (
    <>
    
    <Typography variant="h6" sx={{mb: 1}}>Setup</Typography>


      <Alert severity="info">
                <AlertTitle><strong> Trouble </strong> can be played with maximum 4 players.</AlertTitle>
        </Alert>

      <Box sx={{ display: "flex", alignItems: "flex-end", mt: 1 }}>
        <AccountCircle sx={{ color: "action.active", mr: 1 }} />
        <TextField
          id="input-with-sx"
          label="Enter your name"
          variant="standard"
          value={addPlayer}
          onChange={(e) => setAddPlayer(e.target.value)}
        />

        <Button variant="contained" onClick={validateAddNewPlayer} size="small" sx={{ml: 1}} disabled={disableAddButton}>
          Add Player
        </Button>
      </Box>
      
      {
        chosenPlayers.map((x) => (
          
          <FormGroup key={x.name}>
            <Box  sx={{ display: "flex", alignItems: "flex-end", mt: 0.5 }}>
            <FormControlLabel
              control={
                <Checkbox
                checked={x.checked}
                onChange={(e) => {
                  togglePlayer(x.name);
                  setSelectedPlayer(x.name);
                  if (e.target.checked) {
                    setDialogOpen(true);
                  }
                }}
                disabled={numSelected === maxPlayers && !x.checked}
                color="success"
              />
              }
              label={x.name}
            />
           {x.checked && (
           <FormControl sx={{ minWidth: 120 }} size="small">
<Dialog open={dialogOpen && Boolean(selectedPlayer)} onClose={handleClose}>        
<DialogTitle>Select color for {selectedPlayer}</DialogTitle>
        <DialogContent sx={{ padding: "24px" }}>
          <Box sx={{ display: "flex", gap: "12px" }}>
            {availableColors.includes("red") && (
              <Button
                onClick={() => handleColorClick("red")}
                sx={{
                  backgroundColor: "#f44336",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "8px",
                }}
              >
                Red
              </Button>
            )}
            {availableColors.includes("blue") && (
              <Button
                onClick={() => handleColorClick("blue")}
                sx={{
                  backgroundColor: "#2196f3",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "8px",
                }}
              >
                Blue
              </Button>
            )}
            {availableColors.includes("green") && (
              <Button
                onClick={() => handleColorClick("green")}
                sx={{
                  backgroundColor: "#4caf50",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "8px",
                }}
              >
                Green
              </Button>
            )}
            {availableColors.includes("yellow") && (
              <Button
                onClick={() => handleColorClick("yellow")}
                sx={{
                  backgroundColor: "#ffeb3b",
                  color: "#000",
                  fontWeight: "bold",
                  borderRadius: "8px",
                }}
              >
                Yellow
              </Button>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            size="large"
            onClick={() => {
              togglePlayer(selectedPlayer);
              setSelectedPlayer('');
              setDialogOpen(false);
            }}
            sx={{ fontWeight: "bold" }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </FormControl>

         

      )}
      
            
      </Box>
          </FormGroup>

          
          
      ))}
<Box sx={{ backgroundColor: '', mt: 1}}>

  <Typography variant="h5" sx={{ marginBottom: 3 }}>Selected players:</Typography>
  {chosenPlayers
    .filter((x) => x.checked && x.color)
    .map((x) => (
      <Box key={x.name} sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: '#F6F6F6', 
          color: 'white',
          padding: 1, 
          borderRadius: 4, 
          mb: 1
        }}>
        <Avatar sx={{ backgroundColor: x.color, marginRight: 2, color: 'black' }}>{x.name[0]}</Avatar>
        <div>
          <Typography variant="subtitle1" sx={{ marginBottom: 1, color: 'text.primary', fontWeight: 'bold' }}>{x.name}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 1,}}>Playing with {x.color}</Typography>
        </div>
      </Box>
    ))}
   
  <Box sx={{ position: 'fixed', bottom: 0, left: 0, width: '100%', p: 1 }}>
    <Button 
      variant="contained" 
      size="large" 
      disabled={disableStartButton}
      onClick={startGame} 
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    > Start Game
    </Button>
  </Box>
</Box>

        </>
    );
};
