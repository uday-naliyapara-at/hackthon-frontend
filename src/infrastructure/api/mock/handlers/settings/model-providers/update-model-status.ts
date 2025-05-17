import { HttpResponse, http } from 'msw';

import { modelProviderStore } from '../../../data/model-provider.store';
import { validateAuth } from '../../../utils/auth.middleware';
import { createErrorResponse } from '../../../utils/auth.utils';
import { PROVIDER_ERRORS, PROVIDER_ERROR_MESSAGES } from './constants';

export const updateModelStatusHandler = http.put(
  '/api/settings/model-providers/:providerId/models/:modelId/status',
  async ({ params, request }) => {
    const authResult = await validateAuth(request);
    if (!authResult.isValid) {
      return authResult.response;
    }

    try {
      const { providerId, modelId } = params;
      const { isEnabled } = (await request.json()) as { isEnabled: boolean };

      if (typeof isEnabled !== 'boolean') {
        return HttpResponse.json(
          createErrorResponse(
            PROVIDER_ERRORS.INVALID_STATUS.code,
            PROVIDER_ERRORS.INVALID_STATUS.message
          ),
          { status: 400 }
        );
      }

      await modelProviderStore.updateModelStatus(
        providerId as string,
        modelId as string,
        isEnabled
      );
      return new HttpResponse(null, { status: 200 });
    } catch (error) {
      // Check for specific API key not configured error
      if (
        error instanceof Error &&
        error.message === PROVIDER_ERROR_MESSAGES.MODEL_API_KEY_NOT_CONFIGURED
      ) {
        return HttpResponse.json(
          createErrorResponse(
            PROVIDER_ERRORS.API_KEY_NOT_CONFIGURED.code,
            PROVIDER_ERRORS.API_KEY_NOT_CONFIGURED.message
          ),
          { status: 400 }
        );
      }

      return HttpResponse.json(
        createErrorResponse(
          PROVIDER_ERRORS.PROVIDER_OR_MODEL_NOT_FOUND.code,
          PROVIDER_ERRORS.PROVIDER_OR_MODEL_NOT_FOUND.message
        ),
        { status: 404 }
      );
    }
  }
);
