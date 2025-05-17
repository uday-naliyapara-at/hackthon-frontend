import {
  NetworkError,
  UnauthorizedError,
  ValidationError,
} from '../../application/features/auth/errors';
import { IHttpClient } from '../utils/http/types';

export interface BaseErrorResponse {
  code?: string;
  message: string;
  details?: Record<string, unknown>;
  status?: number;
}

export enum HttpStatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
}

export abstract class BaseRepository {
  constructor(protected readonly httpClient: IHttpClient) {}

  protected parseError(error: unknown): BaseErrorResponse {
    if (!(error instanceof Error)) {
      return { message: 'Unknown error' };
    }

    try {
      const parsed = JSON.parse(error.message);
      // Try to extract status from error message if not present
      if (!parsed.status && error.message.includes('status')) {
        const match = error.message.match(/status (\d+)/i);
        if (match) {
          parsed.status = parseInt(match[1], 10);
        }
      }
      return parsed;
    } catch {
      // Try to extract status from error message
      const match = error.message.match(/status (\d+)/i);
      return {
        message: error.message,
        status: match ? parseInt(match[1], 10) : undefined,
      };
    }
  }

  protected handleError(error: unknown): Error {
    const errorData = this.parseError(error);
    return this.handleErrorResponse(errorData);
  }

  protected handleErrorResponse(errorData: BaseErrorResponse): Error {
    // First check for specific error codes
    if (errorData.code) {
      const error = this.handleErrorCode(errorData.code, errorData.message);
      if (error) return error;
    }

    // Then fallback to status codes
    if (errorData.status) {
      switch (errorData.status) {
        case HttpStatusCode.UNAUTHORIZED:
          return new UnauthorizedError(errorData.message || 'Unauthorized access');
        case HttpStatusCode.BAD_REQUEST:
          return new ValidationError(errorData.message || 'Invalid input');
        case HttpStatusCode.INTERNAL_SERVER_ERROR:
          return new NetworkError(errorData.message || 'An unexpected error occurred');
      }
    }

    return new NetworkError(errorData.message || 'An unexpected error occurred');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected handleErrorCode(_code: string, _message: string): Error | null {
    // Common error codes can be handled here
    // Specific repositories should override this method
    return null;
  }
}
