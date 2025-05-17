import { NetworkError, UnauthorizedError } from '../../../application/features/auth/errors';
import { ITeamRepository } from '../../../domain/interfaces/team/ITeamRepository';
import { TeamResponse } from '../../../domain/models/team/types';
import { IHttpClient } from '../../utils/http/types';
import { BaseErrorResponse, BaseRepository, HttpStatusCode } from '../BaseRepository';

/**
 * Repository implementation for team-related operations
 * Follows infrastructure layer patterns by extending BaseRepository
 */
export class TeamRepository extends BaseRepository implements ITeamRepository {
  private readonly baseUrl = '/teams';

  constructor(httpClient: IHttpClient) {
    super(httpClient);
  }

  protected override handleErrorResponse(errorData: BaseErrorResponse): Error {
    // Handle specific status codes
    if (errorData.status) {
      switch (errorData.status) {
        case HttpStatusCode.UNAUTHORIZED:
          return new UnauthorizedError(errorData.message || 'Unauthorized access');
        case HttpStatusCode.INTERNAL_SERVER_ERROR:
          return new NetworkError(errorData.message || 'An unexpected error occurred');
      }
    }

    // Fallback to base error handling
    return super.handleErrorResponse(errorData);
  }

  async getTeams(): Promise<TeamResponse> {
    try {
      const response = await this.httpClient.get<TeamResponse>(this.baseUrl);
      
      // Validate response structure
      if (!response || !response.data) {
        throw new NetworkError('Invalid response format from teams API');
      }

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }
} 