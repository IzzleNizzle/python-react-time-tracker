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
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

  const data = [
    // Replace this array with your actual chart data
    { name: 'A', value: 100 },
    { name: 'B', value: 200 },
    { name: 'C', value: 300 },
    { name: 'D', value: 400 },
  ];

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
          {[1, 2, 3].map((chart) => (
            <Grid item xs={12} md={6} lg={4} key={chart}>
              <Typography variant="h6" gutterBottom>
                Chart {chart}
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardPage;
