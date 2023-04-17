import React from 'react';
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

export default function Chart({ graphData }) {
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
    const graphDataBuilder = (rawGraphData) => {
        const organizedGraphData = {
            labels: rawGraphData.headers,
            datasets: rawGraphData.index.map((label, i) => {
                return {
                    label,
                    data: rawGraphData.values[i],
                    backgroundColor: colors[i % 5]
                }
            })
        }
        return organizedGraphData
    }


    return <>
        {graphData && <Bar options={options} data={graphDataBuilder(graphData)} />}
    </>;
}

