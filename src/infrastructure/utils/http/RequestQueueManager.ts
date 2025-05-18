import { TokenExpiredError, UnauthorizedError } from '../../../application/features/auth/errors';
import { RefreshTokenFn } from './types';

interface QueuedRequest {
  execute: () => Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}

// Constants for token refresh
const REFRESH_DEBOUNCE_TIME = 2000; // 2 seconds
const MAX_REFRESH_RETRIES = 3;

/**
 * Manages request queue and token refresh logic
 * Ensures efficient handling of concurrent requests and token refreshing
 */
export class RequestQueueManager {
  private isRefreshing = false;
  private requestQueue: QueuedRequest[] = [];
  private refreshPromise: Promise<string> | null = null;
  private lastRefreshTime = 0;
  private refreshRetryCount = 0;

  constructor(private readonly refreshTokenFn: RefreshTokenFn) {}

  /**
   * Executes a request with appropriate token refresh handling
   * @param requestFn The request function to execute
   * @param isAuthRequest Whether this is an authentication request (skips token refresh)
   */
  async executeRequest<T>(requestFn: () => Promise<T>, isAuthRequest: boolean = false): Promise<T> {
    // Auth requests bypass token refresh
    if (isAuthRequest) {
      return requestFn();
    }

    // If actively refreshing token, queue the request
    if (this.isRefreshing) {
      return this.enqueueRequest(requestFn);
    }

    try {
      // Try to execute the request
      return await requestFn();
    } catch (error) {
      // Handle token expiration
      if (error instanceof TokenExpiredError || error instanceof UnauthorizedError) {
        return this.handleTokenRefresh(requestFn);
      }
      throw error;
    }
  }

  /**
   * Handles token refresh and request retries
   * @param requestFn The request function to retry after refresh
   */
  private async handleTokenRefresh<T>(requestFn: () => Promise<T>): Promise<T> {
    // If already refreshing, queue the request
    if (this.isRefreshing) {
      return this.enqueueRequest(requestFn);
    }

    const now = Date.now();
    const timeSinceLastRefresh = now - this.lastRefreshTime;

    // If token was recently refreshed, don't try again - just queue the request
    if (timeSinceLastRefresh < REFRESH_DEBOUNCE_TIME && this.refreshPromise) {
      console.log(`Recent token refresh (${timeSinceLastRefresh}ms ago), queuing request`);
      return this.enqueueRequest(requestFn);
    }

    // Prevent refresh storms by limiting refresh retries
    if (this.refreshRetryCount >= MAX_REFRESH_RETRIES) {
      console.error(`Max token refresh retries (${MAX_REFRESH_RETRIES}) exceeded`);
      this.refreshRetryCount = 0; // Reset for future attempts
      throw new Error('Authentication failed: Max token refresh retries exceeded');
    }

    try {
      this.isRefreshing = true;
      this.refreshRetryCount++;

      console.log(`Refreshing token (attempt ${this.refreshRetryCount})`);

      // Create refresh promise
      this.refreshPromise = this.refreshTokenFn();
      this.lastRefreshTime = now;

      // Wait for refresh to complete
      const newToken = await this.refreshPromise;

      // Reset retry count on success
      this.refreshRetryCount = 0;

      // Only update token in storage if we got a valid new token
      if (newToken) {
        localStorage.setItem('accessToken', newToken);
        console.log('Token refresh successful');
      }

      // Process pending requests
      await this.processQueue();

      // Execute original request with new token
      return await requestFn();
    } catch (error) {
      console.error('Token refresh failed:', error);

      // Clear the queue with errors if refresh fails
      this.rejectQueue(error instanceof Error ? error : new Error('Token refresh failed'));
      throw error;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Adds a request to the queue
   */
  private enqueueRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      console.log('Queuing request while token refreshes');
      this.requestQueue.push({
        execute: requestFn,
        resolve: (value) => resolve(value as T),
        reject,
      });
    });
  }

  /**
   * Processes all queued requests after successful token refresh
   */
  private async processQueue(): Promise<void> {
    if (this.requestQueue.length === 0) return;

    console.log(`Processing ${this.requestQueue.length} queued requests`);
    const requests = [...this.requestQueue];
    this.requestQueue = [];

    for (const request of requests) {
      try {
        const result = await request.execute();
        request.resolve(result);
      } catch (error) {
        console.error('Queued request failed:', error);
        request.reject(error);
      }
    }
  }

  /**
   * Rejects all queued requests with the given error
   */
  private rejectQueue(error: Error): void {
    console.log(`Rejecting ${this.requestQueue.length} queued requests due to refresh failure`);
    const requests = [...this.requestQueue];
    this.requestQueue = [];

    for (const request of requests) {
      request.reject(error);
    }
  }
}
