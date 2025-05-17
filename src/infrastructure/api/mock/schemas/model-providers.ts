/**
 * OpenAPI/Swagger schema definitions for model provider endpoints.
 * This file serves as:
 * 1. API Documentation (via Swagger UI)
 * 2. Type definitions for MSW handlers
 * 3. Contract for frontend-backend integration
 * 4. Source for generating API client types
 */

// Schema Definitions
const ModelConfig = {
  type: 'object',
  required: ['id', 'name', 'isEnabled', 'providerId', 'capabilities'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      example: '550e8400-e29b-41d4-a716-446655440000',
      description: 'Unique identifier for the model',
    },
    name: {
      type: 'string',
      example: 'GPT-4',
      description: 'Display name of the model',
    },
    isEnabled: {
      type: 'boolean',
      example: true,
      description: 'Whether the model is enabled for use',
    },
    providerId: {
      type: 'string',
      format: 'uuid',
      example: '7a052649-8d0f-4244-a336-89b5f7637af0',
      description: 'ID of the provider this model belongs to',
    },
    capabilities: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['chat', 'completion'],
      },
      example: ['chat', 'completion'],
      description: 'List of capabilities supported by this model',
    },
  },
};

const ModelProvider = {
  type: 'object',
  required: ['id', 'name', 'logo', 'keyStatus', 'models'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      example: '7a052649-8d0f-4244-a336-89b5f7637af0',
      description: 'Unique identifier for the provider',
    },
    name: {
      type: 'string',
      example: 'OpenAI',
      description: 'Display name of the provider',
    },
    logo: {
      type: 'string',
      example: 'https://example.com/openai-logo.png',
      description: "URL to the provider's logo image",
    },
    keyStatus: {
      type: 'string',
      enum: ['not_configured', 'valid', 'invalid', 'expired'],
      example: 'valid',
      description: "Current status of the provider's API key",
    },
    models: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/ModelConfig',
      },
      description: 'List of models available from this provider',
    },
  },
};

const UpdateProviderKeyRequest = {
  type: 'object',
  required: ['key'],
  properties: {
    key: {
      type: 'string',
      minLength: 1,
      example: 'sk-1234567890abcdef',
      description: 'API key for the provider',
    },
  },
};

const UpdateStatusRequest = {
  type: 'object',
  required: ['isEnabled'],
  properties: {
    isEnabled: {
      type: 'boolean',
      example: true,
      description: 'New enabled status',
    },
  },
};

const ValidateKeyRequest = {
  type: 'object',
  required: ['key'],
  properties: {
    key: {
      type: 'string',
      minLength: 1,
      example: 'sk-1234567890abcdef',
      description: 'API key to validate',
    },
  },
};

const ValidateKeyResponse = {
  type: 'object',
  required: ['status'],
  properties: {
    status: {
      type: 'string',
      enum: ['not_configured', 'valid', 'invalid', 'expired'],
      example: 'valid',
      description: 'Validation status of the provided key',
    },
  },
};

const ErrorResponse = {
  type: 'object',
  required: ['code', 'message'],
  properties: {
    code: {
      type: 'string',
      example: 'PROVIDER_001',
      description: 'Error code for client handling',
    },
    message: {
      type: 'string',
      example: 'Provider not found',
      description: 'Human-readable error message',
    },
    details: {
      type: 'object',
      description: 'Additional error context if available',
    },
  },
};

// New schema for enabled models response
const EnabledModelsResponse = {
  type: 'object',
  required: ['models'],
  properties: {
    models: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/ModelConfig',
      },
      description: 'List of all enabled models across providers',
    },
  },
};

// Export Components
export const modelProviderComponents = {
  schemas: {
    ModelConfig,
    ModelProvider,
    UpdateProviderKeyRequest,
    UpdateStatusRequest,
    ValidateKeyRequest,
    ValidateKeyResponse,
    ErrorResponse,
    EnabledModelsResponse,
  },
};

