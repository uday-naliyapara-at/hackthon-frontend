import { AuthResponse, LoginDTO, RegisterUserDTO, User } from '../../models/user/types';

/**
 * Handles core authentication operations
 */
export interface IAuthService {
  /**
   * Registers a new user
   * @throws {EmailExistsError} When email is already registered
   * @throws {ValidationError} When input data is invalid
   */
  register(data: RegisterUserDTO): Promise<AuthResponse>;

  /**
   * Authenticates a user and initializes their session
   * @throws {ValidationError} When credentials are invalid
   * @throws {UnauthorizedError} When email is not verified
   * @throws {AccountLockedError} When account is locked
   * @throws {RateLimitError} When too many attempts are made
   */
  login(credentials: LoginDTO): Promise<User>;

  /**
   * Logs out the current user and clears their session
   */
  logout(): Promise<void>;

  /**
   * Initiates password reset process
   * @throws {ValidationError} When email is invalid
   */
  forgotPassword(email: string): Promise<void>;

  /**
   * Resets user's password
   * @throws {ValidationError} When token or password is invalid
   */
  resetPassword(token: string, password: string): Promise<void>;

  /**
   * Gets the currently authenticated user
   * @returns User if authenticated, null otherwise
   */
  getCurrentUser(): User | null;
}
