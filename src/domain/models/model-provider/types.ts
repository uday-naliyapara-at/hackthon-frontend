export enum KeyStatus {
  NOT_CONFIGURED = 'not_configured',
  VALID = 'valid',
  INVALID = 'invalid',
  EXPIRED = 'expired',
}

export interface ModelConfig {
  id: string;
  name: string;
  isEnabled: boolean;
  providerId: string;
  capabilities: string[];
}

export interface ModelProvider {
  id: string;
  name: string;
  logo: string;
  keyStatus: KeyStatus;
  models: ModelConfig[];
  apiKey?: string;
}

export interface ValidateKeyResponse {
  status: KeyStatus;
}

export interface EnabledModelsResponse {
  models: ModelConfig[];
}
