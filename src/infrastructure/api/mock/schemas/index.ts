import { authComponents, authPaths } from './auth';
import { chatComponents, chatPaths } from './chat';
import { healthComponents, healthPaths } from './health';
import { modelProviderComponents, modelProviderPaths } from './model-providers';
import { userManagementSchema } from './user-management';

// Get the real API base URL from environment variables
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// For development, the mock API typically runs on port 5173
const mockServerUrl = 'http://localhost:5173';

// Extract components and paths from user management schema
const userManagementComponents = {
  schemas: userManagementSchema.components.schemas,
};

const userManagementPaths = userManagementSchema.paths;

export const apiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Efficia API',
    version: '1.0.0',
    description: 'API documentation for Efficia',
  },
  servers: [
    {
      url: apiBaseUrl,
      description: 'Real API Server',
    },
    {
      url: mockServerUrl,
      description: 'Mock API Server (Vite Dev Server)',
    },
  ],
  components: {
    schemas: {
      ...authComponents.schemas,
      ...healthComponents.schemas,
      ...modelProviderComponents.schemas,
      ...chatComponents.schemas,
      ...userManagementComponents.schemas,
    },
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    ...healthPaths,
    ...authPaths,
    ...modelProviderPaths,
    ...chatPaths,
    ...userManagementPaths,
  },
};
