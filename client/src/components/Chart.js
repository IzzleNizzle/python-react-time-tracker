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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const colors = ['rgb(255, 99, 132)', 'rgb(75, 192, 192)', 'rgb(53, 162, 235)', 'rgb(255, 99, 132)', 'rgb(75, 192, 192)',]

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
            labels: dailyData.headers,
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


    useEffect(() => {
        fetch('/api/time/weekly', {
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

    useEffect(() => {
        console.log({ graphData });
    }, [graphData])


    return <>
        {graphData && <Bar options={options} data={graphData} />}
    </>;
}

