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

export type TimePeriod =
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "all_time";

export interface AnalyticsStats {
  totalKudos: number;
  totalTeams: number;
  totalCategories: number;
}

export interface AnalyticsData {
  topTeams: TeamStats[];
  topCategories: CategoryStats[];
  stats: AnalyticsStats;
  timePeriod: TimePeriod;
}

export interface AnalyticsResponse {
  success: boolean;
  message: string;
  data: AnalyticsData;
}
