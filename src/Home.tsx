import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';

import LeaderboardTable from './leaderboard';

const leaderboardData = [
  { name: 'Hristijan', wins: 1, losses: 1 },
  { name: 'Bob', wins: 6, losses: 2 },
  { name: 'Jimmy', wins: 5, losses: 4 },
    { name: 'Sally', wins: 3, losses: 6 },
];

export const Home = () => {
    const nav = useNavigate();
    return (
        <><Card>
            <CardContent>
                <Typography variant="h3" component="div">
                    Play a game of  <b>Trouble</b>
                </Typography>
                <CardActions style={{ justifyContent: 'center', width: '100%', }}>
                <Button 
  variant="contained" 
  size="large" 
  onClick={() => nav("/setup")} 
  style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}
>
  Play
</Button>
                </CardActions>
            </CardContent>
        </Card><div>
                <LeaderboardTable data={leaderboardData} />
            </div>
            </>
      );
        
    

 
    };