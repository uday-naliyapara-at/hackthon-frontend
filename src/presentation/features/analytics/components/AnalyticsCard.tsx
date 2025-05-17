import React from 'react';

interface AnalyticsCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  description?: string;
  color?: string;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  icon,
  description,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    yellow: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        {icon && <div className="text-xl">{icon}</div>}
      </div>
      <div className="flex items-baseline">
        <p className="text-3xl font-semibold">{value}</p>
      </div>
      {description && (
        <div className={`mt-2 py-1 px-2 rounded-full text-xs font-medium ${colorClasses[color as keyof typeof colorClasses]}`}>
          {description}
        </div>
      )}
    </div>
  );
}; 