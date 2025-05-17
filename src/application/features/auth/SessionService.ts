import { IAuthRepository } from '../../../domain/interfaces/auth/IAuthRepository';
import { ISessionService } from '../../../domain/interfaces/auth/ISessionService';
import { AuthResponse, Tokens, User } from '../../../domain/models/user/types';
import { TokenError, UnauthorizedError } from './errors';

// TODO: AUTH-001 Replace localStorage token storage with a more secure solution
// Current implementation uses localStorage for development purposes only
// Security improvements needed:
// 1. Implement proper token refresh mechanism
// 2. Use HTTP-only cookies for token storage
// 3. Consider implementing a secure token rotation strategy

/**
 * Implements session management and token handling
 * Uses memory storage for access token and relies on HTTP-only cookies for refresh token
 */
export class SessionService implements ISessionService {
  private accessToken?: string;
  private authRepository?: IAuthRepository;

  constructor() {
    // Initialize token from localStorage if exists
    this.accessToken = localStorage.getItem('accessToken') || undefined;
  }

  initialize(authRepository: IAuthRepository): void {
    this.authRepository = authRepository;
  }

  private assertInitialized(): void {
    if (!this.authRepository) {
      throw new Error('SessionService not initialized');
    }
  }

  async initializeSession(tokens: Tokens): Promise<void> {
    if (!tokens?.accessToken) {
      throw new TokenError('Invalid tokens provided');
    }
    try {
      this.setAccessToken(tokens.accessToken);
      if (tokens.refreshToken) {
        this.setRefreshToken(tokens.refreshToken);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new TokenError(`Failed to initialize session: ${error.message}`);
      }
      throw new TokenError('Failed to initialize session');
    }
  }

  getAccessToken(): string | undefined {
    return this.accessToken || localStorage.getItem('accessToken') || undefined;
  }

  async clearSession(): Promise<void> {
    this.accessToken = undefined;
    localStorage.removeItem('accessToken');
  }

  /**
   * Refreshes the access token using the refresh token stored in HTTP-only cookies
   * @throws {UnauthorizedError} When refresh token is invalid or expired
   * @returns The new access token
   */
  async refreshAccessToken(): Promise<string> {
    this.assertInitialized();
    try {
      const response = await this.authRepository!.refreshToken();
      this.setAccessToken(response.accessToken);
      return response.accessToken;
    } catch (error) {
      this.accessToken = undefined;
      localStorage.removeItem('accessToken');

      if (error instanceof UnauthorizedError) {
        throw new TokenError(`Session expired: ${error.message}`);
      }
      if (error instanceof Error) {
        throw new TokenError(`Failed to refresh token: ${error.message}`);
      }
      throw new TokenError('Failed to refresh token');
    }
  }

  private setAccessToken(token: string): void {
    if (!token) {
      throw new TokenError('Invalid access token');
    }
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  getRefreshToken(): string | undefined {
    return undefined;
  }

  async storeTokens(tokens: AuthResponse['tokens']): Promise<void> {
    if (!tokens?.accessToken) {
      throw new TokenError('Invalid tokens provided');
    }
    try {
      await this.initializeSession(tokens);
    } catch (error) {
      if (error instanceof Error) {
        throw new TokenError(`Failed to store tokens: ${error.message}`);
      }
      throw new TokenError('Failed to store tokens');
    }
  }

  async checkAuthStatus(): Promise<boolean> {
    const token = this.getAccessToken();
    return !!token;
  }

  async validateSession(): Promise<User | null> {
    this.assertInitialized();

    if (!(await this.checkAuthStatus())) {
      return null;
    }

    return this.authRepository!.getCurrentUser();
  }
}
