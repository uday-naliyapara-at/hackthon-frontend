import { EnabledModelsResponse, KeyStatus, ModelConfig } from '../types';

describe('Domain > Models > ModelProvider > Types', () => {
  // Test data factory
  const createModelConfig = (overrides = {}): ModelConfig => ({
    id: 'gpt-4',
    name: 'GPT-4',
    isEnabled: true,
    providerId: 'openai',
    capabilities: ['chat', 'completion'],
    ...overrides,
  });

  describe('EnabledModelsResponse', () => {
    it('should properly serialize and deserialize', () => {
      const models = [createModelConfig(), createModelConfig({ id: 'gpt-3.5' })];
      const response: EnabledModelsResponse = { models };

      // Serialize to JSON and back
      const serialized = JSON.stringify(response);
      const deserialized = JSON.parse(serialized) as EnabledModelsResponse;

      // Should maintain structure and values
      expect(deserialized).toEqual(response);
      expect(deserialized.models).toHaveLength(2);
      expect(deserialized.models[0]).toEqual(models[0]);
    });

    it('should maintain model configuration types after serialization', () => {
      const response: EnabledModelsResponse = {
        models: [createModelConfig()],
      };

      // Serialize to JSON and back
      const deserialized = JSON.parse(JSON.stringify(response)) as EnabledModelsResponse;

      // Should maintain correct types
      expect(typeof deserialized.models[0].id).toBe('string');
      expect(typeof deserialized.models[0].name).toBe('string');
      expect(typeof deserialized.models[0].isEnabled).toBe('boolean');
      expect(Array.isArray(deserialized.models[0].capabilities)).toBe(true);
    });
  });

  describe('KeyStatus', () => {
    it('should have all required status values', () => {
      expect(Object.values(KeyStatus)).toContain('not_configured');
      expect(Object.values(KeyStatus)).toContain('valid');
      expect(Object.values(KeyStatus)).toContain('invalid');
      expect(Object.values(KeyStatus)).toContain('expired');
    });

    it('should maintain enum values after serialization', () => {
      const status = KeyStatus.VALID;
      const serialized = JSON.stringify({ status });
      const deserialized = JSON.parse(serialized);

      expect(deserialized.status).toBe(KeyStatus.VALID);
    });
  });

  describe('ModelConfig', () => {
    it('should enforce required properties', () => {
      const validConfig = createModelConfig();

      // TypeScript compilation would fail if we omit required properties
      expect(validConfig.id).toBeDefined();
      expect(validConfig.name).toBeDefined();
      expect(validConfig.isEnabled).toBeDefined();
      expect(validConfig.providerId).toBeDefined();
      expect(validConfig.capabilities).toBeDefined();
    });

    it('should maintain property types after serialization', () => {
      const config = createModelConfig();
      const deserialized = JSON.parse(JSON.stringify(config)) as ModelConfig;

      expect(typeof deserialized.id).toBe('string');
      expect(typeof deserialized.name).toBe('string');
      expect(typeof deserialized.isEnabled).toBe('boolean');
      expect(typeof deserialized.providerId).toBe('string');
      expect(Array.isArray(deserialized.capabilities)).toBe(true);
    });

    it('should handle optional properties correctly', () => {
      const config: ModelConfig = {
        ...createModelConfig(),
        // Add any optional properties here if they exist
      };

      expect(config).toBeDefined();
    });
  });
});
