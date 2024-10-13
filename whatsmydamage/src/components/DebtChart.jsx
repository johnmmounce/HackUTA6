import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register the components with Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const DebtChart = ({ data }) => {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Debt Progress',
                data: data.values,
                fill: false,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(75,192,192,0.2)',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false, // Allows the chart to resize dynamically
        responsive: true,           // Ensures the chart is responsive
    };

    return (
        <div style={{ width: '100%', height: '400px' }}>
            <Line data={chartData} options={options} />
        </div>
    );
};

DebtChart.propTypes = {
    data: PropTypes.shape({
        labels: PropTypes.arrayOf(PropTypes.string).isRequired,
        values: PropTypes.arrayOf(PropTypes.number).isRequired,
    }).isRequired,
};

export default DebtChart;
