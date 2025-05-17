/**
 * Mock Service Worker (MSW) Browser Setup
 *
 * This module configures MSW for browser environment, used during development to:
 * 1. Intercept API requests
 * 2. Provide mock responses
 * 3. Simulate API behavior
 * 4. Enable offline development
 *
 * MSW uses Service Workers to intercept network requests in the browser
 * and return mock responses based on the defined handlers.
 */
import { setupWorker } from 'msw/browser';

import { seedAuthStore } from './data/seed';
import { handlers } from './handlers';

// Create MSW worker instance with all request handlers
export const worker = setupWorker(...handlers);

// Initialize MSW in development environment
if (process.env.NODE_ENV === 'development') {
  worker
    .start({
      onUnhandledRequest: 'bypass', // Don't warn about unhandled requests (e.g., static assets)
    })
    .then(() => {
      // Seed the auth store after MSW starts
      return seedAuthStore();
    })
    .catch((error) => {
      console.error('MSW Worker failed to start:', error);
    });
}
