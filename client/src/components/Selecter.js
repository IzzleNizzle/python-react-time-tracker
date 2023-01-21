import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

export default function Selecter({ handleChange, activity }) {
    console.log({ activity });


    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <FormLabel id="demo-radio-buttons-group-label">Activity: {activity}</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    onChange={handleChange}
                >
                    <FormControlLabel value="code" control={<Radio />} label="Coding" />
                    <FormControlLabel value="learn" control={<Radio />} label="Learning" />
                    <FormControlLabel value="game" control={<Radio />} label="Gaming" />
                    <FormControlLabel value="meeting" control={<Radio />} label="Meeting" />
                    <FormControlLabel value="break" control={<Radio />} label="Break" />
                </RadioGroup>
            </FormControl>
        </Box>
    );
}