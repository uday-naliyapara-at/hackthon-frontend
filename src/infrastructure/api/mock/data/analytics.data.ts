import { AnalyticsResponse, TimePeriod } from "@/domain/models/analytics/types";

export const MOCK_ANALYTICS: Record<TimePeriod, AnalyticsResponse> = {
  weekly: {
    success: true,
    message: "Analytics data retrieved successfully",
    data: {
      topTeams: [
        {
          id: 7,
          name: "GOLF",
          kudosCount: 35,
        },
        {
          id: 6,
          name: "FOXTROT",
          kudosCount: 34,
        },
        {
          id: 1,
          name: "ALPHA",
          kudosCount: 33,
        },
      ],
      topCategories: [
        {
          id: 1,
          name: "Teamwork",
          kudosCount: 204,
        },
        {
          id: 2,
          name: "Innovation",
          kudosCount: 203,
        },
        {
          id: 3,
          name: "Helping Hand",
          kudosCount: 177,
        },
      ],
      timePeriod: "weekly",
    },
  },
  monthly: {
    success: true,
    message: "Analytics data retrieved successfully",
    data: {
      topTeams: [
        {
          id: 1,
          name: "ALPHA",
          kudosCount: 120,
        },
        {
          id: 7,
          name: "GOLF",
          kudosCount: 98,
        },
        {
          id: 6,
          name: "FOXTROT",
          kudosCount: 92,
        },
      ],
      topCategories: [
        {
          id: 2,
          name: "Innovation",
          kudosCount: 450,
        },
        {
          id: 1,
          name: "Teamwork",
          kudosCount: 425,
        },
        {
          id: 3,
          name: "Helping Hand",
          kudosCount: 380,
        },
      ],
      timePeriod: "monthly",
    },
  },
  quarterly: {
    success: true,
    message: "Analytics data retrieved successfully",
    data: {
      topTeams: [
        {
          id: 1,
          name: "ALPHA",
          kudosCount: 320,
        },
        {
          id: 7,
          name: "GOLF",
          kudosCount: 280,
        },
        {
          id: 2,
          name: "BRAVO",
          kudosCount: 245,
        },
      ],
      topCategories: [
        {
          id: 1,
          name: "Teamwork",
          kudosCount: 950,
        },
        {
          id: 2,
          name: "Innovation",
          kudosCount: 920,
        },
        {
          id: 3,
          name: "Helping Hand",
          kudosCount: 750,
        },
      ],
      timePeriod: "quarterly",
    },
  },
  yearly: {
    success: true,
    message: "Analytics data retrieved successfully",
    data: {
      topTeams: [
        {
          id: 1,
          name: "ALPHA",
          kudosCount: 1200,
        },
        {
          id: 2,
          name: "BRAVO",
          kudosCount: 980,
        },
        {
          id: 7,
          name: "GOLF",
          kudosCount: 950,
        },
      ],
      topCategories: [
        {
          id: 1,
          name: "Teamwork",
          kudosCount: 3200,
        },
        {
          id: 2,
          name: "Innovation",
          kudosCount: 2800,
        },
        {
          id: 3,
          name: "Helping Hand",
          kudosCount: 2400,
        },
      ],
      timePeriod: "yearly",
    },
  },
};
