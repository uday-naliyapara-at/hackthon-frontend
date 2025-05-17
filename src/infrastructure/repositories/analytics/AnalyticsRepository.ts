import {
  AnalyticsResponse,
  TimePeriod,
} from "../../../domain/models/analytics/types";
import { BaseRepository } from "../../api/BaseRepository";
import { MOCK_ANALYTICS } from "../../api/mock/data/analytics.data";
import { IHttpClient } from "../../utils/http/types";
import { createHttpClient } from "../../utils/http/httpClientFactory";

// Create a dummy refresh token function for use with the HTTP client
const dummyRefreshToken = async () => {
  console.warn("Analytics repository token refresh not implemented");
  return "";
};

// Create an HTTP client using the factory
const httpClient = createHttpClient(dummyRefreshToken);

export class AnalyticsRepository extends BaseRepository {
  constructor(httpClient: IHttpClient) {
    super(httpClient);
  }

  /**
   * Fetch analytics data for a specific time period
   * Falls back to mock data if API call fails
   */
  async getAnalytics(period: TimePeriod): Promise<AnalyticsResponse> {
    try {
      const response = await this.httpClient.get<AnalyticsResponse>(
        `/analytics?period=${period}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      this.handleError(error);

      // Fallback to mock data if API call fails
      console.warn("Falling back to mock analytics data");
      return MOCK_ANALYTICS[period];
    }
  }
}

// Export a singleton instance to be used across the application
export const analyticsRepository = new AnalyticsRepository(httpClient);
