import { BaseRepository } from '../BaseRepository';
import { IHttpClient } from '../../utils/http/types';
import { Kudos, KudosType } from '@/domain/models/kudos/types';
import { createHttpClient } from '../../utils/http/httpClientFactory';

interface ApiKudo {
  id: number;
  recipientId: number;
  teamId: number;
  categoryId: number;
  categoryName: string;
  teamName: string;
  message: string;
  createdAt: string | null;
  updatedAt: string | null;
  recipientName: string;
  createdByName?: string; 
}

interface ApiResponse {
  success: boolean;
  data: {
    kudos: ApiKudo[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

type KudosParams = {
  teamId?: number;
  sortOrder?: 'asc' | 'desc';
}

export class KudosRepository extends BaseRepository {
  private readonly baseUrl = '/kudos';

  constructor(httpClient: IHttpClient) {
    super(httpClient);
  }

  private mapResponseToDomain(kudo: ApiKudo): Kudos {
    return {
      id: kudo.id.toString(),
      type: kudo.categoryName,
      recipient: {
        id: kudo.recipientId,
        name: kudo.recipientName,
        team: kudo.teamName,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(kudo.recipientName)}`
      },
      message: kudo.message,
      sender: {
        id: 0,
        name: kudo.createdByName || 'Anonymous',
        team: kudo.teamName,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(kudo.createdByName || 'Anonymous')}`
      },
      createdAt: kudo.createdAt ? new Date(kudo.createdAt) : new Date()
    };
  }

  /**
   * Builds URL with query parameters
   * @param endpoint Base endpoint
   * @param params Query parameters
   * @returns URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) {
      return endpoint;
    }

    const queryParams = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null && value !== 0)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    return `${endpoint}${queryParams ? `?${queryParams}` : ''}`;
  }

  /**
   * Fetches all kudos from the API
   * @param params Optional parameters for filtering
   * @throws {ApiError} When the API request fails
   */
  async getAllKudos(params?: KudosParams): Promise<Kudos[]> {
    try {
      const url = this.buildUrl(this.baseUrl, params);
      const response = await this.httpClient.get<ApiResponse>(url);
      if (!response.success || !response.data?.kudos) {
        throw new Error('Invalid API response structure');
      }
      return response.data.kudos.map(kudo => this.mapResponseToDomain(kudo));
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Search kudos by query string
   * @param query The search query string
   * @param params Optional parameters for filtering
   * @throws {ApiError} When the API request fails
   */
  async searchKudos(query: string, params?: KudosParams): Promise<Kudos[]> {
    try {
      const searchParams = {
        query,
        ...(params || {})
      };
      const url = this.buildUrl(`${this.baseUrl}/search`, searchParams);
      const response = await this.httpClient.get<ApiResponse>(url);
      if (!response.success || !response.data?.kudos) {
        throw new Error('Invalid API response structure');
      }
      return response.data.kudos.map(kudo => this.mapResponseToDomain(kudo));
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
}

// Create singleton instance
export const kudosRepository = new KudosRepository(
  createHttpClient(() => Promise.resolve('')) // Passing empty refresh token function for now
); 