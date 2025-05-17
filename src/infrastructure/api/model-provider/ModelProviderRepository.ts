import { NetworkError, UnauthorizedError } from '../../../application/features/auth/errors';
import {
  ApiKeyExpiredError,
  ApiKeyNotConfiguredError,
  InvalidApiKeyError,
  InvalidStatusError,
  ModelNotFoundError,
  ProviderNotFoundError,
} from '../../../application/features/model-provider/errors';
import { IModelProviderRepository } from '../../../domain/interfaces/model-provider/IModelProviderRepository';
import {
  EnabledModelsResponse,
  ModelProvider,
  ValidateKeyResponse,
} from '../../../domain/models/model-provider/types';
import { IHttpClient } from '../../utils/http/types';
import { BaseErrorResponse, BaseRepository, HttpStatusCode } from '../BaseRepository';

// Model Provider specific error codes
export enum ModelProviderErrorCode {
  PROVIDER_NOT_FOUND = 'PROVIDER_001',
  MODEL_NOT_FOUND = 'PROVIDER_002',
  INVALID_API_KEY = 'PROVIDER_003',
  INVALID_STATUS = 'PROVIDER_004',
  API_KEY_EXPIRED = 'PROVIDER_005',
  MODEL_OR_PROVIDER_NOT_FOUND = 'PROVIDER_006',
  API_KEY_NOT_CONFIGURED = 'PROVIDER_007',
  UNAUTHORIZED = 'COMMON_001',
}

export class ModelProviderRepository extends BaseRepository implements IModelProviderRepository {
  private readonly baseUrl = '/api/settings/model-providers';
  private readonly enabledModelsUrl = '/api/settings/enabled-models';

  constructor(httpClient: IHttpClient) {
    super(httpClient);
  }

  protected override handleErrorCode(code: string, message: string): Error | null {
    switch (code) {
      case ModelProviderErrorCode.PROVIDER_NOT_FOUND:
        return new ProviderNotFoundError(message);
      case ModelProviderErrorCode.MODEL_NOT_FOUND:
        return new ModelNotFoundError(message);
      case ModelProviderErrorCode.MODEL_OR_PROVIDER_NOT_FOUND:
        return new ModelNotFoundError(message);
      case ModelProviderErrorCode.INVALID_API_KEY:
        return new InvalidApiKeyError(message);
      case ModelProviderErrorCode.INVALID_STATUS:
        return new InvalidStatusError(message);
      case ModelProviderErrorCode.API_KEY_EXPIRED:
        return new ApiKeyExpiredError(message);
      case ModelProviderErrorCode.API_KEY_NOT_CONFIGURED:
        return new ApiKeyNotConfiguredError(message);
      case ModelProviderErrorCode.UNAUTHORIZED:
        return new UnauthorizedError(message);
      default:
        return null;
    }
  }

  protected override handleErrorResponse(errorData: BaseErrorResponse): Error {
    // First try error codes
    if (errorData.code) {
      const error = this.handleErrorCode(errorData.code, errorData.message);
      if (error) return error;
    }

    // Then handle specific status codes
    if (errorData.status) {
      switch (errorData.status) {
        case HttpStatusCode.BAD_REQUEST:
          return new InvalidApiKeyError(errorData.message || 'Invalid request');
        case HttpStatusCode.UNAUTHORIZED:
          return new UnauthorizedError(errorData.message || 'Unauthorized access');
        case HttpStatusCode.INTERNAL_SERVER_ERROR:
          return new NetworkError(errorData.message || 'An unexpected error occurred');
      }
    }

    // Fallback to base error handling
    return super.handleErrorResponse(errorData);
  }

  async getProviders(): Promise<ModelProvider[]> {
    try {
      const response = await this.httpClient.get<ModelProvider[]>(this.baseUrl);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getEnabledModels(): Promise<EnabledModelsResponse> {
    try {
      const response = await this.httpClient.get<EnabledModelsResponse>(this.enabledModelsUrl);
      return response;
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        throw new UnauthorizedError('Unauthorized access');
      }
      throw this.handleError(error);
    }
  }

  async updateProviderKey(providerId: string, key: string): Promise<void> {
    try {
      await this.httpClient.put<void>(`${this.baseUrl}/${providerId}/key`, { key });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateModelStatus(providerId: string, modelId: string, isEnabled: boolean): Promise<void> {
    try {
      await this.httpClient.put<void>(`${this.baseUrl}/${providerId}/models/${modelId}/status`, {
        isEnabled,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async validateKey(providerId: string, key: string): Promise<ValidateKeyResponse> {
    try {
      const response = await this.httpClient.post<ValidateKeyResponse>(
        `${this.baseUrl}/${providerId}/validate-key`,
        { key }
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}
