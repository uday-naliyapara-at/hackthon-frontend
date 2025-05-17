import { HttpResponse, http } from 'msw';

import { modelProviderStore } from '../../../data/model-provider.store';
import { validateAuth } from '../../../utils/auth.middleware';
import { createErrorResponse } from '../../../utils/auth.utils';
import { PROVIDER_ERRORS } from './constants';

export const updateProviderKeyHandler = http.put(
  '/api/settings/model-providers/:providerId/key',
  async ({ params, request }) => {
    const authResult = await validateAuth(request);
    if (!authResult.isValid) {
      return authResult.response;
    }

    try {
      const { providerId } = params;
      const { key } = (await request.json()) as { key: string };

      if (!key) {
        return HttpResponse.json(
          createErrorResponse(
            PROVIDER_ERRORS.INVALID_API_KEY.code,
            PROVIDER_ERRORS.INVALID_API_KEY.message
          ),
          { status: 400 }
        );
      }

      await modelProviderStore.updateProviderKey(providerId as string, key);
      return new HttpResponse(null, { status: 200 });
    } catch (error) {
      return HttpResponse.json(
        createErrorResponse(
          PROVIDER_ERRORS.PROVIDER_NOT_FOUND.code,
          PROVIDER_ERRORS.PROVIDER_NOT_FOUND.message
        ),
        { status: 404 }
      );
    }
  }
);
