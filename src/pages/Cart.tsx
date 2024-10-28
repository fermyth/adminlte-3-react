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
                '#A0A0A0', '#A0A0A0', '#A0A0A0', '#A0A0A0', '#A0A0A0', '#A0A0A0'
              ],
              borderColor: [
                '#A0A0A0', '#A0A0A0', '#A0A0A0', '#A0A0A0', '#A0A0A0', '#A0A0A0'
              ],
              borderWidth: 1,
              hoverBackgroundColor: '#ffffff',
              hoverBorderColor: '#333'
            }]
          },
          options: {
            plugins: {
              legend: {
                display: false,
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
