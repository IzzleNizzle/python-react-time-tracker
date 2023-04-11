import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Chart from '../components/Chart';

const timeFrames = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const DashboardPage = () => {
  const [timeFrame, setTimeFrame] = useState('daily');

  const handleTimeFrameChange = (event) => {
    setTimeFrame(event.target.value);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <FormControl fullWidth variant="outlined" sx={{ my: 2 }}>
          <InputLabel>Time Frame</InputLabel>
          <Select value={timeFrame} onChange={handleTimeFrameChange} label="Time Frame">
            {timeFrames.map((timeFrame) => (
              <MenuItem key={timeFrame.value} value={timeFrame.value}>
                {timeFrame.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Chart />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardPage;
