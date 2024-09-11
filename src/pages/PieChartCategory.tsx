import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

interface Employee {
  type: 'GS' | 'Job Holder';
}

interface DoughnutChartProps {
  employees: Employee[];
}

const PieChartCategory: React.FC<DoughnutChartProps> = ({ employees }) => {
  // Count the number of 'GS' and 'Job Holder'
  const gsCount = employees.filter(employee => employee.type === 'GS').length;
  const jobHolderCount = employees.filter(employee => employee.type === 'Job Holder').length;

  const data = {
    datasets: [
      {
        data: [gsCount, jobHolderCount], // The value and remaining part
        backgroundColor: ['#ff9f40', '#ffcd56'], // Colors for the chart
        borderColor: ['#ff9f40', '#ffcd56'],
        borderWidth: 2,
        cutout: '70%', // Creates a smaller empty center
        hoverOffset: 4, // Adds space between segments when hovered
      },
    ],
    labels: ['GS', 'Job Holder'], // Labels for the chart
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw as number;
            return `${label}: ${value}`;
          }
        },
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
        bodyFont: { weight: 'bold' },
        titleFont: { weight: 'bold' },
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#333',
          font: { size: 14, weight: 'bold' },
        },
      },
    },
  };

  return (
    <div style={{ position: 'relative', width: '250px', height: '250px' }}>
      <Doughnut data={data} options={options} />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '20px',
          color: '#333',
          textAlign: 'center',
        }}
      >
        <div>Total</div>
        <div>{employees.length}</div>
      </div>
    </div>
  );
};

export default PieChartCategory;
