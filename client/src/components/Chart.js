import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import faker from 'faker';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const DATA = { "headers": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday"], "index": ["learn", "meeting", "code", "break", "game", ""], "values": [[3859, 0, 1741, 1841, 621, 0, 0], [6639, 1763, 0, 0, 0, 0, 364], [7891, 5435, 6633, 12393, 2718, 3021, 18071], [4266, 2995, 9469, 12253, 5482, 1065, 4620], [9551, 8712, 4688, 12172, 0, 3313, 3078], [0, 2004, 536, 279, 112, 1179, 4295]] }


const getMonthAndDay = (dateString) => {
    const date = new Date(dateString);

    const rawMonth = date.getMonth(); // returns 0-11, so January is 0, February is 1, etc.
    const day = date.getDate(); // returns the day of the month, so the 30th in this case

    const month = `${rawMonth < 10 ? `0${rawMonth}` : rawMonth}`

    console.log('Month:', month);
    console.log('Day:', day);
    return {
        month,
        day
    }
}

const combineDailyActivity = (arr) => {
    const combinedArr = arr.reduce((acc, cur) => {
        if (!acc[cur[0]]) {
            acc[cur[0]] = [cur[0], cur[1], cur[2]];
        } else {
            acc[cur[0]][1] += cur[1];
        }
        return acc;
    }, {});
    return combinedArr
}



const labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const colors = ['rgb(255, 99, 132)', 'rgb(75, 192, 192)', 'rgb(53, 162, 235)', 'rgb(255, 99, 132)', 'rgb(75, 192, 192)',]
export const data = {
    labels,
    datasets: [
        {
            label: 'Break',
            data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
            backgroundColor: 'rgb(255, 99, 132)',
        },
        {
            label: 'Code',
            data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
            backgroundColor: 'rgb(75, 192, 192)',
        },
        {
            label: 'Game',
            data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
            backgroundColor: 'rgb(53, 162, 235)',
        },
        {
            label: 'Learn',
            data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
            backgroundColor: 'rgb(255, 99, 132)',
        },
        {
            label: 'Meeting',
            data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
            backgroundColor: 'rgb(75, 192, 192)',
        },
    ],
};
export default function App() {
    const [graphData, setGraphData] = useState('')
    const options = {
        plugins: {
            title: {
                display: true,
                text: 'Chart.js Bar Chart - Stacked',
            },
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };
    const graphDataBuilder = (dailyData) => {
        const graphData = {
            labels,
            datasets: dailyData.index.map((label, i) => {
                return {
                    label,
                    data: dailyData.values[i],
                    backgroundColor: colors[i % 5]
                }
            })
        }
        return graphData
    }


    // graphDataBuilder(DATA)


    useEffect(() => {
        fetch('/api/daily-time', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

        })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                setGraphData(graphDataBuilder(res))
            })
            .catch(error => {
                console.error(error)
            });
    }, [])

    return <>
        {graphData && <Bar options={options} data={graphData} />}
    </>;
}

