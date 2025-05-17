import { FetchHttpClient } from './FetchHttpClient';
import type { RefreshTokenFn } from './types';

/**
 * Creates a configured HTTP client instance
 * Handles environment-based configuration (mock vs real API)
 */
export function createHttpClient(refreshTokenFn: RefreshTokenFn): FetchHttpClient {
  const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';
  const baseUrl = useMockApi ? '' : import.meta.env.VITE_API_BASE_URL || '';

  // Log configuration once during client creation
  if (process.env.NODE_ENV === 'development') {
    console.log(
      '🌐 Creating HTTP Client:',
      useMockApi ? '(Using Mock API)' : `(Using Real API: ${baseUrl})`
    );
  }

  return new FetchHttpClient(baseUrl, refreshTokenFn);
}
