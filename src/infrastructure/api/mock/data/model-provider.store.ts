import { KeyStatus, ModelProvider } from '@/domain/models/model-provider/types';

import { PROVIDER_ERROR_MESSAGES } from '../handlers/settings/model-providers/constants';

const STORAGE_KEYS = {
  MODEL_PROVIDERS: 'mock_model_providers',
} as const;

// Define constant UUIDs for providers to maintain consistency
const PROVIDER_IDS = {
  OPENAI: '7a052649-8d0f-4244-a336-89b5f7637af0',
  ANTHROPIC: '550e8400-e29b-41d4-a716-446655440000',
} as const;

// Define constant UUIDs for models to maintain consistency
const MODEL_IDS = {
  GPT_4: '8a1b9c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
  GPT_35_TURBO: '9b2c0d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e',
  CLAUDE_2: 'a3b4c5d6-7e8f-9a0b-1c2d-3e4f5a6b7c8d',
  CLAUDE_INSTANT: 'b4c5d6e7-8f9a-0b1c-2d3e-4f5a6b7c8d9e',
} as const;

class ModelProviderStore {
  private providers: Map<string, ModelProvider>;

  constructor() {
    this.providers = this.loadFromStorage();

    // Seed initial data if empty
    if (this.providers.size === 0) {
      this.seedInitialData();
    }
  }

  private loadFromStorage(): Map<string, ModelProvider> {
    try {
      const storedData = localStorage.getItem(STORAGE_KEYS.MODEL_PROVIDERS);
      if (!storedData) return new Map();

      const parsedData = JSON.parse(storedData);
      console.debug('Loaded providers data:', parsedData); // Debug log

      // Handle both array format and object format for backward compatibility
      if (Array.isArray(parsedData)) {
        return new Map(parsedData);
      } else {
        return new Map(Object.entries(parsedData));
      }
    } catch (error) {
      console.error('Error loading providers from storage:', error);
      return new Map();
    }
  }

  private persistProviders() {
    try {
      const serializedData = JSON.stringify(Object.fromEntries(this.providers));
      console.debug('Persisting providers data:', JSON.parse(serializedData)); // Debug log
      localStorage.setItem(STORAGE_KEYS.MODEL_PROVIDERS, serializedData);
    } catch (error) {
      console.error('Error persisting providers:', error);
    }
  }

  private seedInitialData() {
    const initialProviders: ModelProvider[] = [
      {
        id: PROVIDER_IDS.OPENAI,
        name: 'OpenAI',
        logo: 'https://static-00.iconduck.com/assets.00/openai-icon-2021x2048-4rpe5x7n.png',
        keyStatus: KeyStatus.NOT_CONFIGURED,
        models: [
          {
            id: MODEL_IDS.GPT_4,
            name: 'GPT-4',
            isEnabled: false,
            providerId: PROVIDER_IDS.OPENAI,
            capabilities: ['chat', 'completion'],
          },
          {
            id: MODEL_IDS.GPT_35_TURBO,
            name: 'GPT-3.5 Turbo',
            isEnabled: false,
            providerId: PROVIDER_IDS.OPENAI,
            capabilities: ['chat'],
          },
        ],
      },
      {
        id: PROVIDER_IDS.ANTHROPIC,
        name: 'Anthropic',
        logo: 'https://images.seeklogo.com/logo-png/51/2/anthropic-icon-logo-png_seeklogo-515014.png',
        keyStatus: KeyStatus.NOT_CONFIGURED,
        models: [
          {
            id: MODEL_IDS.CLAUDE_2,
            name: 'Claude 2',
            isEnabled: false,
            providerId: PROVIDER_IDS.ANTHROPIC,
            capabilities: ['chat', 'completion'],
          },
          {
            id: MODEL_IDS.CLAUDE_INSTANT,
            name: 'Claude Instant',
            isEnabled: false,
            providerId: PROVIDER_IDS.ANTHROPIC,
            capabilities: ['chat'],
          },
        ],
      },
    ];

    initialProviders.forEach((provider) => {
      this.providers.set(provider.id, provider);
    });
    this.persistProviders();
  }

  async getProviders(): Promise<ModelProvider[]> {
    const providers = Array.from(this.providers.values());
    console.debug('Getting providers:', providers); // Debug log
    return providers;
  }

  async getProviderById(id: string): Promise<ModelProvider | undefined> {
    return this.providers.get(id);
  }

  async updateProviderKey(providerId: string, key: string): Promise<void> {
    const provider = this.providers.get(providerId);
    if (!provider) throw new Error('Provider not found');

    // Create a new provider object to ensure proper updates
    const updatedProvider = {
      ...provider,
      keyStatus: KeyStatus.VALID,
      apiKey: key,
    };

    console.debug('Updating provider with key:', { providerId, updatedProvider }); // Debug log
    this.providers.set(providerId, updatedProvider);
    this.persistProviders();
  }

  async updateModelStatus(providerId: string, modelId: string, isEnabled: boolean): Promise<void> {
    const provider = this.providers.get(providerId);
    if (!provider) throw new Error('Provider not found');

    // If trying to enable but API key is not configured, throw error
    if (isEnabled && provider.keyStatus === KeyStatus.NOT_CONFIGURED) {
      throw new Error(PROVIDER_ERROR_MESSAGES.MODEL_API_KEY_NOT_CONFIGURED);
    }

    // Update the models array with the new status for the specified model
    const updatedModels = provider.models.map((model) =>
      model.id === modelId ? { ...model, isEnabled } : model
    );

    // Create a new provider object with updated model status
    const updatedProvider = {
      ...provider,
      models: updatedModels,
    };

    console.debug('Updating model status:', {
      providerId,
      modelId,
      isEnabled,
      updatedProvider,
    });

    this.providers.set(providerId, updatedProvider);
    this.persistProviders();
  }

  async validateKey(providerId: string, key: string): Promise<KeyStatus> {
    // Simulate key validation
    if (!key || key.length < 10) return KeyStatus.INVALID;
    return KeyStatus.VALID;
  }

  async reset(): Promise<void> {
    this.providers.clear();
    localStorage.removeItem(STORAGE_KEYS.MODEL_PROVIDERS);
    this.seedInitialData();
  }
}

export const modelProviderStore = new ModelProviderStore();
