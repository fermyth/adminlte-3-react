import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Driver {
  age: number;
}

interface DoughnutChartProps {
  drivers: Driver[];
}

const PieChart: React.FC<DoughnutChartProps> = ({ drivers }) => {
  const retiredDrivers = drivers.filter(driver => driver.age >= 45).length;
  const nonRetiredDrivers = drivers.length - retiredDrivers;

  const data = {
    datasets: [
      {
        data: [retiredDrivers, nonRetiredDrivers],
        backgroundColor: ['#ff6384', '#36a2eb'],
        borderColor: ['#ff6384', '#36a2eb'],
        borderWidth: 2,
        cutout: '70%',
        hoverOffset: 4,
      },
    ],
    labels: ['Pensiun', 'Belum Pensiun'],
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
        <div>{drivers.length}</div>
      </div>
    </div>
  );
};

export default PieChart;
