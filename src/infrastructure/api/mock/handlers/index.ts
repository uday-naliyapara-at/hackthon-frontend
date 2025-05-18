import { authHandlers } from './auth';
import { chatHandlers } from './chat';
import { healthHandler } from './health';
import { modelProviderHandlers } from './settings/model-providers';
import { categoriesHandlers } from './categories';

export const handlers = [
  ...authHandlers,
  ...chatHandlers,
  healthHandler,
  ...modelProviderHandlers,
  ...categoriesHandlers,
];
