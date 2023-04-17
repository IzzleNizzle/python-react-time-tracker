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



const colors = ['rgb(252 111 142)', 'rgb(75, 192, 192)', 'rgb(53, 162, 235)', 'rgb(252 111 142)', 'rgb(75, 192, 192)','rgb(0 63 111)', 'rgb(184 5 190)']

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

