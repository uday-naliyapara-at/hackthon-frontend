import { Team, TeamResponse } from '../../models/team/types';

/**
 * Repository interface for team-related operations
 * Handles data access for team entities
 * @interface ITeamRepository
 */
export interface ITeamRepository {
  /**
   * Retrieves all available teams
   * @returns Promise<TeamResponse> A promise that resolves to an array of teams
   * @throws {NetworkError} When the server is unreachable
   * @throws {UnauthorizedError} When the user is not authenticated
   */
  getTeams(): Promise<TeamResponse>;
} 