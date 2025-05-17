import { enabledModelsHandler } from './enabled-models';
import { getProvidersHandler } from './get-providers';
import { updateModelStatusHandler } from './update-model-status';
import { updateProviderKeyHandler } from './update-provider-key';
import { validateKeyHandler } from './validate-key';

export const modelProviderHandlers = [
  getProvidersHandler,
  updateProviderKeyHandler,
  updateModelStatusHandler,
  validateKeyHandler,
  enabledModelsHandler,
];
