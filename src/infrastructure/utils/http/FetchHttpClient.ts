import { TokenExpiredError, UnauthorizedError } from '../../../application/features/auth/errors';
import { RequestQueueManager } from './RequestQueueManager';
import { IHttpClient, RefreshTokenFn, StreamOptions } from './types';

interface ErrorResponse {
  code?: string;
  message: string;
  status?: number;
}

/**
 * HTTP client implementation using the Fetch API
 * Handles regular requests and streaming responses
 */
export class FetchHttpClient implements IHttpClient {
  private readonly baseUrl: string;
  private readonly requestQueue: RequestQueueManager;

  constructor(baseUrl: string = '', refreshTokenFn: RefreshTokenFn) {
    this.baseUrl = baseUrl;
    this.requestQueue = new RequestQueueManager(refreshTokenFn);
  }

  /**
   * Parses an error response string into an ErrorResponse object
   */
  private parseErrorResponse(error: string): ErrorResponse {
    try {
      return JSON.parse(error);
    } catch {
      return { message: error };
    }
  }

  /**
   * Creates an appropriate error object based on response status and error data
   */
  private createErrorFromResponse(response: Response, errorData: ErrorResponse): Error {
    // Handle auth errors
    if (response.status === 401) {
      return new UnauthorizedError(errorData.message);
    }

    // For other errors, include status in the error data
    return new Error(JSON.stringify({ ...errorData, status: response.status }));
  }

  /**
   * Handles errors from regular requests
   */
  private handleRequestError(response: Response, errorData: ErrorResponse): never {
    throw this.createErrorFromResponse(response, errorData);
  }

  /**
   * Handles errors from streaming responses
   */
  private async handleStreamError(response: Response, options?: StreamOptions): Promise<never> {
    try {
      // Try to parse the error response
      const errorText = await response.text();
      const errorData = this.parseErrorResponse(errorText);

      // Create an appropriate error
      const error = this.createErrorFromResponse(response, errorData);

      // Notify of error
      if (options?.onError) {
        options.onError(error);
      }

      throw error;
    } catch (parseError) {
      // If we can't parse the error, create a generic one
      const error = new Error(`HTTP error! Status: ${response.status}`);

      // Notify of error
      if (options?.onError) {
        options.onError(error);
      }

      throw error;
    }
  }