// Export Paths
export const modelProviderPaths = {
  '/api/settings/model-providers': {
    get: {
      tags: ['Model Providers'],
      summary: 'Get all model providers',
      description: 'Retrieves a list of all configured model providers and their models',
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: 'List of model providers successfully retrieved',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/ModelProvider',
                },
              },
              example: [
                {
                  id: '7a052649-8d0f-4244-a336-89b5f7637af0',
                  name: 'OpenAI',
                  logo: 'https://example.com/openai-logo.png',
                  keyStatus: 'valid',
                  models: [
                    {
                      id: '550e8400-e29b-41d4-a716-446655440000',
                      name: 'GPT-4',
                      isEnabled: true,
                      providerId: '7a052649-8d0f-4244-a336-89b5f7637af0',
                      capabilities: ['chat', 'completion'],
                    },
                  ],
                },
              ],
            },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or missing authentication token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'COMMON_001',
                message: 'Unauthorized access',
              },
            },
          },
        },
      },
    },
  },
  '/api/settings/model-providers/{providerId}/key': {
    put: {
      tags: ['Model Providers'],
      summary: 'Update provider API key',
      description: 'Updates the API key for a specific provider',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'providerId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
          example: '7a052649-8d0f-4244-a336-89b5f7637af0',
          description: 'ID of the provider to update',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateProviderKeyRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'API key updated successfully',
        },
        400: {
          description: 'Invalid request - Missing or invalid API key',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'PROVIDER_003',
                message: 'API key is required',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or missing authentication token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'COMMON_001',
                message: 'Unauthorized access',
              },
            },
          },
        },
        404: {
          description: 'Provider not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'PROVIDER_001',
                message: 'Provider not found',
              },
            },
          },
        },
      },
    },
  },
  '/api/settings/model-providers/{providerId}/models/{modelId}/status': {
    put: {
      tags: ['Model Providers'],
      summary: 'Update model enabled status',
      description: 'Enables or disables a specific model for a provider',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'providerId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
          example: '7a052649-8d0f-4244-a336-89b5f7637af0',
          description: 'ID of the provider',
        },
        {
          name: 'modelId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
          example: '550e8400-e29b-41d4-a716-446655440000',
          description: 'ID of the model to update',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateStatusRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Model status updated successfully',
        },
        400: {
          description: 'Invalid request - isEnabled must be a boolean or API key not configured',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              examples: {
                invalidStatus: {
                  value: {
                    code: 'PROVIDER_004',
                    message: 'isEnabled must be a boolean',
                  },
                },
                apiKeyNotConfigured: {
                  value: {
                    code: 'PROVIDER_007',
                    message: 'Cannot enable: API key not configured',
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or missing authentication token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'COMMON_001',
                message: 'Unauthorized access',
              },
            },
          },
        },
        404: {
          description: 'Provider or model not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'PROVIDER_006',
                message: 'Provider or model not found',
              },
            },
          },
        },
      },
    },
  },
  '/api/settings/model-providers/{providerId}/validate-key': {
    post: {
      tags: ['Model Providers'],
      summary: 'Validate provider API key',
      description: 'Validates an API key for a specific provider',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'providerId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
          example: '7a052649-8d0f-4244-a336-89b5f7637af0',
          description: 'ID of the provider',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ValidateKeyRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Key validation result',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidateKeyResponse',
              },
              example: {
                status: 'valid',
              },
            },
          },
        },
        400: {
          description: 'Invalid request - Missing or invalid API key',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'PROVIDER_003',
                message: 'API key is required',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or missing authentication token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'COMMON_001',
                message: 'Unauthorized access',
              },
            },
          },
        },
        404: {
          description: 'Provider not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'PROVIDER_001',
                message: 'Provider not found',
              },
            },
          },
        },
      },
    },
  },
  '/api/settings/enabled-models': {
    get: {
      tags: ['Model Providers'],
      summary: 'Get enabled models',
      description:
        'Retrieves list of all enabled models across providers. Models can be enabled/disabled independently of their provider status.',
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: 'List of enabled models retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['models'],
                properties: {
                  models: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/ModelConfig',
                    },
                    description: 'List of all enabled models across providers',
                  },
                },
              },
              examples: {
                'with-models': {
                  value: {
                    models: [
                      {
                        id: '9b2c0d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e',
                        name: 'GPT-3.5 Turbo',
                        isEnabled: true,
                        providerId: '7a052649-8d0f-4244-a336-89b5f7637af0',
                        capabilities: ['chat'],
                      },
                    ],
                  },
                  summary: 'Response with enabled models',
                },
                'no-models': {
                  value: {
                    models: [],
                  },
                  summary: 'Response when no enabled models found',
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or missing authentication token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'COMMON_001',
                message: 'Unauthorized access',
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'PROVIDER_500',
                message: 'Internal server error occurred',
              },
            },
          },
        },
      },
    },
  },
};
