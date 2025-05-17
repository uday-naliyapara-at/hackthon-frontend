/**
 * OpenAPI/Swagger schema definitions for authentication endpoints.
 * This file serves as:
 * 1. API Documentation (via Swagger UI)
 * 2. Type definitions for MSW handlers
 * 3. Contract for frontend-backend integration
 * 4. Source for generating API client types
 */

// Schema Definitions
const RegisterRequest = {
  type: 'object',
  required: ['email', 'password', 'firstName', 'lastName'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
      example: 'user@example.com',
    },
    password: {
      type: 'string',
      minLength: 8,
      example: 'StrongP@ss123',
    },
    firstName: {
      type: 'string',
      minLength: 1,
      example: 'John',
    },
    lastName: {
      type: 'string',
      minLength: 1,
      example: 'Doe',
    },
  },
};

const LoginRequest = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
      example: 'user@example.com',
    },
    password: {
      type: 'string',
      example: 'StrongP@ss123',
    },
  },
  examples: {
    validUser: {
      summary: 'Valid user credentials',
      value: {
        email: 'test@example.com',
        password: 'StrongP@ss123',
      },
    },
    unverifiedUser: {
      summary: 'Unverified user credentials',
      value: {
        email: 'unverified@example.com',
        password: 'StrongP@ss123',
      },
    },
    lockedUser: {
      summary: 'Locked user credentials',
      value: {
        email: 'locked@example.com',
        password: 'StrongP@ss123',
      },
    },
    existingUser: {
      summary: 'Existing user credentials',
      value: {
        email: 'existing@example.com',
        password: 'StrongP@ss123',
      },
    },
  },
};

const User = {
  type: 'object',
  required: ['id', 'email', 'firstName', 'lastName', 'emailVerified'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      example: '550e8400-e29b-41d4-a716-446655440000',
    },
    email: {
      type: 'string',
      format: 'email',
      example: 'user@example.com',
    },
    firstName: {
      type: 'string',
      example: 'John',
    },
    lastName: {
      type: 'string',
      example: 'Doe',
    },
    emailVerified: {
      type: 'boolean',
      example: false,
    },
  },
};

const Tokens = {
  type: 'object',
  required: ['accessToken'],
  properties: {
    accessToken: {
      type: 'string',
      description: 'JWT access token',
    },
    refreshToken: {
      type: 'string',
      description: 'JWT refresh token (sent as HttpOnly cookie)',
    },
  },
};

const AuthResponse = {
  type: 'object',
  required: ['user', 'tokens'],
  properties: {
    user: {
      $ref: '#/components/schemas/User',
    },
    tokens: {
      $ref: '#/components/schemas/Tokens',
    },
  },
  headers: {
    'Set-Cookie': {
      schema: {
        type: 'string',
        example: 'token=mock-refresh-token-123; HttpOnly; Path=/; SameSite=Lax; Domain=localhost',
      },
      description: 'HttpOnly cookie containing refresh token',
    },
  },
};

const ErrorResponse = {
  type: 'object',
  required: ['code', 'message'],
  properties: {
    code: {
      type: 'string',
      enum: [
        'AUTH_001', // Invalid credentials
        'AUTH_002', // Email exists
        'AUTH_003', // Email not verified
        'AUTH_004', // Account locked
        'AUTH_005', // Invalid token
        'AUTH_006', // Token expired
        'AUTH_007', // Account pending activation
        'AUTH_008', // Account deactivated
        'AUTH_009', // User not found
        'AUTH_010', // Unauthorized
        'AUTH_012', // User already activated
        'SERVER_ERROR',
      ],
      example: 'AUTH_001',
    },
    message: {
      type: 'string',
      examples: [
        'Invalid email or password',
        'Email already registered',
        'Email not verified',
        'Account temporarily locked. Try again later',
        'Invalid or expired token',
        'Token has expired',
        'Your account is awaiting activation by an administrator',
        'Your account has been deactivated. Please contact an administrator',
        'User not found',
        'Unauthorized access',
        'User is already activated',
        'An unexpected error occurred',
      ],
    },
    details: {
      type: 'object',
    },
  },
};