  /**
   * Creates headers for a request
   */
  private createHeaders(
    contentType: string = 'application/json',
    additionalHeaders: Record<string, string> = {}
  ): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': contentType,
      ...additionalHeaders,
    };

    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Performs a generic HTTP request
   */
  private async request<T>(
    method: string,
    url: string,
    data?: unknown,
    isAuthRequest = false
  ): Promise<T> {
    const requestFn = async () => {
      const headers = this.createHeaders();

      const response = await fetch(`${this.baseUrl}${url}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        credentials: 'include', // Important for cookies
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorData = this.parseErrorResponse(errorText);
        this.handleRequestError(response, errorData);
      }

      // For successful responses, check if there's actually content to parse
      const text = await response.text();
      if (!text) {
        return undefined as T;
      }

      try {
        return JSON.parse(text) as T;
      } catch {
        // If parsing fails but response was successful, just return undefined
        return undefined as T;
      }
    };

    return this.requestQueue.executeRequest(requestFn, isAuthRequest);
  }

  /**
   * Performs a GET request
   */
  async get<T>(url: string): Promise<T> {
    return this.request<T>('GET', url);
  }

  /**
   * Performs a POST request
   */
  async post<T>(url: string, data?: unknown, isAuthRequest?: boolean): Promise<T> {
    // Use the provided isAuthRequest parameter or check if it's a refresh token request
    const isAuth = isAuthRequest || url.includes('/auth/refresh');
    return this.request<T>('POST', url, data, isAuth);
  }

  /**
   * Performs a PUT request
   */
  async put<T>(url: string, data?: unknown): Promise<T> {
    return this.request<T>('PUT', url, data);
  }

  /**
   * Performs a DELETE request
   */
  async delete<T>(url: string): Promise<T> {
    return this.request<T>('DELETE', url);
  }

  /**
   * Performs a PATCH request
   */
  async patch<T>(url: string, data?: unknown): Promise<T> {
    return this.request<T>('PATCH', url, data);
  }

  /**
   * Performs a POST request with streaming response handling
   */
  postStream(url: string, data?: unknown, options?: StreamOptions): () => void {
    const controller = new AbortController();
    const signal = options?.signal || controller.signal;
    let readerRef: ReadableStreamDefaultReader<Uint8Array> | null = null;

    // Wrap the stream request in RequestQueueManager
    const executeStreamRequest = async () => {
      try {
        const headers = this.createHeaders('application/json', {
          Accept: 'text/event-stream',
        });

        const response = await fetch(`${this.baseUrl}${url}`, {
          method: 'POST',
          headers,
          body: data ? JSON.stringify(data) : undefined,
          signal,
          credentials: 'include',
        });

        if (!response.ok) {
          const errorText = await response.text();
          const errorData = this.parseErrorResponse(errorText);
          const error = this.createErrorFromResponse(response, errorData);

          // For token expiration, throw the error to trigger refresh
          if (error instanceof TokenExpiredError || error instanceof UnauthorizedError) {
            throw error;
          }

          // For other errors, handle through the stream error handler
          await this.handleStreamError(response, options);
          return;
        }

        if (!response.body) {
          throw new Error('Response body is null');
        }

        // Notify that streaming has started
        if (options?.onStart) {
          options.onStart();
        }

        readerRef = this.processStream(response.body, options, signal);
      } catch (error) {
        // Let token expiration errors propagate
        if (error instanceof TokenExpiredError || error instanceof UnauthorizedError) {
          throw error;
        }

        // Handle other errors through the stream error handler
        if (options?.onError) {
          options.onError(error instanceof Error ? error : new Error('Unknown error'));
        }
      }
    };

    // Execute with token refresh support
    this.requestQueue.executeRequest(executeStreamRequest).catch((error) => {
      // Skip if aborted - this is an expected case
      if (error.name === 'AbortError') {
        return;
      }

      // Notify of error if not already handled
      if (
        options?.onError &&
        !(error instanceof TokenExpiredError) &&
        !(error instanceof UnauthorizedError)
      ) {
        options.onError(error instanceof Error ? error : new Error('Unknown error'));
      }
    });

    // Return abort function
    return () => {
      if (readerRef) {
        readerRef.cancel('Manually aborted').catch((err) => {
          console.error('Error canceling stream:', err);
        });
        readerRef = null;
      }
      controller.abort();
    };
  }

  /**
   * Processes a ReadableStream and calls the appropriate callbacks
   * @returns The reader object for potential cancellation
   */
  private processStream(
    stream: ReadableStream<Uint8Array>,
    options?: StreamOptions,
    signal?: AbortSignal
  ): ReadableStreamDefaultReader<Uint8Array> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    const processNextChunk = async () => {
      // Check if the signal is already aborted before attempting to read
      if (signal?.aborted) {
        if (options?.onError) {
          options.onError(new Error('Stream was aborted'));
        }
        return;
      }

      try {
        const { done, value } = await reader.read();

        // Check again if aborted after the read completes
        if (signal?.aborted) {
          if (options?.onError) {
            options.onError(new Error('Stream was aborted'));
          }
          return;
        }

        if (done) {
          // Stream is complete
          if (options?.onComplete) {
            options.onComplete();
          }
          return;
        }

        // Decode the chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });

        // Process complete lines in the buffer
        buffer = this.processBuffer(buffer, options);

        // Continue processing only if not aborted
        if (!signal?.aborted) {
          processNextChunk();
        } else {
          if (options?.onError) {
            options.onError(new Error('Stream was aborted'));
          }
        }
      } catch (error) {
        console.error('Error processing stream chunk:', error);

        // Notify of error
        if (options?.onError) {
          options.onError(error instanceof Error ? error : new Error('Error processing stream'));
        }
      }
    };

    // Start processing
    processNextChunk();

    // Return the reader for potential cancellation
    return reader;
  }

  /**
   * Processes the buffer and calls the onChunk callback for complete lines
   */
  private processBuffer(buffer: string, options?: StreamOptions): string {
    let newBuffer = buffer;
    let newlineIndex;

    while ((newlineIndex = newBuffer.indexOf('\n')) >= 0) {
      const line = newBuffer.slice(0, newlineIndex).trim();
      newBuffer = newBuffer.slice(newlineIndex + 1);

      if (!line) {
        continue; // Skip empty lines
      }

      // For SSE format, extract the data part
      if (line.startsWith('data:')) {
        const data = line.slice(5).trim();

        this.notifyChunk(data, options);
      } else {
        // For non-SSE format, just pass the whole line

        this.notifyChunk(line, options);
      }
    }

    // Return the remaining buffer
    return newBuffer;
  }

  /**
   * Notifies the caller of a new chunk of data
   */
  private notifyChunk(data: string, options?: StreamOptions): void {
    if (options?.onChunk) {
      options.onChunk(data);
    }
  }

  /**
   * Performs a PUT request with streaming response handling
   */
  putStream(url: string, data?: unknown, options?: StreamOptions): () => void {
    const controller = new AbortController();
    const signal = options?.signal || controller.signal;
    let readerRef: ReadableStreamDefaultReader<Uint8Array> | null = null;

    // Wrap the stream request in RequestQueueManager
    const executeStreamRequest = async () => {
      try {
        const headers = this.createHeaders('application/json', {
          Accept: 'text/event-stream',
        });

        const response = await fetch(`${this.baseUrl}${url}`, {
          method: 'PUT',
          headers,
          body: data ? JSON.stringify(data) : undefined,
          signal,
          credentials: 'include',
        });

        if (!response.ok) {
          const errorText = await response.text();
          const errorData = this.parseErrorResponse(errorText);
          const error = this.createErrorFromResponse(response, errorData);

          // For token expiration, throw the error to trigger refresh
          if (error instanceof TokenExpiredError || error instanceof UnauthorizedError) {
            throw error;
          }

          // For other errors, handle through the stream error handler
          await this.handleStreamError(response, options);
          return;
        }

        if (!response.body) {
          throw new Error('Response body is null');
        }

        // Notify that streaming has started
        if (options?.onStart) {
          options.onStart();
        }

        readerRef = this.processStream(response.body, options, signal);
      } catch (error) {
        // Let token expiration errors propagate
        if (error instanceof TokenExpiredError || error instanceof UnauthorizedError) {
          throw error;
        }

        // Handle other errors through the stream error handler
        if (options?.onError) {
          options.onError(error instanceof Error ? error : new Error('Unknown error'));
        }
      }
    };

    // Execute with token refresh support
    this.requestQueue.executeRequest(executeStreamRequest).catch((error) => {
      // Skip if aborted - this is an expected case
      if (error.name === 'AbortError') {
        return;
      }

      // Notify of error if not already handled
      if (
        options?.onError &&
        !(error instanceof TokenExpiredError) &&
        !(error instanceof UnauthorizedError)
      ) {
        options.onError(error instanceof Error ? error : new Error('Unknown error'));
      }
    });

    // Return abort function
    return () => {
      if (readerRef) {
        readerRef.cancel('Manually aborted').catch((err) => {
          console.error('Error canceling stream:', err);
        });
        readerRef = null;
      }
      controller.abort();
    };
  }
}
