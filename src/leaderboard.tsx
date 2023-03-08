import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface LeaderboardData {
  name: string;
  wins: number;
  losses: number;
}

interface LeaderboardProps {
  data: LeaderboardData[];
}

const LeaderboardTable: React.FC<LeaderboardProps> = ({ data }) => {
  return (
    <>
    <h1>Leaderboard</h1>
        <Table>
        <TableHead>
            <TableRow>
                
            <TableCell>Name</TableCell>
            <TableCell>Wins</TableCell>
            <TableCell>Losses</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {data.map(({ name, wins, losses }, index) => (
            <TableRow key={index}>
                
                <TableCell><b>{name}</b></TableCell>
                <TableCell>{wins}</TableCell>
                <TableCell>{losses}</TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </>
  );
};

export default LeaderboardTable;