const RefreshTokenRequest = {
  type: 'object',
  description: 'Not required - refresh token is sent via HttpOnly cookie',
  properties: {},
};

const TokenResponse = {
  type: 'object',
  required: ['accessToken'],
  properties: {
    accessToken: {
      type: 'string',
      example: 'mock-access-token-123-1707307200000',
      description: 'JWT access token',
    },
  },
  headers: {
    'Set-Cookie': {
      schema: {
        type: 'string',
        example: 'token=mock-refresh-token-123; HttpOnly; Path=/; SameSite=Lax; Domain=localhost',
      },
      description: 'HttpOnly cookie containing refresh token',
    },
  },
};

const ForgotPasswordRequest = {
  type: 'object',
  required: ['email'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
      example: 'user@example.com',
    },
  },
};

const ResetPasswordRequest = {
  type: 'object',
  required: ['password'],
  properties: {
    password: {
      type: 'string',
      minLength: 8,
      example: 'NewStrongP@ss123',
    },
  },
};

const SuccessResponse = {
  type: 'object',
  required: ['success', 'message'],
  properties: {
    success: {
      type: 'boolean',
      example: true,
    },
    message: {
      type: 'string',
      example: 'Operation completed successfully',
    },
  },
};

const ResendVerificationRequest = {
  type: 'object',
  required: ['email'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
      example: 'user@example.com',
    },
  },
};

const VerifyEmailRequest = {
  type: 'object',
  required: ['token'],
  properties: {
    token: {
      type: 'string',
      example: 'mock-verification-token-123',
    },
  },
};

// Export Components
export const authComponents = {
  schemas: {
    RegisterRequest,
    LoginRequest,
    AuthResponse,
    ErrorResponse,
    RefreshTokenRequest,
    TokenResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    SuccessResponse,
    ResendVerificationRequest,
    VerifyEmailRequest,
    User,
    Tokens,
  },
};

