import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

interface Customer {
  name: string;
  vehicles: number;
}

interface ChartComponentProps {
  customers: Customer[];
}

const ChartComponent = ({ customers }: ChartComponentProps) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  const totalVehicles = customers.reduce(
    (total, customer) => total + customer.vehicles,
    0
  );

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        const chart = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: customers.map((customer) => customer.name),
            datasets: [
              {
                data: customers.map(
                  (customer) => (customer.vehicles / totalVehicles) * 100
                ),
                backgroundColor: [
                  "rgba(54, 162, 235, 0.8)",
                  "rgba(255, 99, 132, 0.8)",
                  "rgba(255, 159, 64, 0.8)",
                  "rgba(75, 192, 192, 0.8)",
                  "rgba(153, 102, 255, 0.8)",
                ],
                hoverOffset: 4,
                borderWidth: 1,
              },
            ],
          },
          options: {
            plugins: {
              tooltip: {
                callbacks: {
                  label: (tooltipItem: any) => {
                    if (tooltipItem.dataset) {
                      const label =
                        tooltipItem.dataset.labels[tooltipItem.dataIndex];
                      const value =
                        tooltipItem.dataset.data[tooltipItem.dataIndex];
                      return `${label}: ${value.toFixed(2)}%`;
                    }
                    return "";
                  },
                },
              },
              legend: {
                position: "right",
              },
            },
            responsive: true,
            maintainAspectRatio: false,
          },
        });

        return () => chart.destroy();
      }
    }
  }, [customers, totalVehicles]);

  return (
    <div className="container">
      <div
        className="chart-container"
        style={{ position: "relative", height: "400px", width: "400px" }}
      >
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default ChartComponent;
