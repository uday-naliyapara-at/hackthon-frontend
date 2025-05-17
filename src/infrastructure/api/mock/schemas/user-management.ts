/**
 * OpenAPI/Swagger schema definitions for user management endpoints.
 * This file serves as:
 * 1. API Documentation (via Swagger UI)
 * 2. Type definitions for MSW handlers
 * 3. Contract for frontend-backend integration
 */

// Schema Definitions
const UserRole = {
  type: 'string',
  enum: ['Admin', 'User'],
  example: 'User',
};

// New UserStatus enum schema
const UserStatus = {
  type: 'string',
  enum: ['Pending', 'Active', 'Deactive'],
  example: 'Active',
  description: 'User account status',
};

const ExtendedUser = {
  type: 'object',
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
    role: {
      $ref: '#/components/schemas/UserRole',
    },
    status: {
      $ref: '#/components/schemas/UserStatus',
    },
    statusChangedBy: {
      type: 'string',
      nullable: true,
      example: 'System',
      description: 'ID of the user who last changed the status',
    },
    statusChangedAt: {
      type: 'string',
      format: 'date-time',
      nullable: true,
      example: '2023-06-18T09:00:00Z',
      description: 'When the status was last changed',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      example: '2023-06-18T09:00:00Z',
    },
  },
};

const ExtendedUserArray = {
  type: 'array',
  items: {
    $ref: '#/components/schemas/ExtendedUser',
  },
};

const PaginationResponse = {
  type: 'object',
  properties: {
    page: {
      type: 'integer',
      example: 1,
    },
    limit: {
      type: 'integer',
      example: 10,
    },
    totalItems: {
      type: 'integer',
      example: 100,
    },
    totalPages: {
      type: 'integer',
      example: 10,
    },
  },
};

const UsersResponse = {
  type: 'object',
  properties: {
    users: {
      $ref: '#/components/schemas/ExtendedUserArray',
    },
    pagination: {
      $ref: '#/components/schemas/PaginationResponse',
    },
  },
};

const ErrorResponse = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['error'],
      example: 'error',
    },
    message: {
      type: 'string',
      example: 'User not found',
    },
    code: {
      type: 'string',
      example: 'AUTH_010',
      description: 'Error code that identifies the type of error',
    },
  },
  required: ['status', 'message', 'code'],
};

export const userManagementSchema = {
  openapi: '3.0.0',
  info: {
    title: 'User Management API',
    version: '1.0.0',
    description: 'API for managing users and user status',
  },
  components: {
    schemas: {
      UserRole,
      UserStatus,
      ExtendedUser,
      ExtendedUserArray,
      PaginationResponse,
      UsersResponse,
      ErrorResponse,
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT Bearer token',
      },
    },
  },
  paths: {
    '/api/users': {
      get: {
        tags: ['User Management'],
        summary: 'Get a list of users',
        description: 'Returns a paginated list of users with optional filtering and sorting',
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: {
              type: 'integer',
              minimum: 1,
            },
            description: 'Page number for pagination',
          },
          {
            in: 'query',
            name: 'limit',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
            },
            description: 'Number of users per page',
          },
          {
            in: 'query',
            name: 'status',
            schema: {
              type: 'string',
              enum: ['Pending', 'Active', 'Deactive'],
            },
            description: 'Filter users by status',
          },
          {
            in: 'query',
            name: 'sortBy',
            schema: {
              type: 'string',
              enum: ['createdAt', 'firstName', 'lastName', 'email', 'status'],
            },
            description: 'Field to sort by',
          },
          {
            in: 'query',
            name: 'sortOrder',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
            },
            description: 'Sort order (ascending or descending)',
          },
        ],
        responses: {
          '200': {
            description: 'List of users with pagination details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UsersResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid request parameters',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized, authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '403': {
            description: 'Forbidden, admin access required',
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
    '/api/users/{userId}/activate': {
      patch: {
        tags: ['User Management'],
        summary: 'Activate a user',
        description: 'Allows administrators to activate a pending user',
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
            description: 'The user ID to activate',
          },
        ],
        responses: {
          '200': {
            description: 'User activated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ExtendedUser',
                },
              },
            },
          },
          '400': {
            description: 'Invalid request or user already active (Error code: AUTH_012)',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description:
              'Unauthorized - Invalid or missing authentication (Error codes: AUTH_003, AUTH_004)',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '403': {
            description: 'Forbidden - Not an administrator (Error code: AUTH_011)',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'User not found (Error code: AUTH_010)',
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
    '/api/users/{userId}/deactivate': {
      patch: {
        tags: ['User Management'],
        summary: 'Deactivate a user',
        description: 'Allows administrators to deactivate an active user',
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
            description: 'The user ID to deactivate',
          },
        ],
        responses: {
          '200': {
            description: 'User deactivated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ExtendedUser',
                },
              },
            },
          },
          '400': {
            description: 'Invalid request or user already deactivated',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description:
              'Unauthorized - Invalid or missing authentication (Error codes: AUTH_003, AUTH_004)',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '403': {
            description: 'Forbidden - Not an administrator (Error code: AUTH_011)',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'User not found (Error code: AUTH_010)',
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
  },
};