// Export Paths
export const authPaths = {
  '/api/auth/signup': {
    post: {
      tags: ['Auth'],
      summary: 'Register new user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RegisterRequest',
            },
            examples: {
              default: {
                value: {
                  email: 'user@example.com',
                  password: 'StrongP@ss123',
                  firstName: 'John',
                  lastName: 'Doe',
                },
              },
              invalidEmail: {
                value: {
                  email: 'invalid-email',
                  password: 'StrongP@ss123',
                  firstName: 'John',
                  lastName: 'Doe',
                },
              },
              weakPassword: {
                value: {
                  email: 'user@example.com',
                  password: '123',
                  firstName: 'John',
                  lastName: 'Doe',
                },
              },
              missingName: {
                value: {
                  email: 'user@example.com',
                  password: 'StrongP@ss123',
                  firstName: '',
                  lastName: 'Doe',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'User registered successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse',
              },
              examples: {
                default: {
                  value: {
                    user: {
                      id: '550e8400-e29b-41d4-a716-446655440000',
                      email: 'user@example.com',
                      firstName: 'John',
                      lastName: 'Doe',
                      emailVerified: false,
                    },
                    tokens: {
                      accessToken: 'mock-access-token-123-1707307200000',
                      refreshToken: 'mock-refresh-token-123-1707307200000',
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Invalid input',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              examples: {
                invalidEmail: {
                  value: {
                    code: 'COMMON_400',
                    message: 'Invalid email format',
                  },
                },
                weakPassword: {
                  value: {
                    code: 'COMMON_400',
                    message: 'Password must be at least 8 characters long',
                  },
                },
                missingFirstName: {
                  value: {
                    code: 'COMMON_400',
                    message: 'First name is required',
                  },
                },
                missingLastName: {
                  value: {
                    code: 'COMMON_400',
                    message: 'Last name is required',
                  },
                },
                emailExists: {
                  value: {
                    code: 'AUTH_002',
                    message: 'Email already registered',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Login user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginRequest',
            },
            examples: {
              validUser: {
                summary: 'Valid user credentials',
                value: {
                  email: 'test@example.com',
                  password: 'StrongP@ss123',
                },
                description: 'Login with a verified user account',
              },
              unverifiedUser: {
                summary: 'Unverified user credentials',
                value: {
                  email: 'unverified@example.com',
                  password: 'StrongP@ss123',
                },
                description: 'Login attempt with an unverified email account (will return 403)',
              },
              lockedUser: {
                summary: 'Locked user credentials',
                value: {
                  email: 'locked@example.com',
                  password: 'StrongP@ss123',
                },
                description: 'Login attempt with a locked account (will return 403)',
              },
              existingUser: {
                summary: 'Existing user credentials',
                value: {
                  email: 'existing@example.com',
                  password: 'StrongP@ss123',
                },
                description: 'Login with another verified user account',
              },
            },
          },
        },
      },
      responses: {
        200: {
          description:
            'Login successful. Returns user data and access token in body, refresh token as HttpOnly cookie.',
          headers: {
            'Set-Cookie': {
              schema: {
                type: 'string',
                example:
                  'token=mock-refresh-token-123; HttpOnly; Path=/; SameSite=Lax; Domain=localhost',
              },
              description: 'HttpOnly cookie containing refresh token',
            },
          },
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse',
              },
              examples: {
                default: {
                  value: {
                    user: {
                      id: '550e8400-e29b-41d4-a716-446655440000',
                      email: 'user@example.com',
                      firstName: 'John',
                      lastName: 'Doe',
                      emailVerified: true,
                    },
                    tokens: {
                      accessToken: 'mock-access-token-123-1707307200000',
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Invalid credentials',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              examples: {
                invalidCredentials: {
                  value: {
                    code: 'AUTH_001',
                    message: 'Invalid email or password',
                  },
                },
              },
            },
          },
        },
        403: {
          description: 'Account locked, email not verified, or account status issues',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              examples: {
                emailNotVerified: {
                  value: {
                    code: 'AUTH_003',
                    message: 'Email not verified',
                  },
                },
                accountLocked: {
                  value: {
                    code: 'AUTH_004',
                    message: 'Account temporarily locked. Try again later',
                  },
                },
                accountPending: {
                  value: {
                    code: 'AUTH_007',
                    message: 'Your account is awaiting activation by an administrator',
                  },
                },
                accountDeactivated: {
                  value: {
                    code: 'AUTH_008',
                    message: 'Your account has been deactivated. Please contact an administrator',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/auth/logout': {
    post: {
      tags: ['Auth'],
      summary: 'Logout user and invalidate tokens',
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: 'Logged out successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
      },
    },
  },
  '/api/auth/refresh': {
    post: {
      tags: ['Auth'],
      summary: 'Refresh access token using HttpOnly cookie',
      description:
        'Uses the refresh token stored in an HttpOnly cookie to generate a new access token',
      parameters: [
        {
          name: 'Cookie',
          in: 'header',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'HttpOnly cookie containing refresh token',
        },
      ],
      responses: {
        200: {
          description: 'New access token generated successfully',
          headers: {
            'Set-Cookie': {
              schema: {
                type: 'string',
                example:
                  'token=mock-refresh-token-123; HttpOnly; Path=/; SameSite=Lax; Domain=localhost',
              },
              description: 'HttpOnly cookie containing new refresh token',
            },
          },
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['accessToken'],
                properties: {
                  accessToken: {
                    type: 'string',
                    example: 'mock-access-token-123-1707307200000',
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Invalid or expired refresh token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
      },
    },
  },
  '/api/auth/verify-email': {
    post: {
      tags: ['Auth'],
      summary: 'Verify user email address',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/VerifyEmailRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Email verified successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse',
              },
            },
          },
        },
        400: {
          description: 'Invalid or expired token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
      },
    },
  },
  '/api/auth/forgot-password': {
    post: {
      tags: ['Auth'],
      summary: 'Request password reset link',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ForgotPasswordRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password reset email sent successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse',
              },
            },
          },
        },
        400: {
          description: 'Invalid email or user not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
      },
    },
  },
  '/api/auth/reset-password': {
    post: {
      tags: ['Auth'],
      summary: 'Reset password using token',
      parameters: [
        {
          name: 'token',
          in: 'query',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'Password reset token received via email',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ResetPasswordRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password reset successful',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse',
              },
            },
          },
        },
        400: {
          description: 'Invalid or expired token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
      },
    },
  },
  '/api/auth/resend-verification': {
    post: {
      tags: ['Auth'],
      summary: 'Resend email verification link',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ResendVerificationRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Verification email sent successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse',
              },
            },
          },
        },
        400: {
          description: 'Invalid email or user not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
      },
    },
  },
};

