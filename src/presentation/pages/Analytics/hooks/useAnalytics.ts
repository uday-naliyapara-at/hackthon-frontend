import { useState, useEffect } from "react";
import {
  AnalyticsData,
  CategoryStats,
  TeamStats,
  TimePeriod,
} from "@/domain/models/analytics/types";
import { useAnalyticsService } from "@/application/features/analytics/useAnalyticsService";

export const useAnalytics = () => {
  const { loading, error, data, timePeriod, changeTimePeriod } =
    useAnalyticsService();
  const [topTeams, setTopTeams] = useState<TeamStats[]>([]);
  const [topCategories, setTopCategories] = useState<CategoryStats[]>([]);
  const [totalKudos, setTotalKudos] = useState<number>(0);

  useEffect(() => {
    if (data) {
      setTopTeams(data.topTeams || []);
      setTopCategories(data.topCategories || []);

      // Calculate total kudos
      const total =
        data.topCategories?.reduce(
          (sum, category) => sum + category.kudosCount,
          0
        ) || 0;

      setTotalKudos(total);
    }
  }, [data]);

  return {
    loading,
    error,
    data,
    timePeriod,
    changeTimePeriod,
    topTeams,
    topCategories,
    totalKudos,
  };
};
