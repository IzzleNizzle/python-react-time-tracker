import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Selecter from './components/Selecter'
import Chart from './components/Chart'
import Typography from '@mui/material/Typography';
import { getFormatedDateString } from './utils/util'
import { useStopwatch } from 'react-timer-hook';
import { useSnackbar } from 'notistack';
import "./app.css"


function App() {
    const [activity, setActivity] = useState('');
    const [changedTime, setChangedTime] = useState(Date.now());
    const { enqueueSnackbar } = useSnackbar();

    const handleChange = (event) => {
        activity && enqueueSnackbar(`Activity: ${activity}. ${timeDifference(Date.now(), changedTime)}`);
        setActivity(event.target.value);
        setChangedTime(Date.now())
    };

    const calcSecondsDistance = (timestamp1, timestamp2) => {
        const difference = Math.abs(timestamp1 - timestamp2);
        console.log({
            timestamp1, timestamp2,
            difference, calc: difference / 1000
        });
        return Math.round(difference / 1000);
    }

    const timeDifference = (timestamp1, timestamp2) => {
        const difference = calcSecondsDistance(timestamp1, timestamp2)

        let minutes = Math.floor(difference / 60);
        let remainingSeconds = difference % 60;
        let hours = 0;

        if (minutes >= 60) {
            hours = Math.floor(minutes / 60);
            minutes = minutes % 60;
        }

        if (hours === 0) {
            return `${minutes} minutes, ${remainingSeconds} seconds`;
        } else if (hours === 1) {
            return `${hours} hour, ${minutes} minutes, ${remainingSeconds} seconds`;
        } else {
            return `${hours} hours, ${minutes} minutes, ${remainingSeconds} seconds`;
        }
    }

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
                        title="Iz's Time Track"
                        subheader={getFormatedDateString()}
                    />
                    <CardContent>
                        <Typography component="p">
                            Current: {timeDifference(Date.now(), changedTime)}
                        </Typography>
                        <Selecter
                            handleChange={handleChange}
                            activity={activity}
                        />
                    </CardContent>
                </Card>
            </Container>
            <Container component="main" maxWidth="lg">
                <Chart></Chart>
            </Container>
        </>
    );
}

export default App;
