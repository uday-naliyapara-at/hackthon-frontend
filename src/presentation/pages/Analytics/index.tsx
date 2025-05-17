import React from 'react';
import { useAnalyticsService } from '@/application/features/analytics/useAnalyticsService';
import { PeriodSelector } from '@/presentation/features/analytics/components/PeriodSelector';
import { TopTeamsChart } from '@/presentation/features/analytics/components/TopTeamsChart';
import { TopCategoriesChart } from '@/presentation/features/analytics/components/TopCategoriesChart';
import { AnalyticsCard } from '@/presentation/features/analytics/components/AnalyticsCard';
import { HiChartPie, HiUserGroup, HiStar } from 'react-icons/hi';

export const AnalyticsPage: React.FC = () => {
  const { loading, error, data, timePeriod, changeTimePeriod } = useAnalyticsService();

  const getTotalKudos = () => {
    if (!data?.topCategories) return 0;
    return data.topCategories.reduce((total, category) => total + category.kudosCount, 0);
  };

  const getTotalTeams = () => {
    if (!data?.topTeams) return 0;
    return data.topTeams.length;
  };

  const getTopCategory = () => {
    if (!data?.topCategories || data.topCategories.length === 0) return { name: 'N/A', kudosCount: 0 };
    return data.topCategories[0];
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
      </div>

      <PeriodSelector activePeriod={timePeriod} onChange={changeTimePeriod} />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <AnalyticsCard
              title="Total Kudos"
              value={getTotalKudos()}
              icon={<HiChartPie className="text-blue-500" />}
              description={`For ${timePeriod} period`}
              color="blue"
            />
            <AnalyticsCard
              title="Total Teams"
              value={getTotalTeams()}
              icon={<HiUserGroup className="text-green-500" />}
              description="Teams receiving kudos"
              color="green"
            />
            <AnalyticsCard
              title="Total Categories"
              value={getTopCategory().kudosCount}
              icon={<HiStar className="text-yellow-500" />}
              description={getTopCategory().name}
              color="yellow"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.topTeams && (
              <TopTeamsChart teams={data.topTeams} />
            )}
            {data?.topCategories && (
              <TopCategoriesChart categories={data.topCategories} />
            )}
          </div>
        </>
      )}
    </div>
  );
}; 