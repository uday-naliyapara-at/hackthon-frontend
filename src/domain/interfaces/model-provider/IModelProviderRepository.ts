import {
  EnabledModelsResponse,
  ModelProvider,
  ValidateKeyResponse,
} from '../../models/model-provider/types';

export interface IModelProviderRepository {
  /**
   * Get all model providers
   * @throws {UnauthorizedError} When authentication is invalid
   */
  getProviders(): Promise<ModelProvider[]>;

  /**
   * Get all enabled models across providers
   * @throws {UnauthorizedError} When authentication is invalid
   * @returns List of enabled models regardless of provider status
   */
  getEnabledModels(): Promise<EnabledModelsResponse>;

  /**
   * Update provider API key
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {NotFoundError} When provider is not found
   * @throws {ValidationError} When API key is invalid
   */
  updateProviderKey(providerId: string, key: string): Promise<void>;

  /**
   * Update model enabled status
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {NotFoundError} When provider or model is not found
   * @throws {ValidationError} When provider has no API key configured
   */
  updateModelStatus(providerId: string, modelId: string, isEnabled: boolean): Promise<void>;

  /**
   * Validate provider API key
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {NotFoundError} When provider is not found
   * @throws {ValidationError} When API key is invalid
   */
  validateKey(providerId: string, key: string): Promise<ValidateKeyResponse>;
}
