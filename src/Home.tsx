import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';

export const Home = () => {
    return (
    <>
    
      
      <Card>
        <CardContent>
          <Typography variant="h3" component="div">
            Play
          </Typography>
          <Typography variant="h5" component="div">
            Play a game of TCA Trouble
          </Typography>
          <CardActions style={{justifyContent: 'center'}}>
            <Button variant="contained" size="large">Play</Button>
          </CardActions>
        </CardContent>
      </Card>
      
    
    </>
  )
    };