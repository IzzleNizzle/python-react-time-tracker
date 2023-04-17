import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card, CardContent, Stack
} from '@mui/material';
import Chart from '../components/Chart';

const timeFrames = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const DailyAggregate = ({ header, data }) => (
  <Card>
    <CardContent>
      <Typography variant="h5">{header}</Typography>
      {Object.entries(data).map(([activity, duration]) => (
        <Typography key={activity}>
          {activity}: {duration}
        </Typography>
      ))}
    </CardContent>
  </Card>
);

const TotalAggregate = ({data}) => (
  <Card>
    <CardContent>
      <Typography variant="h5">Monthly Aggregate</Typography>
      {Object.entries(data).map(([activity, duration]) => (
        <Typography key={activity}>
          {activity}: {duration}
        </Typography>
      ))}
    </CardContent>
  </Card>
);


const DashboardPage = () => {
  const [timeFrame, setTimeFrame] = useState('hourly');
  const [graphData, setGraphData] = useState('')
  const [plainRenderDataSingle, setPlainRenderDataSingle] = useState([])
  const [plainRenderDataTotal, setPlainRenderDataTotal] = useState({})

  const handleTimeFrameChange = (event) => {
    setTimeFrame(event.target.value);
  };




  useEffect(() => {
    fetch(`/api/time/${timeFrame}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },

    })
      .then(res => res.json())
      .then(res => {
        console.log(res)
        setGraphData(res)
        setPlainRenderDataSingle(singleDataFactory(res))
        setPlainRenderDataTotal(dataAggregateFactory(res))
      })
      .catch(error => {
        console.error(error)
      });
  }, [timeFrame])


  const singleDataFactory = (data) => {
    const singleDataArray = []
    data.headers.forEach((entry, headersIndex) => {
      const singleData = {}

      if (!singleData[entry]) {
        singleData[entry] = {}
      }

      data.index.forEach((activity, index) => {
        const duration = data.values[index][headersIndex]
        singleData[entry][activity] = duration
      })
      singleDataArray.push(singleData)
    })
    return singleDataArray
  }



  const dataAggregateFactory = (data) => {
    const index = data.index;
    const values = data.values;
    const result = {};

    for (let i = 0; i < index.length; i++) {
      const key = index[i];
      const value = values[i].reduce((acc, curr) => {
        return acc + curr
      }, 0);
      if (key && value) {
        result[key] = value.toString();
      }
    }

    return result;
  }


  const dataAggregate = {
    Gaming: '4hrs 15mins',
    Break: '4hrs 20mins',
    Work: '4hrs 20mins',
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
            <Chart
              graphData={graphData}
              timeFrame={timeFrame}
            />
          </Grid>
        </Grid>
        <Stack spacing={2}>
          {plainRenderDataSingle.length > 0 && plainRenderDataSingle.map((singleData) => {
            const keyName = Object.keys(singleData)[0]
            const data = singleData[keyName]
            return <DailyAggregate key={keyName} header={keyName} data={data} />
          }
          )}
          <TotalAggregate data={plainRenderDataTotal} />
        </Stack>
      </Box>
    </Container>
  );
};

export default DashboardPage;