export const authSchemas = {
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'firstName', 'lastName'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'user@example.com',
                  },
                  password: {
                    type: 'string',
                    minLength: 8,
                    example: 'StrongP@ss123',
                  },
                  firstName: {
                    type: 'string',
                    minLength: 1,
                    example: 'John',
                  },
                  lastName: {
                    type: 'string',
                    minLength: 1,
                    example: 'Doe',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      $ref: '#/components/schemas/User',
                    },
                    tokens: {
                      $ref: '#/components/schemas/Tokens',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid request or email already exists',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginRequest',
              },
              examples: {
                validUser: {
                  summary: 'Valid user credentials',
                  value: {
                    email: 'test@example.com',
                    password: 'StrongP@ss123',
                  },
                  description: 'Login with a verified user account',
                },
                unverifiedUser: {
                  summary: 'Unverified user credentials',
                  value: {
                    email: 'unverified@example.com',
                    password: 'StrongP@ss123',
                  },
                  description: 'Login attempt with an unverified email account (will return 403)',
                },
                lockedUser: {
                  summary: 'Locked user credentials',
                  value: {
                    email: 'locked@example.com',
                    password: 'StrongP@ss123',
                  },
                  description: 'Login attempt with a locked account (will return 403)',
                },
                existingUser: {
                  summary: 'Existing user credentials',
                  value: {
                    email: 'existing@example.com',
                    password: 'StrongP@ss123',
                  },
                  description: 'Login with another verified user account',
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      $ref: '#/components/schemas/User',
                    },
                    tokens: {
                      $ref: '#/components/schemas/Tokens',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '403': {
            description: 'Account locked, email not verified, or account status issues',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/verify-email': {
      post: {
        tags: ['Auth'],
        summary: 'Verify user email address',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/VerifyEmailRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Email verified successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid or expired token',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/resend-verification': {
      post: {
        tags: ['Auth'],
        summary: 'Resend email verification link',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ResendVerificationRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Verification email sent successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid email or user not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Request password reset link',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'user@example.com',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Password reset email sent successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset password using token',
        parameters: [
          {
            name: 'token',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Password reset token received via email',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['password'],
                properties: {
                  password: {
                    type: 'string',
                    minLength: 8,
                    example: 'NewStrongP@ss123',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Password reset successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid or expired token',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout user and invalidate tokens',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Logged out successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        description:
          'Uses the refresh token stored in an HttpOnly cookie to generate a new access token',
        parameters: [
          {
            name: 'Cookie',
            in: 'header',
            required: true,
            schema: {
              type: 'string',
              example: 'token=mock-refresh-token-123-1707307200000',
            },
            description: 'HttpOnly cookie containing refresh token',
          },
        ],
        responses: {
          '200': {
            description: 'New access token generated successfully',
            headers: {
              'Set-Cookie': {
                schema: {
                  type: 'string',
                  example:
                    'token=mock-refresh-token-123; HttpOnly; Path=/; SameSite=Lax; Domain=localhost',
                },
                description: 'HttpOnly cookie containing new refresh token',
              },
            },
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['accessToken'],
                  properties: {
                    accessToken: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Invalid or expired refresh token',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          email: {
            type: 'string',
            format: 'email',
          },
          firstName: {
            type: 'string',
          },
          lastName: {
            type: 'string',
          },
          emailVerified: {
            type: 'boolean',
          },
        },
      },
      Tokens: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
          },
          refreshToken: {
            type: 'string',
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
          details: {
            type: 'object',
            additionalProperties: true,
          },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
          },
          message: {
            type: 'string',
          },
        },
      },
    },
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
