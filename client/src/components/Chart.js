import React, { useEffect } from 'react';
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

const graphDataBuilder = (dailyData) => {

    // new approach, data source updated

    // split the data up by date
    let mainArray = {}
    dailyData.forEach(element => {
        const dateString = element[2]
        const monthDay = getMonthAndDay(dateString)
        const monthDayString = `${monthDay.month}-${monthDay.day}`
        if (monthDayString in mainArray) {
            mainArray[monthDayString].push(element)
        } else {
            mainArray[monthDayString] = [element]
        }
    });

    // let obj2 = {
    //     "01-23": [Array(3)],
    //     "00-24": [Array(3), Array(3), Array(3), Array(3), Array(3), Array(3), Array(3)],
    //     "02-25": [Array(3), Array(3), Array(3)],
    //     "00-26": [Array(3), Array(3), Array(3), Array(3), Array(3)],
    //     "10-27": [Array(3), Array(3), Array(3), Array(3)],
    //     "00-28": [Array(3), Array(3), Array(3), Array(3)],
    //     "11-29": [Array(3), Array(3), Array(3), Array(3), Array(3), Array(3)]
    // };

    // Combine daily data totals
    const combinedMainArray = []
    for (let day in mainArray) {
        combinedMainArray.push([day, combineDailyActivity(mainArray[day])])
    }
    let sortedData = combinedMainArray.sort((a, b) => {
        let aKey = a[0].split('-').join('');
        let bKey = b[0].split('-').join('');
        return bKey - aKey;
    });
    console.log(sortedData);


    // Get data header
    // Get data labels
    // Organize data
}

const labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
                graphDataBuilder(res)
            })
            .catch(error => {
                console.error(error)
            });
    }, [])

    return <Bar options={options} data={data} />;
}

