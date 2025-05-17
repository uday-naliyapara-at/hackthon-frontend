import { HttpResponse, http } from 'msw';

import { ModelProvider } from '@/domain/models/model-provider/types';

import { modelProviderStore } from '../../../data/model-provider.store';
import { validateAuth } from '../../../utils/auth.middleware';
import { createErrorResponse } from '../../../utils/auth.utils';
import { PROVIDER_ERRORS } from './constants';

/**
 * Handler for retrieving enabled models across all providers
 * GET /api/settings/enabled-models
 *
 * Returns all enabled models regardless of their provider's status.
 * This allows models to be enabled/disabled independently of their provider.
 *
 * Edge cases handled:
 * 1. Authentication failure
 * 2. No providers available
 * 3. No enabled models found
 * 4. Provider with no models
 * 5. Invalid model data
 */
export const enabledModelsHandler = http.get(
  '/api/settings/enabled-models',
  async ({ request }) => {
    try {
      // Validate authentication first
      const authResult = await validateAuth(request);
      if (!authResult.isValid) {
        return authResult.response;
      }

      // Get all providers from store
      const providers = await modelProviderStore.getProviders();

      // Handle case when no providers are available
      if (!providers || providers.length === 0) {
        console.debug('No providers available');
        return HttpResponse.json({ models: [] });
      }

      // Get all enabled models from all providers
      const enabledModels = providers.flatMap((provider: ModelProvider) => {
        // Handle case when provider has no models
        if (!provider.models || !Array.isArray(provider.models)) {
          console.warn(`Provider ${provider.name} has no valid models array`);
          return [];
        }

        return provider.models.filter((model) => {
          // Validate model data
          if (!model || typeof model.isEnabled !== 'boolean') {
            console.warn(`Invalid model data in provider ${provider.name}:`, model);
            return false;
          }

          const isEnabled = model.isEnabled;
          console.debug(`Model ${model.name} from ${provider.name}:`, {
            enabled: isEnabled,
            capabilities: model.capabilities,
          });
          return isEnabled;
        });
      });

      console.debug('Returning enabled models:', enabledModels);
      return HttpResponse.json({
        models: enabledModels.map((model) => ({
          id: model.id,
          name: model.name,
          providerId: model.providerId,
          capabilities: model.capabilities,
          isEnabled: model.isEnabled,
        })),
      });
    } catch (error) {
      console.error('Error fetching enabled models:', error);
      return HttpResponse.json(
        createErrorResponse(
          PROVIDER_ERRORS.UNAUTHORIZED.code,
          PROVIDER_ERRORS.UNAUTHORIZED.message
        ),
        { status: 401 }
      );
    }
  }
);
