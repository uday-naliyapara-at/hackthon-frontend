import { AnalyticsResponse, TimePeriod } from "@/domain/models/analytics/types";

export interface IAnalyticsRepository {
  /**
   * Get analytics data
   * @param timePeriod - Time period for which to fetch data
   */
  getAnalytics(timePeriod: TimePeriod): Promise<AnalyticsResponse>;
}
