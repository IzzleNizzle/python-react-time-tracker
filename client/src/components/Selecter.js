import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Selecter({ handleChange, activity }) {



  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Activity</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={activity}
          label="Activity"
          onChange={handleChange}
        >
          <MenuItem value={'code'}>Coding</MenuItem>
          <MenuItem value={'learn'}>Learning</MenuItem>
          <MenuItem value={'game'}>Gaming</MenuItem>
          <MenuItem value={'break'}>Break</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}