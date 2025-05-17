import { useState, useEffect } from "react";
import {
  AnalyticsResponse,
  TimePeriod,
} from "../../../domain/models/analytics/types";
import { analyticsRepository } from "../../../infrastructure/repositories/analytics/AnalyticsRepository";

/**
 * Hook for managing analytics data and operations
 */
export const useAnalyticsService = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("all_time");

  // Fetch analytics data based on selected period
  const fetchAnalytics = async (period: TimePeriod) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await analyticsRepository.getAnalytics(period);
      setAnalytics(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch analytics")
      );
      console.error("Error in analytics service:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Change the selected time period
  const changePeriod = (period: TimePeriod) => {
    setSelectedPeriod(period);
  };

  // Fetch data when period changes
  useEffect(() => {
    fetchAnalytics(selectedPeriod);
  }, [selectedPeriod]);

  return {
    isLoading,
    error,
    analytics,
    selectedPeriod,
    changePeriod,
  };
};
