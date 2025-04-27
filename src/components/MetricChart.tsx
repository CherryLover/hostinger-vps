import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { 
  getMetricData, 
  getMetricTitle, 
  getMetricColor, 
  getMetricBackgroundColor 
} from '../utils/metricHelpers';
import { MetricsData, MetricType, TimeRange } from '../types';
import { formatBytes, formatPercentage, formatUptime } from '../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MetricChartProps {
  metricType: MetricType;
  metricsData: MetricsData;
  timeRange: TimeRange;
}

const MetricChart: React.FC<MetricChartProps> = ({
  metricType,
  metricsData,
  timeRange
}) => {
  const title = getMetricTitle(metricType);
  const color = getMetricColor(metricType);
  const backgroundColor = getMetricBackgroundColor(metricType);
  const formattedData = getMetricData(metricsData, metricType, timeRange);
  
  const formatTooltipValue = (value: number): string => {
    switch (metricType) {
      case 'cpu_usage':
        return formatPercentage(value);
      case 'ram_usage':
      case 'disk_space':
      case 'outgoing_traffic':
      case 'incoming_traffic':
        return formatBytes(value);
      case 'uptime':
        return formatUptime(value);
      default:
        return value.toString();
    }
  };
  
  const chartData = {
    labels: formattedData.labels,
    datasets: [
      {
        label: title,
        data: formattedData.values,
        borderColor: color,
        backgroundColor: backgroundColor,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHitRadius: 10,
        borderWidth: 2,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `${title}: ${formatTooltipValue(value)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 5,
          maxRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: (value: number) => {
            switch (metricType) {
              case 'cpu_usage':
                return `${value}%`;
              case 'ram_usage':
              case 'disk_space':
              case 'outgoing_traffic':
              case 'incoming_traffic':
                return formatBytes(value, 0);
              case 'uptime':
                return formatUptime(value);
              default:
                return value;
            }
          },
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };
  
  return (
    <div className="h-full w-full">
      <Line data={chartData} options={chartOptions as any} />
    </div>
  );
};

export default MetricChart;