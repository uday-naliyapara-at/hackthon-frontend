/**
 * Mock Service Worker (MSW) Server Setup
 *
 * This module configures MSW for Node.js environment, primarily used in:
 * 1. Unit tests
 * 2. Integration tests
 * 3. Server-side rendering
 *
 * The server intercepts network requests during testing and provides mock responses
 * based on the defined handlers.
 */
import { setupServer } from 'msw/node';

import { handlers } from './handlers';

// Create MSW server instance with all request handlers
export const server = setupServer(...handlers);

// Test environment setup
if (process.env.NODE_ENV === 'test') {
  // Configure server for test environment
  beforeAll(() =>
    server.listen({
      onUnhandledRequest: 'error', // Fail tests on unhandled requests
    })
  );

  // Reset handlers between tests
  afterEach(() => server.resetHandlers());

  // Clean up after all tests
  afterAll(() => server.close());
}
