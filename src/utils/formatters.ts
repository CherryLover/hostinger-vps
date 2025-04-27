import { format } from 'date-fns';
import { MetricItem, FormattedMetricData } from '../types';

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatUptime = (milliseconds: number): string => {
  const seconds = milliseconds / 1000;
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

export const formatTimestamp = (timestamp: number): string => {
  return format(new Date(timestamp * 1000), 'MMM d, HH:mm');
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat().format(value);
};

export const formatMetricData = (metricData: MetricItem): FormattedMetricData => {
  const timestamps = Object.keys(metricData.usage)
    .map(Number)
    .sort((a, b) => a - b);
  
  const labels = timestamps.map(t => formatTimestamp(t));
  const values = timestamps.map(t => metricData.usage[t.toString()]);
  
  return {
    labels,
    values,
    timestamps,
  };
};