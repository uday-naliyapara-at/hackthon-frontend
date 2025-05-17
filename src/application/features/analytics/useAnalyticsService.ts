import { useState, useEffect } from "react";
import { AnalyticsData, TimePeriod } from "@/domain/models/analytics/types";
import { AnalyticsRepository } from "@/infrastructure/api/repositories/AnalyticsRepository";

export const useAnalyticsService = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("weekly");

  const analyticsRepository = new AnalyticsRepository();

  const fetchAnalytics = async (period: TimePeriod) => {
    try {
      setLoading(true);
      setError(null);

      const response = await analyticsRepository.getAnalytics(period);

      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("Failed to fetch analytics data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const changeTimePeriod = (period: TimePeriod) => {
    setTimePeriod(period);
  };

  useEffect(() => {
    fetchAnalytics(timePeriod);
  }, [timePeriod]);

  return {
    loading,
    error,
    data,
    timePeriod,
    changeTimePeriod,
  };
};
