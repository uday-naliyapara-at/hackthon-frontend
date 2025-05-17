import { Tokens } from '../../models/user/types';
import { User } from '../../models/user/types';

/**
 * Manages user session and token handling
 */
export interface ISessionService {
  /**
   * Initializes a new user session with the provided tokens
   * Stores access token in memory and handles refresh token cookie
   * @throws {TokenError} When token initialization fails
   */
  initializeSession(tokens: Tokens): Promise<void>;

  /**
   * Gets the current access token from memory
   * @returns Access token if exists, null otherwise
   */
  getAccessToken(): string | undefined;

  /**
   * Gets the current refresh token
   * @returns Refresh token if exists, null otherwise
   */
  getRefreshToken(): string | undefined;

  /**
   * Clears the current session
   * Removes access token from memory and refresh token cookie
   */
  clearSession(): Promise<void>;

  /**
   * Refreshes the access token using the refresh token
   * @throws {TokenError} When token refresh fails
   * @throws {UnauthorizedError} When refresh token is invalid
   * @returns The new access token
   */
  refreshAccessToken(): Promise<string>;

  /**
   * Stores new tokens, updating both access and refresh tokens
   * @throws {TokenError} When token storage fails
   */
  storeTokens(tokens: Tokens): Promise<void>;

  /**
   * Checks if the current session is valid by attempting to refresh the token
   * @returns True if session is valid, false otherwise
   */
  checkAuthStatus(): Promise<boolean>;

  /**
   * Validates the current session and returns the user if valid
   * @returns User object if session is valid, null otherwise
   */
  validateSession(): Promise<User | null>;
}
