import { KeyStatus, ModelConfig, ModelProvider } from './types';

export class ModelProviderEntity implements ModelProvider {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _logo: string,
    private _keyStatus: KeyStatus,
    private readonly _models: ModelConfig[],
    private _apiKey?: string
  ) {
    this.validateState();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get logo(): string {
    return this._logo;
  }

  get keyStatus(): KeyStatus {
    return this._keyStatus;
  }

  get models(): ModelConfig[] {
    return [...this._models];
  }

  get apiKey(): string | undefined {
    return this._apiKey;
  }

  private validateState(): void {
    if (!this._id) throw new Error('Provider ID is required');
    if (!this._name) throw new Error('Provider name is required');
    if (!this._logo) throw new Error('Provider logo is required');
    if (!Object.values(KeyStatus).includes(this._keyStatus)) {
      throw new Error('Invalid key status');
    }
    if (!Array.isArray(this._models)) {
      throw new Error('Models must be an array');
    }

    // Validate apiKey if keyStatus is VALID
    if (this._keyStatus === KeyStatus.VALID && !this._apiKey) {
      throw new Error('API key is required when key status is valid');
    }

    // Validate each model
    this._models.forEach((model) => {
      if (!model.id) throw new Error('Model ID is required');
      if (!model.name) throw new Error('Model name is required');
      if (typeof model.isEnabled !== 'boolean') {
        throw new Error('Model isEnabled must be a boolean');
      }
      if (!model.providerId) throw new Error('Model providerId is required');
      if (model.providerId !== this._id) {
        throw new Error('Model providerId must match provider id');
      }
      if (!Array.isArray(model.capabilities)) {
        throw new Error('Model capabilities must be an array');
      }
    });
  }

  static create(params: {
    id: string;
    name: string;
    logo: string;
    keyStatus: KeyStatus;
    models: ModelConfig[];
    apiKey?: string;
  }): ModelProviderEntity {
    return new ModelProviderEntity(
      params.id,
      params.name,
      params.logo,
      params.keyStatus,
      params.models,
      params.apiKey
    );
  }

  updateKeyStatus(status: KeyStatus, apiKey?: string): ModelProviderEntity {
    return new ModelProviderEntity(
      this._id,
      this._name,
      this._logo,
      status,
      this._models,
      apiKey || this._apiKey
    );
  }

  toggleModelEnabled(modelId: string, isEnabled: boolean): ModelProviderEntity {
    const updatedModels = this._models.map((model) =>
      model.id === modelId ? { ...model, isEnabled } : model
    );

    return new ModelProviderEntity(
      this._id,
      this._name,
      this._logo,
      this._keyStatus,
      updatedModels,
      this._apiKey
    );
  }

  /**
   * Validates API key format
   * Currently supports OpenAI and Anthropic key formats
   */
  static isValidApiKey(key: string): boolean {
    // OpenAI key format: sk-... or sk-proj-...
    const isOpenAIKey = /^sk-(?:proj-)?[a-zA-Z0-9_-]{32,}$/.test(key);

    // Anthropic key format: sk-ant-...
    const isAnthropicKey = /^sk-ant-[a-zA-Z0-9_-]{32,}$/.test(key);

    return isOpenAIKey || isAnthropicKey;
  }

  /**
   * Checks if provider has a valid API key configured
   */
  hasValidKey(): boolean {
    return this.keyStatus === KeyStatus.VALID;
  }

  /**
   * Finds a model by ID
   */
  findModel(modelId: string): ModelConfig | undefined {
    return this.models.find((model) => model.id === modelId);
  }

  /**
   * Validates a model configuration
   * @throws Error if model configuration is invalid
   */
  static validateModelConfig(model: ModelConfig): boolean {
    if (!model) return false;
    if (!model.id) throw new Error('Model ID is required');
    if (!model.name) throw new Error('Model name is required');
    if (typeof model.isEnabled !== 'boolean') {
      throw new Error('Model isEnabled must be a boolean');
    }
    if (!model.providerId) throw new Error('Model providerId is required');
    if (!Array.isArray(model.capabilities)) {
      throw new Error('Model capabilities must be an array');
    }
    return true;
  }
}
