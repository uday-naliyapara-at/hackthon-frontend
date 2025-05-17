import { IAuthRepository } from '../../../domain/interfaces/auth/IAuthRepository';
import { IAuthService } from '../../../domain/interfaces/auth/IAuthService';
import { ISessionService } from '../../../domain/interfaces/auth/ISessionService';
import { Email, Password, UserEntity } from '../../../domain/models/user/User';
import { AuthResponse, LoginDTO, RegisterUserDTO } from '../../../domain/models/user/types';
import { ForgotPasswordError, ValidationError, UnauthorizedError } from './errors';

/**
 * Implements authentication and user management functionality
 */
export class AuthService implements IAuthService {
  private currentUser: UserEntity | null = null;

  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly sessionService: ISessionService
  ) {}

  async register(data: RegisterUserDTO): Promise<AuthResponse> {
    // Validate inputs using domain value objects
    const emailVO = new Email(data.email);
    const passwordVO = new Password(data.password);

    if (!emailVO.isValid()) {
      throw new ValidationError('Invalid email format');
    }
    if (!passwordVO.isValid()) {
      throw new ValidationError('Password does not meet security requirements');
    }

    const response = await this.authRepository.register(data);
    const userEntity = UserEntity.create({
      id: response.user.id,
      email: response.user.email,
      firstName: response.user.firstName,
      lastName: response.user.lastName,
      emailVerified: response.user.emailVerified,
      fullName: `${response.user.firstName} ${response.user.lastName}`,
      role: 'USER',
      teamId: response.user.teamId || 0
    });

    // Skip session initialization since we don't have tokens
    this.currentUser = userEntity;
    return { ...response, user: userEntity };
  }

  async login(credentials: LoginDTO): Promise<UserEntity> {
    // Validate inputs using domain value objects
    const emailVO = new Email(credentials.email);
    const passwordVO = new Password(credentials.password);

    if (!emailVO.isValid()) {
      throw new ValidationError('Invalid email format');
    }
    if (!passwordVO.isValid()) {
      throw new ValidationError('Password does not meet security requirements');
    }

    const response = await this.authRepository.login(credentials);
    
    if (!response.success) {
      throw new UnauthorizedError(response.message || 'Login failed');
    }

    const userEntity = UserEntity.create({
      ...response.user,
      emailVerified: true // Since login succeeded, we can assume email is verified
    });

    // Store the user ID as a temporary session token
    await this.sessionService.initializeSession({
      accessToken: `temp-token-${response.user.id}`,
      refreshToken: undefined
    });
    
    this.currentUser = userEntity;
    return userEntity;
  }

  async logout(): Promise<void> {
    try {
      // Call both repository and session service to ensure proper cleanup
      await Promise.all([this.authRepository.logout(), this.sessionService.clearSession()]);
    } finally {
      // Always clear local state, even if logout fails
      this.currentUser = null;
    }
  }

  /**
   * Initiates password reset process by sending reset instructions to email
   * @throws {ValidationError} When email format is invalid
   * @throws {ForgotPasswordError} When request fails
   */
  async forgotPassword(email: string): Promise<void> {
    // Validate email format
    const emailVO = new Email(email);
    if (!emailVO.isValid()) {
      throw new ValidationError('Invalid email format');
    }

    try {
      await this.authRepository.forgotPassword(email);
    } catch (error) {
      // Wrap repository errors in application-specific error
      throw new ForgotPasswordError(
        'Failed to process password reset request',
        error instanceof Error ? { cause: error.message } : undefined
      );
    }
  }

  /**
   * Resets user's password using the token from email
   * @throws {ValidationError} When password doesn't meet requirements
   * @throws {TokenError} When reset token is invalid or expired
   */
  async resetPassword(token: string, password: string): Promise<void> {
    // Validate password requirements
    const passwordVO = new Password(password);
    if (!passwordVO.isValid()) {
      throw new ValidationError('Password does not meet security requirements');
    }

    await this.authRepository.resetPassword(token, password);
  }

  getCurrentUser(): UserEntity | null {
    return this.currentUser;
  }
}
