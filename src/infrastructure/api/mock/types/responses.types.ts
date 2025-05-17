import { z } from 'zod';

import { AuthResponseSchema, ErrorResponseSchema } from './auth.types';

// Response Types
export type ApiResponse<T> = T | ErrorResponse;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// Handler Response Types
export type RegisterResponse = ApiResponse<AuthResponse>;
export type LoginResponse = ApiResponse<AuthResponse>;
export interface TokenResponse {
  accessToken: string;
}

// Common Response Types
export type SuccessResponse = {
  success: true;
  message: string;
};

export type ApiErrorResponse = {
  success: false;
  error: ErrorResponse;
};
