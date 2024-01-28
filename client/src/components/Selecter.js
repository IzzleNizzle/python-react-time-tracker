import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

export default function Selecter({ handleChange, activity, activities, selectedValue }) {

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <FormLabel id="demo-radio-buttons-group-label">Activity: {activity}</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    value={selectedValue}
                    onChange={handleChange}
                >
                    {activities.map((act, index) => <FormControlLabel key={index} value={act} control={<Radio />} label={act} />)}
                </RadioGroup>
            </FormControl>
        </Box>
    );
}
