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
import { getFormatedTimeFromSeconds } from '../utils/util';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const colors = [
    'rgb(230, 25, 75)',  // Red
    'rgb(60, 180, 75)',  // Green
    'rgb(255, 225, 25)',  // Yellow
    'rgb(0, 130, 200)',  // Blue
    'rgb(245, 130, 48)',  // Orange
    'rgb(145, 30, 180)',  // Purple
    'rgb(70, 240, 240)',  // Cyan
    'rgb(240, 50, 230)',  // Magenta
    'rgb(210, 245, 60)',  // Lime
    'rgb(250, 190, 190)'  // Pink
];


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
        plugins: {
            tooltip: {
                callbacks: {
                    footer: (tooltipItems) => {
                        const seconds = tooltipItems[0].raw
                        return getFormatedTimeFromSeconds(seconds)
                    },
                }
            }
        }
    };
    const graphDataBuilder = (rawGraphData) => {
        const organizedGraphData = {
            labels: rawGraphData.headers,
            datasets: rawGraphData.index.map((label, i) => {
                return {
                    label,
                    data: rawGraphData.values[i],
                    backgroundColor: colors[i % colors.length]
                }
            })
        }
        return organizedGraphData
    }


    return <>
        {graphData && <Bar options={options} data={graphDataBuilder(graphData)} />}
    </>;
}

