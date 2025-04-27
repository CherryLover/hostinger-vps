import React from 'react';
import { TimeRange } from '../types';

interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onChange: (range: TimeRange) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedRange,
  onChange
}) => {
  const ranges: TimeRange[] = ['1h', '6h', '24h', '7d', '30d'];
  
  const getRangeLabel = (range: TimeRange): string => {
    switch (range) {
      case '1h':
        return '1 Hour';
      case '6h':
        return '6 Hours';
      case '24h':
        return '24 Hours';
      case '7d':
        return '7 Days';
      case '30d':
        return '30 Days';
      default:
        return range;
    }
  };
  
  return (
    <div className="flex space-x-2 h-9">
      {ranges.map((range) => (
        <button
          key={range}
          className={`px-3 py-1.5 text-sm rounded-md transition-all ${
            selectedRange === range
              ? 'bg-primary-500 text-white shadow-sm'
              : 'bg-white text-neutral-600 hover:bg-neutral-100'
          }`}
          onClick={() => onChange(range)}
        >
          {getRangeLabel(range)}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;