import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TeamStats } from '@/domain/models/analytics/types';

interface TopTeamsChartProps {
  teams: TeamStats[];
}

export const TopTeamsChart: React.FC<TopTeamsChartProps> = ({ teams }) => {
  const colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Top Recognised Teams</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={teams}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} kudos`, 'Count']}
              labelFormatter={(name) => `Team: ${name}`}
            />
            <Bar dataKey="kudosCount" fill="#8884d8" name="Kudos Count">
              {teams.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 