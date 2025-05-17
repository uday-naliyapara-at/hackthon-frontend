import React from 'react';
import { TimePeriod } from '@/domain/models/analytics/types';

interface PeriodSelectorProps {
  activePeriod: TimePeriod;
  onChange: (period: TimePeriod) => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({ 
  activePeriod, 
  onChange 
}) => {
  const periods: { value: TimePeriod; label: string }[] = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'all_time', label: 'All Time' }
  ];

  return (
    <div className="flex space-x-2 mb-6">
      {periods.map((period) => (
        <button
          key={period.value}
          className={`px-4 py-2 rounded ${
            activePeriod === period.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => onChange(period.value)}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}; 