import {
  AccountDeactivatedError,
  AccountLockedError,
  AccountNotApprovedError,
  EmailExistsError,
  InvalidCredentialsError,
  InvalidTokenError,
  RateLimitError,
  TokenExpiredError,
  UnauthorizedError,
  ValidationError,
} from '../../../application/features/auth/errors/index';
import {
  ForgotPasswordError,
  RegistrationError,
  ResetPasswordError,
} from '../../../application/features/auth/errors/index';
import { IAuthRepository } from '../../../domain/interfaces/auth';
import { AuthResponse, LoginDTO, RegisterUserDTO, User } from '../../../domain/models/user/types';
import { IHttpClient } from '../../utils/http/types';
import { BaseErrorResponse, BaseRepository, HttpStatusCode } from '../BaseRepository';

// Auth-specific error codes
export enum AuthErrorCode {
  // Registration errors
  EMAIL_EXISTS = 'AUTH_001',
  INVALID_INPUT = 'AUTH_002',

  // Token errors
  TOKEN_EXPIRED = 'AUTH_003',
  INVALID_TOKEN = 'AUTH_004',
  INVALID_REFRESH_TOKEN = 'AUTH_005',

  // Authentication errors
  INVALID_CREDENTIALS = 'AUTH_006',
  ACCOUNT_PENDING = 'AUTH_007',
  ACCOUNT_DEACTIVATED = 'AUTH_008',
  INVALID_SESSION = 'AUTH_009',
  ACCOUNT_LOCKED = 'AUTH_016',

  // User errors
  USER_NOT_FOUND = 'AUTH_010',
  UNAUTHORIZED = 'AUTH_011',
  USER_ALREADY_ACTIVATED = 'AUTH_012',
  USER_ALREADY_DEACTIVATED = 'AUTH_013',

  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'AUTH_014',

  // Token blacklist error
  TOKEN_BLACKLIST_ERROR = 'AUTH_015',

  // Maintain backward compatibility with common error
  COMMON_RATE_LIMIT = 'COMMON_002',
}

export class AuthRepository extends BaseRepository implements IAuthRepository {
  private readonly baseUrl = '/auth';

  constructor(httpClient: IHttpClient) {
    super(httpClient);
  }

  protected override handleErrorCode(code: string, message: string): Error | null {
    switch (code) {
      case AuthErrorCode.INVALID_CREDENTIALS:
        return new InvalidCredentialsError(message);
      case AuthErrorCode.EMAIL_EXISTS:
        return new EmailExistsError();
      case AuthErrorCode.TOKEN_EXPIRED:
        return new TokenExpiredError(message);
      case AuthErrorCode.INVALID_TOKEN:
      case AuthErrorCode.INVALID_REFRESH_TOKEN:
      case AuthErrorCode.TOKEN_BLACKLIST_ERROR:
        return new InvalidTokenError(message);
      case AuthErrorCode.ACCOUNT_LOCKED:
        return new AccountLockedError(message, 15 * 60);
      case AuthErrorCode.ACCOUNT_PENDING:
        return new AccountNotApprovedError(message);
      case AuthErrorCode.ACCOUNT_DEACTIVATED:
        return new AccountDeactivatedError(message);
      case AuthErrorCode.RATE_LIMIT_EXCEEDED:
      case AuthErrorCode.COMMON_RATE_LIMIT:
        return new RateLimitError(message);
      case AuthErrorCode.INVALID_INPUT:
        return new ValidationError(message, {
          field: 'password',
          code: 'INVALID_PASSWORD',
          requirements: {
            minLength: 8,
            needsUppercase: true,
            needsNumber: true,
          },
        });
      case AuthErrorCode.USER_NOT_FOUND:
        return new ValidationError(message, { code: 'USER_NOT_FOUND' });
      case AuthErrorCode.UNAUTHORIZED:
        return new UnauthorizedError(message);
      case AuthErrorCode.USER_ALREADY_ACTIVATED:
        return new ValidationError(message, { code: 'USER_ALREADY_ACTIVATED' });
      case AuthErrorCode.USER_ALREADY_DEACTIVATED:
        return new ValidationError(message, { code: 'USER_ALREADY_DEACTIVATED' });
      case AuthErrorCode.INVALID_SESSION:
        return new UnauthorizedError(message);
      default:
        return null;
    }
  }

