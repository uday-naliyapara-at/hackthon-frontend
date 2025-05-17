export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class RegistrationError extends AuthError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'REGISTRATION_ERROR', details);
    this.name = 'RegistrationError';
  }
}

export class EmailExistsError extends AuthError {
  constructor() {
    super(`Email already exists`, 'EMAIL_EXISTS');
    this.name = 'EmailExistsError';
  }
}

export class ValidationError extends AuthError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class TokenError extends AuthError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'TOKEN_ERROR', details);
    this.name = 'TokenError';
  }
}

export class TokenExpiredError extends AuthError {
  constructor(message: string = 'Token has expired') {
    super(message, 'TOKEN_EXPIRED');
    this.name = 'TokenExpiredError';
  }
}

export class InvalidTokenError extends AuthError {
  constructor(message: string = 'Invalid token') {
    super(message, 'INVALID_TOKEN');
    this.name = 'InvalidTokenError';
  }
}

export class NetworkError extends AuthError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class RateLimitError extends AuthError {
  constructor(
    message: string,
    public readonly retryAfter?: number
  ) {
    super(message, 'RATE_LIMIT_ERROR', { retryAfter });
    this.name = 'RateLimitError';
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message: string) {
    super(message, 'UNAUTHORIZED_ERROR');
    this.name = 'UnauthorizedError';
  }
}

export class AccountLockedError extends AuthError {
  constructor(
    message: string,
    public readonly lockoutDuration?: number
  ) {
    super(message, 'ACCOUNT_LOCKED_ERROR', { lockoutDuration });
    this.name = 'AccountLockedError';
  }
}

export class AccountNotApprovedError extends AuthError {
  constructor(message: string = 'Your account is pending approval by an administrator') {
    super(message, 'ACCOUNT_NOT_APPROVED_ERROR');
    this.name = 'AccountNotApprovedError';
  }
}

export class AccountDeactivatedError extends AuthError {
  constructor(
    message: string = 'Your account has been deactivated. Please contact an administrator'
  ) {
    super(message, 'ACCOUNT_DEACTIVATED_ERROR');
    this.name = 'AccountDeactivatedError';
  }
}

export class ForgotPasswordError extends AuthError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'FORGOT_PASSWORD_ERROR', details);
    this.name = 'ForgotPasswordError';
  }
}

export class ResetPasswordError extends AuthError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'RESET_PASSWORD_ERROR', details);
    this.name = 'ResetPasswordError';
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor(message: string = 'Invalid email or password') {
    super(message, 'INVALID_CREDENTIALS');
    this.name = 'InvalidCredentialsError';
  }
}
