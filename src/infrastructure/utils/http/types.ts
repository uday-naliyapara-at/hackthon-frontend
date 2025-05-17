export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type RefreshTokenFn = () => Promise<string>;

export interface StreamOptions {
  signal?: AbortSignal;
  onStart?: () => void;
  onChunk?: (chunk: string) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

export interface IHttpClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data?: unknown, isAuthRequest?: boolean): Promise<T>;
  put<T>(url: string, data?: unknown): Promise<T>;
  delete<T>(url: string): Promise<T>;
  patch<T>(url: string, data?: unknown): Promise<T>;

  /**
   * Performs a POST request with streaming response handling
   * @param url The URL to send the request to
   * @param data The data to send in the request body
   * @param options Options for handling the stream
   * @returns A function to abort the stream
   */
  postStream(url: string, data?: unknown, options?: StreamOptions): () => void;

  /**
   * Performs a PUT request with streaming response handling
   * @param url The URL to send the request to
   * @param data The data to send in the request body
   * @param options Options for handling the stream
   * @returns A function to abort the stream
   */
  putStream(url: string, data?: unknown, options?: StreamOptions): () => void;
}
