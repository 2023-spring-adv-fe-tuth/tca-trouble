import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import { GameResult, LeaderboardPlayer } from "./front-end-model";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";  
import { durationFormatter } from "human-readable";

import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";

import { getPlayerCountsTotal } from "./App";

interface HomeProps {
  leaderboardData: LeaderboardPlayer[];
  shortestGameDuration: number;
  longestGameDuration: number;
  playerRollCounts: { [playerName: string]: number };
  playerBumpedCounts: { [playerName: string]: number };
  results: GameResult[];
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
  },
}));



export const Home: React.FC<HomeProps> = ({
  leaderboardData,
  shortestGameDuration,
  longestGameDuration,
  playerRollCounts,
  playerBumpedCounts,
  results,
}) => {
  

  const nav = useNavigate();

  const format = durationFormatter();

  const [countsTotal, setCountsTotal] = useState<Record<string, number>>({});

  useEffect(() => {
    const playerBumpedCountsTotal = getPlayerCountsTotal(results.map((result) => result.playerBumpedCounts));
    setCountsTotal(playerBumpedCountsTotal);
  }, [results]);
  

  return (
    <>


<Button
  variant="contained"
  size="large"
  onClick={() => nav("/setup")}
  startIcon={<PlayCircleOutlineIcon />}
  sx={{
    width: "100%",
    mt: 2,
    mb: 2,
    borderRadius: "20px",
    bgcolor: "#6C63FF",
    '&:hover': {
      bgcolor: "#5A52CC",
    },
  }}
>
  <Typography variant="button" fontWeight="bold">
    Play
  </Typography>
</Button>
<p>Home page:
  {Object.entries(getPlayerCountsTotal(results.map((result) => result.playerBumpedCounts)))
    .map(([player, count]) => `${player}: ${count}`)
    .join(", ")}
</p>
<p>
  home page:
  {Object.entries(getPlayerCountsTotal(results.map((result) => result.playerRollCounts)))
    .map(([player, count]) => `${player}: ${count}`)
    .join(", ")}
</p>
      <Card
        sx={{
          width: "100%",
          mt: 2,
          mb: 2,
        }}
      >
        <CardContent>
          {leaderboardData.length == 0 && (
            <Typography variant="h3" component="div">
              Play a game of <b>Trouble</b> to see your leaderboard!
            </Typography>
          )}

          {leaderboardData.length > 0 && (
            <TableContainer component={Paper}>
              <Typography
                variant="h4"
                component="div"
                
              >
                Leaderboard
              </Typography>
              <Table aria-label="customized table">
              <TableHead sx={{ background: "linear-gradient(to right, #00B4DB, #0083B0)" }}>
  <TableRow>
    <StyledTableCell sx={{ color: "#fff" }}>Name</StyledTableCell>
    <StyledTableCell align="left" sx={{ color: "#fff" }}>
      W
    </StyledTableCell>
    <StyledTableCell align="left" sx={{ color: "#fff" }}>
      L
    </StyledTableCell>
    <StyledTableCell align="left" sx={{ color: "#fff" }}>
      AVG
    </StyledTableCell>
  </TableRow>
</TableHead>
                <TableBody>
                  {leaderboardData.map((x) => (
                    <StyledTableRow key={x.name}>
                      <StyledTableCell component="th" scope="row">
                        {x.name}
                      </StyledTableCell>
                      <StyledTableCell align="left">{x.wins}</StyledTableCell>
                      <StyledTableCell align="left">{x.losses}</StyledTableCell>
                      <StyledTableCell align="left">{x.avg}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Card
        sx={{
          width: "100%",
          mt: 2,
    mb: 2,
          
        }}
      >
        <CardContent>
          <Typography variant="h3">
            Game Stats
          </Typography>
          <Typography variant="h6">
            {`Shortest game: ${Number.isInteger (shortestGameDuration) ? format(shortestGameDuration) : "N/A"}`}
          </Typography>
          <Typography variant="h6">
          {`Longest game: ${Number.isInteger (longestGameDuration) ? format(longestGameDuration) : "N/A"}`}
          </Typography>
        </CardContent>
      </Card>

      <Card
        sx={{
          width: "100%",
          mt: 2,
    mb: 2,
        }}
      >
        <CardContent>
          <Typography variant="h4" component="div">
            Who rolled 6 the most?
          </Typography>
          {Object.keys(playerRollCounts).length > 0 ? (
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell align="left">
                      Number of 6 rolled
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(playerRollCounts)
                    .sort((a, b) => playerRollCounts[b] - playerRollCounts[a])
                    .map((x) => (
                      <StyledTableRow key={x}>
                        <StyledTableCell component="th" scope="row">
                          {x}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {playerRollCounts[x]}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" component="div">
              No stats available. Play a game to see your stats!
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card
        sx={{
          width: "100%",
          
        }}
      >
        <CardContent>
          <Typography variant="h4" component="div">
            Who been bumped the most?
          </Typography>
          {Object.keys(playerBumpedCounts).length > 0 ? (
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell align="left">
                      Number of times bumped
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(playerBumpedCounts)
                    .sort((a, b) => playerBumpedCounts[b] - playerBumpedCounts[a])
                    .map((x) => (
                      <StyledTableRow key={x}>
                        <StyledTableCell component="th" scope="row">
                          {x}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {playerBumpedCounts[x]}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" component="div">
              No stats available. Play a game to see your stats!
            </Typography>
          )}
        </CardContent>
      </Card>
    </>
  );
};
