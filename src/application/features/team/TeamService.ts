import { ITeamRepository } from '../../../domain/interfaces/team/ITeamRepository';
import { Team, TeamResponse } from '../../../domain/models/team/types';

/**
 * Service class for handling team-related business logic
 * Coordinates between domain and infrastructure layers
 */
export class TeamService {
  constructor(private readonly teamRepository: ITeamRepository) {}

  /**
   * Retrieves all available teams
   * @returns Promise<Team[]> A promise that resolves to an array of teams
   */
  async getTeams(): Promise<Team[]> {
    const response = await this.teamRepository.getTeams();
    return response.data;
  }
} 