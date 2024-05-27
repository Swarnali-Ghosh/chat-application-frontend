import React from 'react'
import { Line, Doughnut } from "react-chartjs-2"
import {
    Chart as ChartJS,
    Tooltip,
    Filler,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Legend
} from 'chart.js'
import { getLast7Days } from '../../lib/features';

ChartJS.register(
    Tooltip,
    Filler,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Legend
);

const labels = getLast7Days();

const lineChartOptions = {
    responsive: true,
    Plugin: {
        Legend: {
            display: false,
        },
        title: {
            display: false
        },
    },

    scales: {
        x: {
            grid: {
                display: false
            },
            // display: false
        },
        y: {
            beginAtZero: true,
            grid: {
                display: false
            },
            // display: false
        }
    }
};

const LineChart = ({ value = [] }) => {

    const data = {
        // key value pair same
        labels,
        datasets: [
            {
                data: value,
                label: "Revenue",
                fill: false,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192, 192,1)"
            },
            {
                data: [1, 22, 5, 6],
                label: "Revenue",
                fill: false,
                backgroundColor: "rgba(175,192,192,0.2)",
                borderColor: "rgba(75,12, 192,1)"
            },
        ]
    };

    return (
        <Line data={data} options={lineChartOptions} />
    )
}

const doughnutChartOptions = {
    responsive: true,
    cutout: 120,
    // plugins: {
    //     legend: {
    //         display: false
    //     },
    //     title: {
    //         display: false
    //     }
    // }
}

const DoughnutChart = ({ value = [], labels = [] }) => {
    const data = {
        // key value pair same
        labels,
        datasets: [
            {
                data: value,
                label: "Total Chats vs Group Chats",
                backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(75, 12, 192, 1)"],
                borderColor: ["rgba(75, 192, 192, 0.2)", "rgba(75, 192, 192, 1)"],
                offset: 20
            }
        ]
    };
    return (
        <Doughnut style={{ zIndex: 10 }} data={data} options={doughnutChartOptions} />
    )
}

export { LineChart, DoughnutChart };