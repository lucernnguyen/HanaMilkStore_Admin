import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
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

import './RevenueChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueChartProps {
  data: any;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const [timeFrame, setTimeFrame] = useState('day');
  const [chartData, setChartData] = useState(data);

  useEffect(() => {
    const groupedData = groupDataByTimeFrame(data, timeFrame);
    setChartData(groupedData);
  }, [data, timeFrame]);

  const groupDataByTimeFrame = (data: any, timeFrame: string) => {
    // Implement logic to group data by day, week, or month
    const labels = data.labels;
    const dataset = data.datasets[0].data;

    const groupedLabels: string[] = [];
    const groupedDataset: number[] = [];

    let currentLabel = '';
    let currentSum = 0;
    let count = 0;

    for (let i = 0; i < labels.length; i++) {
      const date = new Date(labels[i]);

      if (timeFrame === 'day') {
        currentLabel = date.toLocaleDateString();
      } else if (timeFrame === 'week') {
        const startOfWeek = date.getDate() - date.getDay();
        const startOfWeekDate = new Date(date.setDate(startOfWeek)).toLocaleDateString();
        currentLabel = startOfWeekDate;
      } else if (timeFrame === 'month') {
        currentLabel = `${date.getFullYear()}-${date.getMonth() + 1}`;
      }

      if (groupedLabels.length === 0 || groupedLabels[groupedLabels.length - 1] !== currentLabel) {
        if (count > 0) {
          groupedDataset.push(currentSum);
        }
        groupedLabels.push(currentLabel);
        currentSum = dataset[i];
        count = 1;
      } else {
        currentSum += dataset[i];
        count++;
      }
    }

    if (count > 0) {
      groupedDataset.push(currentSum);
    }

    return {
      labels: groupedLabels,
      datasets: [
        {
          ...data.datasets[0],
          data: groupedDataset,
        },
      ],
    };
  };

  const handleTimeFrameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeFrame(event.target.value);
  };

  return (
    <div className="revenue-chart-container">
      <div className="revenue-chart-header">
        <h2>Doanh thu</h2>
        <select value={timeFrame} onChange={handleTimeFrameChange}>
          <option value="day">Ngày</option>
          <option value="week">Tuần</option>
          <option value="month">Tháng</option>
        </select>
      </div>
      <Line data={chartData} />
    </div>
  );
};

export default RevenueChart;