  protected override handleErrorResponse(errorData: BaseErrorResponse): Error {
    // First try error codes
    if (errorData.code) {
      const error = this.handleErrorCode(errorData.code, errorData.message);
      if (error) return error;
    }

    // Then handle auth-specific status codes
    if (errorData.status) {
      switch (errorData.status) {
        case HttpStatusCode.TOO_MANY_REQUESTS:
          return new RateLimitError('Too many attempts. Try again later');
        case HttpStatusCode.CONFLICT:
          return new EmailExistsError();
        case HttpStatusCode.FORBIDDEN:
          return new UnauthorizedError('Email not verified');
      }
    }

    // Fallback to base error handling
    return super.handleErrorResponse(errorData);
  }

  async register(data: RegisterUserDTO): Promise<AuthResponse> {
    try {
      const response = await this.httpClient.post<any>(`${this.baseUrl}/signup`, data);
      
      // Adapt the API response to match AuthResponse format
      if (response.success) {
        return {
          success: response.success,
          message: response.message,
          user: {
            id: response.data.id || crypto.randomUUID(), // Generate a temporary ID if not provided
            email: response.data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            emailVerified: false,
            fullName: `${data.firstName} ${data.lastName}`,
            role: 'USER',
            teamId: data.teamId || 0
          }
        };
      }
      
      throw new Error('Invalid response format from server');
    } catch (error) {
      const parsedError = this.handleError(error);
      if (parsedError instanceof ValidationError) {
        throw new RegistrationError(parsedError.message, parsedError.details);
      }
      throw parsedError;
    }
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    try {
      // Mark as auth request (true) to skip token refresh
      return await this.httpClient.post<AuthResponse>(`${this.baseUrl}/login`, data, true);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.httpClient.post(`${this.baseUrl}/logout`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      await this.httpClient.post(`${this.baseUrl}/verify-email`, { token });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resendVerificationEmail(email: string): Promise<void> {
    try {
      await this.httpClient.post(`${this.baseUrl}/resend-verification`, { email });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    try {
      return await this.httpClient.post<{ accessToken: string }>(`${this.baseUrl}/refresh`, {});
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Initiates password reset process by sending reset instructions to email
   * @throws {ValidationError} When email format is invalid
   * @throws {NetworkError} When server is unreachable
   * @throws {ForgotPasswordError} When request fails
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      await this.httpClient.post(`${this.baseUrl}/forgot-password`, { email });
    } catch (error) {
      const parsedError = this.handleError(error);
      // Convert to specific forgot password errors
      if (
        parsedError instanceof ValidationError ||
        parsedError instanceof InvalidCredentialsError
      ) {
        throw new ForgotPasswordError(
          parsedError.message,
          parsedError instanceof ValidationError ? parsedError.details : undefined
        );
      }
      throw parsedError;
    }
  }

  /**
   * Resets user's password using the token from email
   * @throws {ValidationError} When password doesn't meet requirements
   * @throws {TokenError} When reset token is invalid or expired
   * @throws {NetworkError} When server is unreachable
   */
  async resetPassword(token: string, password: string): Promise<void> {
    try {
      await this.httpClient.post(`${this.baseUrl}/reset-password`, { token, password });
    } catch (error) {
      const parsedError = this.handleError(error);
      // Convert to specific reset password errors
      if (parsedError instanceof ValidationError) {
        throw new ResetPasswordError(parsedError.message, parsedError.details);
      }
      throw parsedError;
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.httpClient.get<{ user: User }>(`${this.baseUrl}/me`);
      return response.user;
    } catch (error) {
      console.log('error from getCurrentUser ', error);
      throw this.handleError(error);
    }
  }
}
