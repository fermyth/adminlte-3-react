import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

interface ChartProps {
  data: number[];
  labels: string[];
}

const MyChart: React.FC<ChartProps> = ({ data, labels }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Total Invoice Value',
              data: data,
              backgroundColor: [
                '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
              ],
              borderColor: [
                '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
              ],
              borderWidth: 1,
              hoverBackgroundColor: '#ffcc00',
              hoverBorderColor: '#333'
            }]
          },
          options: {
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  color: '#333',
                  font: { size: 14 }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: '#333',
                  font: { size: 12 }
                }
              },
              x: {
                ticks: {
                  color: '#333',
                  font: { size: 12 }
                }
              }
            }
          }
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, labels]);

  return <canvas ref={chartRef} />;
}

export default MyChart;
