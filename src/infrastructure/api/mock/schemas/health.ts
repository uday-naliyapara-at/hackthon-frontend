/**
 * OpenAPI/Swagger schema definitions for health check endpoints.
 * This file serves as:
 * 1. API Documentation (via Swagger UI)
 * 2. Type definitions for MSW handlers
 * 3. Health monitoring contract
 */

const HealthResponse = {
  type: 'object',
  required: ['status', 'version', 'timestamp'],
  properties: {
    status: {
      type: 'string',
      enum: ['ok', 'error'],
      description: 'The current status of the API',
    },
    version: {
      type: 'string',
      description: 'The current version of the API',
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
      description: 'The current server timestamp',
    },
  },
};

export const healthComponents = {
  schemas: {
    HealthResponse,
  },
};

export const healthPaths = {
  '/health': {
    get: {
      summary: 'Get API health status',
      tags: ['Health'],
      responses: {
        '200': {
          description: 'Successful health check response',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/HealthResponse',
              },
            },
          },
        },
      },
    },
  },
};
