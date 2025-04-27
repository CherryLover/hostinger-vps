import React from 'react';

interface StatusIndicatorProps {
  status: 'running' | 'stopped' | 'error' | 'warning';
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, className = '' }) => {
  const getStatusColor = (): string => {
    switch (status) {
      case 'running':
        return 'bg-success-500';
      case 'stopped':
        return 'bg-neutral-500';
      case 'error':
        return 'bg-danger-500';
      case 'warning':
        return 'bg-warning-500';
      default:
        return 'bg-neutral-500';
    }
  };

  const getStatusText = (): string => {
    switch (status) {
      case 'running':
        return 'Running';
      case 'stopped':
        return 'Stopped';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor()} animate-pulse-slow mr-2`}></div>
      <span className="text-sm font-medium">{getStatusText()}</span>
    </div>
  );
};

export default StatusIndicator;