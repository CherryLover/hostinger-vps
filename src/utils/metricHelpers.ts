import { MetricsData, MetricType, FormattedMetricData, TimeRange } from '../types';
import { formatMetricData } from './formatters';

export const getMetricTitle = (metricType: MetricType): string => {
  const titles: Record<MetricType, string> = {
    cpu_usage: 'CPU Usage',
    ram_usage: 'Memory Usage',
    disk_space: 'Disk Usage',
    outgoing_traffic: 'Outgoing Traffic',
    incoming_traffic: 'Incoming Traffic',
    uptime: 'Uptime'
  };
  
  return titles[metricType];
};

export const getMetricColor = (metricType: MetricType): string => {
  const colors: Record<MetricType, string> = {
    cpu_usage: '#0071e3', // Primary blue
    ram_usage: '#34c759', // Success green
    disk_space: '#ff9500', // Warning orange
    outgoing_traffic: '#5856d6', // Purple
    incoming_traffic: '#af52de', // Violet
    uptime: '#64d2ff' // Light blue
  };
  
  return colors[metricType];
};

export const getMetricBackgroundColor = (metricType: MetricType): string => {
  const colors: Record<MetricType, string> = {
    cpu_usage: 'rgba(0, 113, 227, 0.1)',
    ram_usage: 'rgba(52, 199, 89, 0.1)',
    disk_space: 'rgba(255, 149, 0, 0.1)',
    outgoing_traffic: 'rgba(88, 86, 214, 0.1)',
    incoming_traffic: 'rgba(175, 82, 222, 0.1)',
    uptime: 'rgba(100, 210, 255, 0.1)'
  };
  
  return colors[metricType];
};

export const getMetricIcon = (metricType: MetricType): string => {
  const icons: Record<MetricType, string> = {
    cpu_usage: 'cpu',
    ram_usage: 'memory-stick',
    disk_space: 'hard-drive',
    outgoing_traffic: 'arrow-up-right',
    incoming_traffic: 'arrow-down-left',
    uptime: 'timer'
  };
  
  return icons[metricType];
};

export const getMetricData = (
  metricsData: MetricsData,
  metricType: MetricType,
  timeRange: TimeRange
): FormattedMetricData => {
  const metricData = metricsData[metricType];
  const formattedData = formatMetricData(metricData);
  
  // Filter data points based on time range
  const now = Date.now() / 1000;
  let cutoffTime: number;
  
  switch (timeRange) {
    case '1h':
      cutoffTime = now - 60 * 60;
      break;
    case '6h':
      cutoffTime = now - 6 * 60 * 60;
      break;
    case '24h':
      cutoffTime = now - 24 * 60 * 60;
      break;
    case '7d':
      cutoffTime = now - 7 * 24 * 60 * 60;
      break;
    case '30d':
      cutoffTime = now - 30 * 24 * 60 * 60;
      break;
    default:
      cutoffTime = now - 24 * 60 * 60; // Default to 24h
  }
  
  const filteredIndices = formattedData.timestamps
    .map((timestamp, index) => timestamp >= cutoffTime ? index : -1)
    .filter(index => index !== -1);
  
  return {
    labels: filteredIndices.map(i => formattedData.labels[i]),
    values: filteredIndices.map(i => formattedData.values[i]),
    timestamps: filteredIndices.map(i => formattedData.timestamps[i])
  };
};

export const getCurrentMetricValue = (
  metricsData: MetricsData,
  metricType: MetricType
): number => {
  const metricData = metricsData[metricType];
  const timestamps = Object.keys(metricData.usage)
    .map(Number)
    .sort((a, b) => b - a); // Sort in descending order to get the most recent
  
  if (timestamps.length === 0) return 0;
  
  return metricData.usage[timestamps[0].toString()];
};

export const getMetricPercentage = (
  metricsData: MetricsData,
  metricType: MetricType,
  total: number
): number => {
  const currentValue = getCurrentMetricValue(metricsData, metricType);
  
  if (metricType === 'cpu_usage') {
    return currentValue; // Already a percentage
  }
  
  return (currentValue / total) * 100;
};