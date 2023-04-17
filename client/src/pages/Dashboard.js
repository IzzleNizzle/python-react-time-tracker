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
  Card, CardContent
} from '@mui/material';
import Chart from '../components/Chart';

const timeFrames = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let timeString = "";
  if (hours > 0) {
    timeString += `${hours} hour${hours > 1 ? "s" : ""}, `;
  }
  if (minutes > 0) {
    timeString += `${minutes} minute${minutes > 1 ? "s" : ""}, `;
  }
  timeString += `${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`;

  return timeString;
}

const DailyAggregate = ({ header, data }) => {
  // sort data by duration
  const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return <Card>
    <CardContent>
      <Typography variant="h5">{header}</Typography>
      {sortedData.map(([activity, duration]) => (
        <Typography key={activity}>
          {activity}: {formatTime(duration)}
        </Typography>
      ))}
    </CardContent>
  </Card>
};

const TotalAggregate = ({ data }) => {
  // sort data by duration
  const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return <Card>
    <CardContent>
      <Typography variant="h5">Totals</Typography>
      {sortedData.map(([activity, duration]) => (
        <Typography key={activity}>
          {activity}: {formatTime(duration)}
        </Typography>
      ))}
    </CardContent>
  </Card>
}


const DashboardPage = () => {
  const [timeFrame, setTimeFrame] = useState('weekly');
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
        <Grid container spacing={3}>
          {plainRenderDataSingle.length > 0 && plainRenderDataSingle.map((singleData) => {
            const keyName = Object.keys(singleData)[0]
            const data = singleData[keyName]
            return <Grid item xs={12} md={4}>
              <DailyAggregate key={keyName} header={keyName} data={data} />
            </Grid>
          }
          )}
          <Grid item xs={12} md={4}>
            <TotalAggregate data={plainRenderDataTotal} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardPage;
