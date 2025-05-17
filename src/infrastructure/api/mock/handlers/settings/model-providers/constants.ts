import { COMMON_ERRORS } from '../../constants';

// Error messages as constants to avoid string literals
export const PROVIDER_ERROR_MESSAGES = {
  MODEL_API_KEY_NOT_CONFIGURED: 'Cannot enable model: Provider API key not configured',
} as const;

export const PROVIDER_ERRORS = {
  PROVIDER_NOT_FOUND: {
    code: 'PROVIDER_001',
    message: 'Provider not found',
  },
  MODEL_NOT_FOUND: {
    code: 'PROVIDER_002',
    message: 'Model not found',
  },
  INVALID_API_KEY: {
    code: 'PROVIDER_003',
    message: 'API key is required',
  },
  INVALID_STATUS: {
    code: 'PROVIDER_004',
    message: 'isEnabled must be a boolean',
  },
  INVALID_KEY_STATUS: {
    code: 'PROVIDER_005',
    message: 'Invalid key status',
  },
  PROVIDER_OR_MODEL_NOT_FOUND: {
    code: 'PROVIDER_006',
    message: 'Provider or model not found',
  },
  API_KEY_NOT_CONFIGURED: {
    code: 'PROVIDER_007',
    message: 'Cannot enable: API key not configured',
  },
  ...COMMON_ERRORS,
} as const;

export type ProviderErrorCode = keyof typeof PROVIDER_ERRORS;
