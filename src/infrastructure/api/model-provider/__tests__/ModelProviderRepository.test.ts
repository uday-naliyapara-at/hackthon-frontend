/**
 * Tests for ModelProviderRepository which handles model provider API calls.
 * Verifies proper HTTP client usage, request/response handling, and error scenarios.
 */
import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NetworkError, UnauthorizedError } from '../../../../application/features/auth/errors';
import {
  ApiKeyExpiredError,
  ApiKeyNotConfiguredError,
  InvalidApiKeyError,
  ModelNotFoundError,
  ProviderNotFoundError,
} from '../../../../application/features/model-provider/errors';
import {
  KeyStatus,
  ModelProvider,
  ValidateKeyResponse,
} from '../../../../domain/models/model-provider/types';
import { FetchHttpClient } from '../../../utils/http/FetchHttpClient';
import { server } from '../../mock/server';
import { ModelProviderRepository } from '../ModelProviderRepository';

describe('Infrastructure > API > Model Provider > ModelProviderRepository', () => {
  let repository: ModelProviderRepository;
  let httpClient: FetchHttpClient;

  // Test Data Factories
  const createModelProvider = (overrides: Partial<ModelProvider> = {}): ModelProvider => ({
    id: 'provider-1',
    name: 'OpenAI',
    logo: 'openai-logo.png',
    keyStatus: KeyStatus.VALID,
    models: [
      {
        id: 'model-1',
        name: 'GPT-4',
        isEnabled: true,
        providerId: 'provider-1',
        capabilities: ['chat', 'completion'],
      },
    ],
    ...overrides,
  });

  const createValidateKeyResponse = (
    overrides: Partial<ValidateKeyResponse> = {}
  ): ValidateKeyResponse => ({
    status: KeyStatus.VALID,
    ...overrides,
  });

  const createModelConfig = (overrides = {}) => ({
    id: 'model-1',
    name: 'GPT-4',
    isEnabled: true,
    providerId: 'provider-1',
    capabilities: ['chat', 'completion'],
    ...overrides,
  });

  const createEnabledModelsResponse = (overrides = {}) => ({
    models: [createModelConfig()],
    ...overrides,
  });

  beforeEach(() => {
    server.listen({ onUnhandledRequest: 'error' });
    httpClient = new FetchHttpClient('', async () => 'mock-token');
    repository = new ModelProviderRepository(httpClient);
  });

  afterEach(() => {
    server.resetHandlers();
    server.close();
  });

  /**
   * Tests proper HTTP client initialization and method calls
   */
  describe('HTTP Client Integration', () => {
    it('should properly initialize and use HTTP client', async () => {
      const mockHttpClient = {
        get: vi.fn().mockResolvedValue([]),
        put: vi.fn().mockResolvedValue({}),
        post: vi.fn().mockResolvedValue({}),
        delete: vi.fn().mockResolvedValue({}),
        patch: vi.fn().mockResolvedValue({}),
        postStream: vi.fn().mockResolvedValue({}),
        putStream: vi.fn().mockResolvedValue({}),
      };

      const testRepo = new ModelProviderRepository(mockHttpClient);
      await testRepo.getProviders();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/settings/model-providers');
    });
  });

  /**
   * Tests getProviders endpoint functionality
   */
  describe('Get Providers Endpoint', () => {
    it('should successfully fetch providers', async () => {
      const mockProviders = [createModelProvider()];

      server.use(
        http.get('/api/settings/model-providers', () => {
          return HttpResponse.json(mockProviders);
        })
      );

      const result = await repository.getProviders();
      expect(result).toEqual(mockProviders);
    });

    it('should handle unauthorized access', async () => {
      server.use(
        http.get('/api/settings/model-providers', () => {
          return new Response('status 401: Unauthorized access', { status: 401 });
        })
      );

      await expect(repository.getProviders()).rejects.toThrow(UnauthorizedError);
    });

    it('should handle network errors', async () => {
      server.use(
        http.get('/api/settings/model-providers', () => {
          return HttpResponse.error();
        })
      );

      await expect(repository.getProviders()).rejects.toThrow(NetworkError);
    });
  });

  /**
   * Tests updateProviderKey endpoint functionality
   */
  describe('Update Provider Key Endpoint', () => {
    const providerId = 'provider-1';
    const apiKey = 'test-api-key';

    it('should successfully update provider key', async () => {
      server.use(
        http.put(`/api/settings/model-providers/${providerId}/key`, () => {
          return HttpResponse.json({ success: true });
        })
      );

      await expect(repository.updateProviderKey(providerId, apiKey)).resolves.not.toThrow();
    });

    it('should handle invalid API key', async () => {
      server.use(
        http.put(`/api/settings/model-providers/${providerId}/key`, () => {
          return HttpResponse.json(
            { code: 'PROVIDER_003', message: 'Invalid API key' },
            { status: 400 }
          );
        })
      );

      await expect(repository.updateProviderKey(providerId, apiKey)).rejects.toThrow(
        InvalidApiKeyError
      );
    });

    it('should handle provider not found', async () => {
      server.use(
        http.put(`/api/settings/model-providers/${providerId}/key`, () => {
          return HttpResponse.json(
            { code: 'PROVIDER_001', message: 'Provider not found' },
            { status: 404 }
          );
        })
      );

      await expect(repository.updateProviderKey(providerId, apiKey)).rejects.toThrow(
        ProviderNotFoundError
      );
    });

    it('should handle expired API key', async () => {
      server.use(
        http.put(`/api/settings/model-providers/${providerId}/key`, () => {
          return HttpResponse.json(
            { code: 'PROVIDER_005', message: 'API key expired' },
            { status: 400 }
          );
        })
      );

      await expect(repository.updateProviderKey(providerId, apiKey)).rejects.toThrow(
        ApiKeyExpiredError
      );
    });
  });

  /**
   * Tests updateModelStatus endpoint functionality
   */
  describe('Update Model Status Endpoint', () => {
    const providerId = 'provider-1';
    const modelId = 'model-1';

    it('should successfully update model status', async () => {
      server.use(
        http.put(`/api/settings/model-providers/${providerId}/models/${modelId}/status`, () => {
          return HttpResponse.json({ success: true });
        })
      );

      await expect(repository.updateModelStatus(providerId, modelId, true)).resolves.not.toThrow();
    });

    it('should handle model not found', async () => {
      server.use(
        http.put(`/api/settings/model-providers/${providerId}/models/${modelId}/status`, () => {
          return HttpResponse.json(
            { code: 'PROVIDER_002', message: 'Model not found' },
            { status: 404 }
          );
        })
      );

      await expect(repository.updateModelStatus(providerId, modelId, true)).rejects.toThrow(
        ModelNotFoundError
      );
    });

    it('should handle provider not found', async () => {
      server.use(
        http.put(`/api/settings/model-providers/${providerId}/models/${modelId}/status`, () => {
          return HttpResponse.json(
            { code: 'PROVIDER_001', message: 'Provider not found' },
            { status: 404 }
          );
        })
      );

      await expect(repository.updateModelStatus(providerId, modelId, true)).rejects.toThrow(
        ProviderNotFoundError
      );
    });
  });

  /**
   * Tests validateKey endpoint functionality
   */
  describe('Validate Key Endpoint', () => {
    const providerId = 'provider-1';
    const apiKey = 'test-api-key';

    it('should successfully validate API key', async () => {
      const mockResponse = createValidateKeyResponse();

      server.use(
        http.post(`/api/settings/model-providers/${providerId}/validate-key`, () => {
          return HttpResponse.json(mockResponse);
        })
      );

      const result = await repository.validateKey(providerId, apiKey);
      expect(result).toEqual(mockResponse);
    });

    it('should handle invalid API key', async () => {
      server.use(
        http.post(`/api/settings/model-providers/${providerId}/validate-key`, () => {
          return HttpResponse.json(
            { code: 'PROVIDER_003', message: 'Invalid API key' },
            { status: 400 }
          );
        })
      );

      await expect(repository.validateKey(providerId, apiKey)).rejects.toThrow(InvalidApiKeyError);
    });

    it('should handle API key not configured', async () => {
      server.use(
        http.post(`/api/settings/model-providers/${providerId}/validate-key`, () => {
          return HttpResponse.json(
            { code: 'PROVIDER_007', message: 'API key not configured' },
            { status: 400 }
          );
        })
      );

      await expect(repository.validateKey(providerId, apiKey)).rejects.toThrow(
        ApiKeyNotConfiguredError
      );
    });

    it('should handle provider not found', async () => {
      server.use(
        http.post(`/api/settings/model-providers/${providerId}/validate-key`, () => {
          return HttpResponse.json(
            { code: 'PROVIDER_001', message: 'Provider not found' },
            { status: 404 }
          );
        })
      );

      await expect(repository.validateKey(providerId, apiKey)).rejects.toThrow(
        ProviderNotFoundError
      );
    });
  });

  /**
   * Tests getEnabledModels endpoint functionality
   */
  describe('Get Enabled Models Endpoint', () => {
    it('should successfully fetch enabled models', async () => {
      const mockResponse = createEnabledModelsResponse();

      server.use(
        http.get('/api/settings/enabled-models', () => {
          return HttpResponse.json(mockResponse);
        })
      );

      const result = await repository.getEnabledModels();
      expect(result).toEqual(mockResponse);
      expect(result.models).toHaveLength(1);
      expect(result.models[0].isEnabled).toBe(true);
    });

    it('should handle empty models list', async () => {
      const mockResponse = createEnabledModelsResponse({ models: [] });

      server.use(
        http.get('/api/settings/enabled-models', () => {
          return HttpResponse.json(mockResponse);
        })
      );

      const result = await repository.getEnabledModels();
      expect(result.models).toHaveLength(0);
    });

    it('should handle unauthorized access', async () => {
      server.use(
        http.get('/api/settings/enabled-models', () => {
          return new Response('status 401: Unauthorized access', { status: 401 });
        })
      );

      await expect(repository.getEnabledModels()).rejects.toThrow(UnauthorizedError);
      await expect(repository.getEnabledModels()).rejects.toThrow('Unauthorized access');
    });

    it('should handle network errors', async () => {
      server.use(
        http.get('/api/settings/enabled-models', () => {
          return HttpResponse.error();
        })
      );

      await expect(repository.getEnabledModels()).rejects.toThrow(NetworkError);
    });

    it('should handle internal server error', async () => {
      server.use(
        http.get('/api/settings/enabled-models', () => {
          return HttpResponse.json(
            { code: 'PROVIDER_500', message: 'Internal server error occurred' },
            { status: 500 }
          );
        })
      );

      await expect(repository.getEnabledModels()).rejects.toThrow(NetworkError);
    });
  });
});
