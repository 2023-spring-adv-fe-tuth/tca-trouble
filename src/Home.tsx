import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import { LeaderboardPlayer } from "./front-end-model";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { durationFormatter } from "human-readable";

interface HomeProps {
  leaderboardData: LeaderboardPlayer[];
  shortestGameDuration: number;
  longestGameDuration: number;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 1,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontWeight: "bold",
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

export const Home: React.FC<HomeProps> = ({
  leaderboardData,
  shortestGameDuration,
  longestGameDuration,
}) => {
  console.log(leaderboardData);

  const nav = useNavigate();

  const format = durationFormatter();

  return (
    <>
      <Button
        variant="contained"
        size="large"
        onClick={() => nav("/setup")}
        sx={{
          width: "100%",
          m: 2,
        }}
      >
        {" "}
        Play
      </Button>
      <Card
        sx={{
          width: "100%",
          m: 2,
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
                variant="h3"
                component="div"
                sx={{
                  m: 2,
                }}
              >
                Leaderboard
              </Typography>
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell align="left">W</StyledTableCell>
                    <StyledTableCell align="left">L</StyledTableCell>
                    <StyledTableCell align="left">AVG</StyledTableCell>
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
          m: 2,
        }}
      >
        <CardContent>
          <Typography variant="h3" component="div">
            Game Stats
          </Typography>
          <Typography variant="h6">
            Shortest Game: {`${format(shortestGameDuration)}`}
          </Typography>
          <Typography variant="h6">
            Longest Game: {`${format(longestGameDuration)}`}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};
