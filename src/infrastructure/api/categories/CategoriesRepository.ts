import { BaseRepository } from '../BaseRepository';
import { IHttpClient } from '../../utils/http/types';
import { Category } from '../mock/data/categories.data';

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export class CategoriesRepository extends BaseRepository {
  private readonly baseUrl = '/categories';

  constructor(httpClient: IHttpClient) {
    super(httpClient);
  }

  async getCategories(): Promise<Category[]> {
    try {
      const response = await this.httpClient.get<CategoriesResponse>(this.baseUrl);
      
      if (!response || !response.data) {
        throw new Error('Invalid response format from categories API');
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
} 