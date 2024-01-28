import React, { useState, useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Selecter from '../components/Selecter';
import FormDialog from '../components/FormDialog';
import Typography from '@mui/material/Typography';
import { getFormatedDateString } from '../utils/util';
import { useStopwatch } from 'react-timer-hook';
import { useSnackbar } from 'notistack';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { io } from 'socket.io-client';



export default function HomePage() {
    const [activity, setActivity] = useState('');
    const [changedTime, setChangedTime] = useState(Date.now());
    const { enqueueSnackbar } = useSnackbar();

    const handleChange = (event) => {
        activity && enqueueSnackbar(`Activity: ${activity}. ${timeDifference(Date.now(), changedTime)}`);
        setActivity(event.target.value);
        setSelectedValue(event.target.value);
        setChangedTime(Date.now());
        socket.emit('activity_change', event.target.value);
    };

    const [socket, setSocket] = useState(null)
    const activityRef = useRef(activity);

    useEffect(() => {
        activityRef.current = activity;
    }, [activity]);

    const [selectedValue, setSelectedValue] = useState('');



    const socketChangeEvent = (newActivity) => {
        console.log('socket hit', newActivity);
        activityRef.current && enqueueSnackbar(`Activity: ${activityRef.current}. ${timeDifference(Date.now(), changedTime)}`);
        setActivity(newActivity);
        setSelectedValue(newActivity);
        setChangedTime(Date.now());
    }

    useEffect(() => {
        if (!socket) {
            setSocket(io({ secure: false, }))
        }
        if (socket) {
            socket.on('connect', () => {
                console.log("socket.on Connected")
            })
            socket.on('activity_change', socketChangeEvent);
        }
    }, [socket])

    const calcSecondsDistance = (timestamp1, timestamp2) => {
        const difference = Math.abs(timestamp1 - timestamp2);
        return Math.round(difference / 1000);
    };

    const timeDifference = (timestamp1, timestamp2) => {
        const difference = calcSecondsDistance(timestamp1, timestamp2);

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
        }).catch(error => {
            console.error(error);
            window.location.reload();
        });
    }, [
        seconds, activity
    ]);


    const chooseBackgroundColor = () => {
        switch (activity) {
            case 'code':
                return 'primary.main';
            case 'learn':
                return 'secondary.main';
            case 'meeting':
                return 'error.main';
            case 'game':
                return 'warning.main';
            case 'break':
                return 'info.main';
            default:
                return 'grey.main';
        }
    };

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [activityList, setActivityList] = useState([]);

    const getActivityList = () => {
        fetch('/api/activity-list', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(resp => resp.json())
            .then(resp => {
                setActivityList(resp.data);
            }).catch(error => {
                console.log(error);
                console.error(error);
            });
    };

    const updateActivityList = (activityListArray) => {
        fetch('/api/activity-list', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                activityList: activityListArray
            })
        })
            .then(resp => resp.json())
            .then(resp => {
                setActivityList(resp.data);
            }).catch(error => {
                console.log(error);
                console.error(error);
            });
    };

    useEffect(getActivityList, []);


    return (
        <>
            {activityList.length > 0 && <FormDialog
                open={open}
                handleClose={handleClose}
                activities={activityList}
                updateActivityList={updateActivityList} />}
            <Container component="main" maxWidth="xs">
                <Card sx={{
                    marginY: 8,
                }}>
                    <CardHeader
                        avatar={<Avatar sx={{ bgcolor: chooseBackgroundColor() }} aria-label="time">
                            <AccessTimeIcon />
                        </Avatar>}
                        title="Iz's Time Track"
                        subheader={getFormatedDateString()}
                        action={<IconButton aria-label="settings"
                            onClick={handleClickOpen}
                        >
                            <EditIcon />
                        </IconButton>} />
                    <CardContent>
                        <Typography component="p">
                            Current: {timeDifference(Date.now(), changedTime)}
                        </Typography>
                        {activityList.length > 0 && <Selecter
                            handleChange={handleChange}
                            activity={activity}
                            activities={activityList}
                            selectedValue={selectedValue}
                        />}

                    </CardContent>
                </Card>
            </Container>
        </>
    );
}
