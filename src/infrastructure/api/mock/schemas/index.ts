import { authComponents, authPaths } from './auth';
import { chatComponents, chatPaths } from './chat';
import { healthComponents, healthPaths } from './health';
import { modelProviderComponents, modelProviderPaths } from './model-providers';
import { userManagementSchema } from './user-management';

// Get the real API base URL from environment variables
const apiBaseUrl = 'https://hackathon-backend-h5uq.onrender.com/api/public';

// For development, the mock API typically runs on port 5173
const mockServerUrl = 'http://localhost:5173';

// Extract components and paths from user management schema
const userManagementComponents = {
  schemas: userManagementSchema.components.schemas,
};

const userManagementPaths = userManagementSchema.paths;

