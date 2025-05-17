/**
 * Tests for ModelProviderEntity which represents the core model provider domain model.
 * Verifies entity creation, validation rules, immutability, and property access.
 * Ensures domain invariants are maintained for model provider data.
 */
import { ModelProviderEntity } from '../ModelProvider';
import { KeyStatus, ModelConfig } from '../types';

describe('Domain > Models > ModelProvider > ModelProviderEntity', () => {
  // Test data factory for common test scenarios
  const validModelConfig: ModelConfig = {
    id: 'model-1',
    name: 'GPT-4',
    isEnabled: true,
    providerId: 'openai',
    capabilities: ['chat', 'completion'],
  };

  const validProviderParams = {
    id: 'openai',
    name: 'OpenAI',
    logo: 'https://example.com/openai-logo.png',
    keyStatus: KeyStatus.NOT_CONFIGURED,
    models: [validModelConfig],
  };

  const validProviderWithKeyParams = {
    ...validProviderParams,
    keyStatus: KeyStatus.VALID,
    apiKey: 'test-api-key',
  };

  /**
   * Tests entity creation through factory method and constructor
   * Verifies proper initialization and default values
   */
  describe('creation', () => {
    it('should create valid provider with factory method', () => {
      const provider = ModelProviderEntity.create(validProviderWithKeyParams);

      expect(provider).toBeInstanceOf(ModelProviderEntity);
      expect(provider.id).toBe(validProviderWithKeyParams.id);
      expect(provider.name).toBe(validProviderWithKeyParams.name);
      expect(provider.logo).toBe(validProviderWithKeyParams.logo);
      expect(provider.keyStatus).toBe(validProviderWithKeyParams.keyStatus);
      expect(provider.models).toEqual(validProviderWithKeyParams.models);
      expect(provider.apiKey).toBe(validProviderWithKeyParams.apiKey);
    });

    it('should create valid provider with constructor', () => {
      const provider = new ModelProviderEntity(
        validProviderWithKeyParams.id,
        validProviderWithKeyParams.name,
        validProviderWithKeyParams.logo,
        validProviderWithKeyParams.keyStatus,
        validProviderWithKeyParams.models,
        validProviderWithKeyParams.apiKey
      );

      expect(provider).toBeInstanceOf(ModelProviderEntity);
      expect(provider.id).toBe(validProviderWithKeyParams.id);
      expect(provider.name).toBe(validProviderWithKeyParams.name);
      expect(provider.logo).toBe(validProviderWithKeyParams.logo);
      expect(provider.keyStatus).toBe(validProviderWithKeyParams.keyStatus);
      expect(provider.models).toEqual(validProviderWithKeyParams.models);
      expect(provider.apiKey).toBe(validProviderWithKeyParams.apiKey);
    });
  });

  /**
   * Tests validation rules for all entity properties
   * Ensures business rules are enforced during creation
   */
  describe('validation', () => {
    it('should throw on missing id', () => {
      expect(() =>
        ModelProviderEntity.create({
          ...validProviderParams,
          id: '',
        })
      ).toThrow('Provider ID is required');
    });

    it('should throw on missing name', () => {
      expect(() =>
        ModelProviderEntity.create({
          ...validProviderParams,
          name: '',
        })
      ).toThrow('Provider name is required');
    });

    it('should throw on missing logo', () => {
      expect(() =>
        ModelProviderEntity.create({
          ...validProviderParams,
          logo: '',
        })
      ).toThrow('Provider logo is required');
    });

    it('should throw on invalid key status', () => {
      expect(() =>
        ModelProviderEntity.create({
          ...validProviderParams,
          keyStatus: 'invalid-status' as KeyStatus,
        })
      ).toThrow('Invalid key status');
    });

    it('should throw on invalid models type', () => {
      expect(() =>
        ModelProviderEntity.create({
          ...validProviderParams,
          models: {} as unknown as ModelConfig[],
        })
      ).toThrow('Models must be an array');
    });

    it('should throw when key status is valid but no API key provided', () => {
      expect(() =>
        ModelProviderEntity.create({
          ...validProviderParams,
          keyStatus: KeyStatus.VALID,
        })
      ).toThrow('API key is required when key status is valid');
    });
  });

  /**
   * Tests entity immutability guarantees
   * Ensures properties cannot be modified after creation
   */
  describe('immutability', () => {
    it('should have read-only properties', () => {
      const provider = ModelProviderEntity.create(validProviderWithKeyParams);

      expect(() => {
        (provider as { id: string }).id = 'new-id';
      }).toThrow(TypeError);

      expect(() => {
        (provider as { name: string }).name = 'New Name';
      }).toThrow(TypeError);

      expect(() => {
        (provider as { logo: string }).logo = 'new-logo.png';
      }).toThrow(TypeError);
    });

    it('should return new instance when updating key status', () => {
      const provider = ModelProviderEntity.create(validProviderWithKeyParams);
      const updatedProvider = provider.updateKeyStatus(KeyStatus.INVALID);

      expect(updatedProvider).not.toBe(provider);
      expect(updatedProvider.keyStatus).toBe(KeyStatus.INVALID);
      expect(provider.keyStatus).toBe(KeyStatus.VALID);
    });

    it('should return new instance when toggling model state', () => {
      const provider = ModelProviderEntity.create(validProviderWithKeyParams);
      const updatedProvider = provider.toggleModelEnabled('model-1', false);

      expect(updatedProvider).not.toBe(provider);
      expect(updatedProvider.models[0].isEnabled).toBe(false);
      expect(provider.models[0].isEnabled).toBe(true);
    });

    it('should return defensive copy of models array', () => {
      const provider = ModelProviderEntity.create(validProviderWithKeyParams);
      const models = provider.models;

      expect(models).toEqual(validProviderWithKeyParams.models);
      expect(models).not.toBe(validProviderWithKeyParams.models);
    });
  });

  /**
   * Tests state modification methods
   * Verifies proper state transitions and immutability
   */
  describe('state modifications', () => {
    it('should update key status correctly', () => {
      const provider = ModelProviderEntity.create(validProviderWithKeyParams);
      const updatedProvider = provider.updateKeyStatus(KeyStatus.EXPIRED);

      expect(updatedProvider.keyStatus).toBe(KeyStatus.EXPIRED);
      expect(updatedProvider.id).toBe(provider.id);
      expect(updatedProvider.models).toEqual(provider.models);
    });

    it('should toggle model enabled state correctly', () => {
      const provider = ModelProviderEntity.create(validProviderWithKeyParams);
      const updatedProvider = provider.toggleModelEnabled('model-1', false);

      expect(updatedProvider.models[0].isEnabled).toBe(false);
      expect(updatedProvider.models[0].id).toBe('model-1');
      expect(updatedProvider.id).toBe(provider.id);
    });

    it('should not modify other models when toggling one model', () => {
      const provider = ModelProviderEntity.create({
        ...validProviderWithKeyParams,
        models: [validModelConfig, { ...validModelConfig, id: 'model-2', name: 'GPT-3.5' }],
      });

      const updatedProvider = provider.toggleModelEnabled('model-1', false);

      expect(updatedProvider.models[0].isEnabled).toBe(false);
      expect(updatedProvider.models[1].isEnabled).toBe(true);
    });

    it('should handle toggling non-existent model gracefully', () => {
      const provider = ModelProviderEntity.create(validProviderWithKeyParams);
      const updatedProvider = provider.toggleModelEnabled('non-existent', false);

      expect(updatedProvider.models).toEqual(provider.models);
    });
  });

  /**
   * Tests for static validateModelConfig method
   * Verifies model configuration validation rules
   */
  describe('validateModelConfig', () => {
    it('should validate correct model config', () => {
      expect(ModelProviderEntity.validateModelConfig(validModelConfig)).toBe(true);
    });

    it('should throw on missing model id', () => {
      const invalidConfig = { ...validModelConfig, id: '' };
      expect(() => ModelProviderEntity.validateModelConfig(invalidConfig)).toThrow(
        'Model ID is required'
      );
    });

    it('should throw on missing model name', () => {
      const invalidConfig = { ...validModelConfig, name: '' };
      expect(() => ModelProviderEntity.validateModelConfig(invalidConfig)).toThrow(
        'Model name is required'
      );
    });

    it('should throw on invalid isEnabled type', () => {
      const invalidConfig = { ...validModelConfig, isEnabled: 'true' as unknown as boolean };
      expect(() => ModelProviderEntity.validateModelConfig(invalidConfig)).toThrow(
        'Model isEnabled must be a boolean'
      );
    });

    it('should throw on missing providerId', () => {
      const invalidConfig = { ...validModelConfig, providerId: '' };
      expect(() => ModelProviderEntity.validateModelConfig(invalidConfig)).toThrow(
        'Model providerId is required'
      );
    });

    it('should throw on invalid capabilities type', () => {
      const invalidConfig = { ...validModelConfig, capabilities: 'chat' as unknown as string[] };
      expect(() => ModelProviderEntity.validateModelConfig(invalidConfig)).toThrow(
        'Model capabilities must be an array'
      );
    });

    it('should return false for null or undefined input', () => {
      expect(ModelProviderEntity.validateModelConfig(null as unknown as ModelConfig)).toBe(false);
      expect(ModelProviderEntity.validateModelConfig(undefined as unknown as ModelConfig)).toBe(
        false
      );
    });
  });

  /**
   * Tests for model validation in validateState
   * Verifies model-specific validation rules during entity creation
   */
  describe('model validation', () => {
    it('should throw on model with mismatched providerId', () => {
      const invalidModel = { ...validModelConfig, providerId: 'different-provider' };
      expect(() =>
        ModelProviderEntity.create({
          ...validProviderParams,
          models: [invalidModel],
        })
      ).toThrow('Model providerId must match provider id');
    });

    it('should throw on model with missing required fields', () => {
      const invalidModel = { ...validModelConfig, name: '' };
      expect(() =>
        ModelProviderEntity.create({
          ...validProviderParams,
          models: [invalidModel],
        })
      ).toThrow('Model name is required');
    });

    it('should throw on model with invalid isEnabled type', () => {
      const invalidModel = { ...validModelConfig, isEnabled: 'true' as unknown as boolean };
      expect(() =>
        ModelProviderEntity.create({
          ...validProviderParams,
          models: [invalidModel],
        })
      ).toThrow('Model isEnabled must be a boolean');
    });

    it('should throw on model with invalid capabilities', () => {
      const invalidModel = { ...validModelConfig, capabilities: {} as unknown as string[] };
      expect(() =>
        ModelProviderEntity.create({
          ...validProviderParams,
          models: [invalidModel],
        })
      ).toThrow('Model capabilities must be an array');
    });
  });

  /**
   * Additional tests for models array immutability
   * Verifies that models cannot be modified after entity creation
   */
  describe('models immutability', () => {
    it('should prevent direct modification of models array', () => {
      const provider = ModelProviderEntity.create(validProviderWithKeyParams);
      const models = provider.models;

      // Attempt to modify the returned array
      models.push(validModelConfig);

      // Original provider's models should remain unchanged
      expect(provider.models).toHaveLength(validProviderWithKeyParams.models.length);
    });

    it('should prevent modification of individual model objects', () => {
      const provider = ModelProviderEntity.create(validProviderWithKeyParams);
      const models = provider.models;

      // Attempt to modify a model in the returned array
      (models[0] as any).name = 'Modified Name';

      // Original provider's model should remain unchanged
      expect(provider.models[0].name).toBe(validProviderWithKeyParams.models[0].name);
    });

    it('should create deep copy of models on each access', () => {
      const provider = ModelProviderEntity.create(validProviderWithKeyParams);

      const firstAccess = provider.models;
      const secondAccess = provider.models;

      // Each access should return a new array instance
      expect(firstAccess).not.toBe(secondAccess);

      // But the contents should be equal
      expect(firstAccess).toEqual(secondAccess);
    });
  });
});
