/**
 * Represents a team in the system
 * @interface Team
 */
export interface Team {
  /** Unique identifier for the team */
  id: number;
  /** Name of the team */
  name: string;
}

/**
 * Response type for team-related API endpoints
 * @interface TeamResponse
 */
export interface TeamResponse {
  success: boolean;
  message: string;
  data: Team[];
} 