import { AuthResponse, LoginDTO, RegisterUserDTO, User } from '../../models/user/types';

export interface IAuthRepository {
  register(data: RegisterUserDTO): Promise<AuthResponse>;
  login(data: LoginDTO): Promise<AuthResponse>;
  logout(): Promise<void>;
  verifyEmail(token: string): Promise<void>;
  resendVerificationEmail(email: string): Promise<void>;
  /**
   * Refreshes the access token using the refresh token from HTTP-only cookies
   * @throws {UnauthorizedError} When refresh token is invalid or expired
   * @returns New access token (refresh token is set via HTTP-only cookie)
   */
  refreshToken(): Promise<{ accessToken: string }>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
  getCurrentUser(): Promise<User>;
}
