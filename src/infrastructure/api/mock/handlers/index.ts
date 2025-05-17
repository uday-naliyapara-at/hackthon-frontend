import { authHandlers } from './auth';
import { chatHandlers } from './chat';
import { healthHandler } from './health';
import { modelProviderHandlers } from './settings/model-providers';
import { userManagementHandlers } from './user-management';

export const handlers = [
  ...authHandlers,
  healthHandler,
  ...modelProviderHandlers,
  ...chatHandlers,
  ...userManagementHandlers,
];
