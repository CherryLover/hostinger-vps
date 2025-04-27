import React from 'react';
import { getCurrentMetricValue, getMetricTitle, getMetricColor } from '../utils/metricHelpers';
import { MetricsData, MetricType } from '../types';
import { formatBytes, formatPercentage, formatUptime } from '../utils/formatters';
import * as LucideIcons from 'lucide-react';

interface MetricCardProps {
  metricType: MetricType;
  metricsData: MetricsData;
  serverInfo?: { total: number };
  onClick: () => void;
  isActive: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  metricType,
  metricsData,
  serverInfo,
  onClick,
  isActive
}) => {
  const currentValue = getCurrentMetricValue(metricsData, metricType);
  const title = getMetricTitle(metricType);
  const color = getMetricColor(metricType);
  
  const getIconComponent = () => {
    switch (metricType) {
      case 'cpu_usage':
        return LucideIcons.Cpu;
      case 'ram_usage':
        return LucideIcons.MemoryStick;
      case 'disk_space':
        return LucideIcons.HardDrive;
      case 'outgoing_traffic':
        return LucideIcons.ArrowUpRight;
      case 'incoming_traffic':
        return LucideIcons.ArrowDownLeft;
      case 'uptime':
        return LucideIcons.Timer;
      default:
        return LucideIcons.Activity;
    }
  };
  
  const IconComponent = getIconComponent();
  
  const formatValue = () => {
    switch (metricType) {
      case 'cpu_usage':
        return formatPercentage(currentValue);
      case 'ram_usage':
      case 'disk_space':
      case 'outgoing_traffic':
      case 'incoming_traffic':
        return formatBytes(currentValue);
      case 'uptime':
        return formatUptime(currentValue);
      default:
        return currentValue.toString();
    }
  };
  
  const getUsagePercentage = () => {
    if (!serverInfo) return null;
    
    switch (metricType) {
      case 'cpu_usage':
        return currentValue;
      case 'ram_usage':
        return (currentValue / (serverInfo.total * 1024 * 1024)) * 100;
      case 'disk_space':
        return (currentValue / (serverInfo.total * 1024 * 1024)) * 100;
      default:
        return null;
    }
  };
  
  const usagePercentage = getUsagePercentage();
  
  return (
    <div 
      className={`rounded-lg p-4 transition-all duration-200 cursor-pointer ${
        isActive 
          ? 'bg-white shadow-lg border-2 border-primary-500' 
          : 'bg-white/80 shadow hover:shadow-md border border-neutral-200'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div 
            className="p-2 rounded-md mr-3"
            style={{ backgroundColor: `${color}15` }}
          >
            <IconComponent size={18} color={color} />
          </div>
          <h3 className="font-medium text-neutral-700">{title}</h3>
        </div>
      </div>
      
      <div className="mt-3">
        <p className="text-2xl font-semibold text-neutral-900 font-mono">
          {formatValue()}
        </p>
        
        {usagePercentage !== null && (
          <div className="mt-2">
            <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 ease-in-out"
                style={{ 
                  width: `${Math.min(100, usagePercentage)}%`,
                  backgroundColor: color
                }}
              />
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              {usagePercentage.toFixed(1)}% used
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;