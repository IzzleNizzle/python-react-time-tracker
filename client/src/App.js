import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Selecter from './components/Selecter'
import { getFormatedDateString } from './utils/util'
import { useStopwatch } from 'react-timer-hook';


function App() {
  const [activity, setActivity] = useState('');

  const handleChange = (event) => {
    setActivity(event.target.value);
  };

  const { seconds } = useStopwatch({ autoStart: true });

  useEffect(() => {
    fetch('/api/time', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        timeStamp: getFormatedDateString(),
        activity
       })
    });
  }, [seconds, activity])


  const chooseBackgroundColor = () => {
    switch (activity) {
      case 'code':
        return 'primary.main'
      case 'learn':
        return 'secondary.main'
      case 'meeting':
        return 'error.main'
      case 'game':
        return 'warning.main'
      case 'break':
        return 'info.main'
      default:
        return 'grey.main'
    }
  }

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Card sx={{
          marginTop: 8,
        }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: chooseBackgroundColor() }} aria-label="time">
                <AccessTimeIcon />
              </Avatar>
            }
            title="Time Track"
            subheader={getFormatedDateString()}
          />
          <CardContent>
            <Selecter
              handleChange={handleChange}
              activity={activity}
            />
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default App;
