import { HttpResponse, http } from 'msw';

import { modelProviderStore } from '../../../data/model-provider.store';
import { validateAuth } from '../../../utils/auth.middleware';

export const getProvidersHandler = http.get(
  '/api/settings/model-providers',
  async ({ request }) => {
    const authResult = await validateAuth(request);
    if (!authResult.isValid) {
      return authResult.response;
    }

    const providers = await modelProviderStore.getProviders();

    // Validate that API keys are included for providers with valid status
    providers.forEach((provider) => {
      if (provider.keyStatus === 'valid' && !provider.apiKey) {
        console.warn(`Provider ${provider.id} has valid status but no API key`);
      }
    });

    console.debug('Returning providers:', providers);
    return HttpResponse.json(providers);
  }
);
