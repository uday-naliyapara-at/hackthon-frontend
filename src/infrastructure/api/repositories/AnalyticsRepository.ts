import { IAnalyticsRepository } from "@/domain/interfaces/analytics/IAnalyticsRepository";
import { AnalyticsResponse, TimePeriod } from "@/domain/models/analytics/types";
import { MOCK_ANALYTICS } from "@/infrastructure/api/mock/data/analytics.data";
import { BaseRepository } from "@/infrastructure/api/BaseRepository";
import axios from "axios";

export class AnalyticsRepository
  extends BaseRepository
  implements IAnalyticsRepository
{
  private baseUrl = `${process.env.REACT_APP_API_BASE_URI || ""}/analytics`;

  /**
   * Get analytics data
   * @param timePeriod - Time period for which to fetch data
   */
  async getAnalytics(timePeriod: TimePeriod): Promise<AnalyticsResponse> {
    try {
      // In development mode, use mock data if API is not available
      if (
        process.env.NODE_ENV === "development" &&
        !process.env.REACT_APP_API_BASE_URI
      ) {
        console.log("Using mock data for analytics");
        return MOCK_ANALYTICS[timePeriod];
      }

      // Make the API call
      const response = await axios.get<AnalyticsResponse>(
        `${this.baseUrl}?period=${timePeriod}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching analytics data:", error);

      // Fallback to mock data if API call fails
      if (MOCK_ANALYTICS[timePeriod]) {
        console.log("Falling back to mock data");
        return MOCK_ANALYTICS[timePeriod];
      }

      // Handle error
      throw this.handleError(error);
    }
  }
}
