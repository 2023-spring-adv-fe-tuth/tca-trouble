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

import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));


export interface SetupProps {
  previousPlayers: string[];
  setSetupInfo: (si: SetupInfo) => void;
}

export const Setup: React.FC<SetupProps> = ({ previousPlayers, setSetupInfo }) => {
  const nav = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
            <Box  sx={{ display: "flex", alignItems: "flex-end" }}>
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
            {x.checked && (
            <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Select Your Color
      </Button>
       )}
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} disableRipple>
          <EditIcon />
          Blue
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <FileCopyIcon />
          Red
        </MenuItem>
        <Divider/>
        <MenuItem onClick={handleClose} disableRipple>
          <ArchiveIcon />
          Yellow
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <MoreHorizIcon />
          Green
        </MenuItem>
      </StyledMenu>
      </Box>
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
