export interface TeamStats {
  id: number;
  name: string;
  kudosCount: number;
}

export interface CategoryStats {
  id: number;
  name: string;
  kudosCount: number;
}

export type TimePeriod = "weekly" | "monthly" | "quarterly" | "yearly";

export interface AnalyticsData {
  topTeams: TeamStats[];
  topCategories: CategoryStats[];
  timePeriod: TimePeriod;
}

export interface AnalyticsResponse {
  success: boolean;
  message: string;
  data: AnalyticsData;
}
