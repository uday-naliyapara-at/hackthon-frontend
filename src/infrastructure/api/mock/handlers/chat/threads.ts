import { HttpResponse, http } from 'msw';

import { chatStore } from '../../data/chat.store';
import { ChatThread } from '../../types/chat';
import { validateAuth } from '../../utils/auth.middleware';
import { createErrorResponse, getUserIdFromAuthHeader } from '../../utils/auth.utils';
import { CHAT_ERRORS } from './constants';

/**
 * Handler for getting chat threads
 * GET /api/chat/threads
 *
 * Handles:
 * 1. Authentication validation
 * 2. Retrieving all threads for the user
 * 3. Error scenarios
 */
export const getThreadsHandler = http.get('/api/chat/threads', async ({ request }) => {
  try {
    // Validate authentication
    const authResult = await validateAuth(request);
    if (!authResult.isValid) {
      return authResult.response;
    }

    // Get user ID from token
    const userId = await getUserIdFromAuthHeader(request.headers.get('Authorization'));
    if (!userId) {
      return HttpResponse.json(
        createErrorResponse(
          CHAT_ERRORS.UNAUTHORIZED_ACCESS.code,
          CHAT_ERRORS.UNAUTHORIZED_ACCESS.message
        ),
        { status: 401 }
      );
    }

    // Get all threads for this user
    const threads = await chatStore.getAllThreads(userId);

    // Sort threads by updatedAt (newest first)
    threads.sort(
      (a: ChatThread, b: ChatThread) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return HttpResponse.json(threads);
  } catch (error) {
    console.error('Error in get threads handler:', error);
    return HttpResponse.json(
      createErrorResponse(CHAT_ERRORS.SERVER_ERROR.code, CHAT_ERRORS.SERVER_ERROR.message),
      { status: 500 }
    );
  }
});

/**
 * Handler for getting a specific thread
 * GET /api/chat/threads/:id
 *
 * Handles:
 * 1. Authentication validation
 * 2. Thread existence validation
 * 3. User ownership validation
 * 4. Retrieving thread details
 * 5. Error scenarios
 */
export const getThreadHandler = http.get('/api/chat/threads/:id', async ({ request, params }) => {
  try {
    // Validate authentication
    const authResult = await validateAuth(request);
    if (!authResult.isValid) {
      return authResult.response;
    }

    // Get user ID from token
    const userId = await getUserIdFromAuthHeader(request.headers.get('Authorization'));
    if (!userId) {
      return HttpResponse.json(
        createErrorResponse(
          CHAT_ERRORS.UNAUTHORIZED_ACCESS.code,
          CHAT_ERRORS.UNAUTHORIZED_ACCESS.message
        ),
        { status: 401 }
      );
    }

    const threadId = params.id as string;

    // Get thread
    const thread = await chatStore.getThread(threadId);
    if (!thread) {
      return HttpResponse.json(
        createErrorResponse(
          CHAT_ERRORS.THREAD_NOT_FOUND.code,
          CHAT_ERRORS.THREAD_NOT_FOUND.message
        ),
        { status: 404 }
      );
    }

    // Verify thread ownership
    if (thread.userId !== userId) {
      return HttpResponse.json(
        createErrorResponse(
          CHAT_ERRORS.UNAUTHORIZED_THREAD_ACCESS.code,
          CHAT_ERRORS.UNAUTHORIZED_THREAD_ACCESS.message
        ),
        { status: 403 }
      );
    }

    // Get messages for this thread
    const messages = await chatStore.getThreadMessages(threadId);

    return HttpResponse.json({
      thread,
      messages,
    });
  } catch (error) {
    console.error('Error in get thread handler:', error);
    return HttpResponse.json(
      createErrorResponse(CHAT_ERRORS.SERVER_ERROR.code, CHAT_ERRORS.SERVER_ERROR.message),
      { status: 500 }
    );
  }
});

/**
 * Handler for renaming a thread title
 * PATCH /api/chat/threads/:threadId/title
 *
 * Handles:
 * 1. Authentication validation
 * 2. Thread existence validation
 * 3. User ownership validation
 * 4. Title validation
 * 5. Thread update
 * 6. Error scenarios
 */
export const renameThreadHandler = http.patch(
  '/api/chat/threads/:threadId/title',
  async ({ request, params }) => {
    try {
      // Validate authentication
      const authResult = await validateAuth(request);
      if (!authResult.isValid) {
        return authResult.response;
      }

      // Get user ID from token
      const userId = await getUserIdFromAuthHeader(request.headers.get('Authorization'));
      if (!userId) {
        return HttpResponse.json(
          createErrorResponse(
            CHAT_ERRORS.UNAUTHORIZED_ACCESS.code,
            CHAT_ERRORS.UNAUTHORIZED_ACCESS.message
          ),
          { status: 401 }
        );
      }

      const threadId = params.threadId as string;

      // Get thread
      const thread = await chatStore.getThread(threadId);
      if (!thread) {
        return HttpResponse.json(
          createErrorResponse(
            CHAT_ERRORS.THREAD_NOT_FOUND.code,
            CHAT_ERRORS.THREAD_NOT_FOUND.message
          ),
          { status: 404 }
        );
      }

      // Verify thread ownership
      if (thread.userId !== userId) {
        return HttpResponse.json(
          createErrorResponse(
            CHAT_ERRORS.UNAUTHORIZED_THREAD_ACCESS.code,
            CHAT_ERRORS.UNAUTHORIZED_THREAD_ACCESS.message
          ),
          { status: 403 }
        );
      }

      // Parse request body
      const requestData = (await request.json()) as { newTitle: string };
      const { newTitle } = requestData;

      // Validate title
      if (!newTitle || newTitle.trim().length === 0) {
        return HttpResponse.json(
          createErrorResponse(CHAT_ERRORS.INVALID_TITLE.code, CHAT_ERRORS.INVALID_TITLE.message),
          { status: 400 }
        );
      }

      if (newTitle.length > 255) {
        return HttpResponse.json(
          createErrorResponse(
            CHAT_ERRORS.INVALID_TITLE.code,
            'Thread title exceeds maximum length of 255 characters'
          ),
          { status: 400 }
        );
      }

      // Update thread
      const updatedThread = await chatStore.updateThread(threadId, { title: newTitle });

      return HttpResponse.json(updatedThread);
    } catch (error) {
      console.error('Error in rename thread handler:', error);
      return HttpResponse.json(
        createErrorResponse(CHAT_ERRORS.SERVER_ERROR.code, CHAT_ERRORS.SERVER_ERROR.message),
        { status: 500 }
      );
    }
  }
);

/**
 * Handler for deleting a thread
 * DELETE /api/chat/threads/:threadId
 *
 * Handles:
 * 1. Authentication validation
 * 2. Thread existence validation
 * 3. User ownership validation
 * 4. Thread deletion
 * 5. Error scenarios
 */
export const deleteThreadHandler = http.delete(
  '/api/chat/threads/:threadId',
  async ({ request, params }) => {
    try {
      // Validate authentication
      const authResult = await validateAuth(request);
      if (!authResult.isValid) {
        return authResult.response;
      }

      // Get user ID from token
      const userId = await getUserIdFromAuthHeader(request.headers.get('Authorization'));
      if (!userId) {
        return HttpResponse.json(
          createErrorResponse(
            CHAT_ERRORS.UNAUTHORIZED_ACCESS.code,
            CHAT_ERRORS.UNAUTHORIZED_ACCESS.message
          ),
          { status: 401 }
        );
      }

      const threadId = params.threadId as string;

      // Get thread
      const thread = await chatStore.getThread(threadId);
      if (!thread) {
        return HttpResponse.json(
          createErrorResponse(
            CHAT_ERRORS.THREAD_NOT_FOUND.code,
            CHAT_ERRORS.THREAD_NOT_FOUND.message
          ),
          { status: 404 }
        );
      }

      // Verify thread ownership
      if (thread.userId !== userId) {
        return HttpResponse.json(
          createErrorResponse(
            CHAT_ERRORS.UNAUTHORIZED_THREAD_ACCESS.code,
            CHAT_ERRORS.UNAUTHORIZED_THREAD_ACCESS.message
          ),
          { status: 403 }
        );
      }

      // Delete the thread
      await chatStore.deleteThread(threadId);

      // Return success with no content
      return new HttpResponse(null, { status: 204 });
    } catch (error) {
      console.error('Error in delete thread handler:', error);
      return HttpResponse.json(
        createErrorResponse(CHAT_ERRORS.SERVER_ERROR.code, CHAT_ERRORS.SERVER_ERROR.message),
        { status: 500 }
      );
    }
  }
);

/**
 * Handler for updating a thread's model
 * PUT /api/chat/threads/:threadId/model
 *
 * Handles:
 * 1. Authentication validation
 * 2. Thread existence validation
 * 3. User ownership validation
 * 4. Model ID validation
 * 5. Thread update
 * 6. Error scenarios
 */
export const updateThreadModelHandler = http.put(
  '/api/chat/threads/:threadId/model',
  async ({ request, params }) => {
    try {
      // Validate authentication
      const authResult = await validateAuth(request);
      if (!authResult.isValid) {
        return authResult.response;
      }

      // Get user ID from token
      const userId = await getUserIdFromAuthHeader(request.headers.get('Authorization'));
      if (!userId) {
        return HttpResponse.json(
          createErrorResponse(
            CHAT_ERRORS.UNAUTHORIZED_ACCESS.code,
            CHAT_ERRORS.UNAUTHORIZED_ACCESS.message
          ),
          { status: 401 }
        );
      }

      const threadId = params.threadId as string;

      // Get thread
      const thread = await chatStore.getThread(threadId);
      if (!thread) {
        return HttpResponse.json(
          createErrorResponse(
            CHAT_ERRORS.THREAD_NOT_FOUND.code,
            CHAT_ERRORS.THREAD_NOT_FOUND.message
          ),
          { status: 404 }
        );
      }

      // Verify thread ownership
      if (thread.userId !== userId) {
        return HttpResponse.json(
          createErrorResponse(
            CHAT_ERRORS.UNAUTHORIZED_THREAD_ACCESS.code,
            CHAT_ERRORS.UNAUTHORIZED_THREAD_ACCESS.message
          ),
          { status: 403 }
        );
      }

      // Parse request body
      const requestData = (await request.json()) as { modelId: string };
      const { modelId } = requestData;

      // Validate model ID
      if (!modelId || modelId.trim().length === 0) {
        return HttpResponse.json(
          createErrorResponse(CHAT_ERRORS.INVALID_MESSAGE.code, 'Model ID is required'),
          { status: 400 }
        );
      }

      // In a real system, we would validate if the model exists and is enabled
      // For mock purposes, simulate a model not found error if modelId is "invalid-model"
      if (modelId === 'invalid-model') {
        return HttpResponse.json(
          createErrorResponse(
            CHAT_ERRORS.MODEL_NOT_FOUND.code,
            CHAT_ERRORS.MODEL_NOT_FOUND.message
          ),
          { status: 404 }
        );
      }

      // Update thread
      const updatedThread = await chatStore.updateThread(threadId, { modelId });

      return HttpResponse.json(updatedThread);
    } catch (error) {
      console.error('Error in update thread model handler:', error);
      return HttpResponse.json(
        createErrorResponse(CHAT_ERRORS.SERVER_ERROR.code, CHAT_ERRORS.SERVER_ERROR.message),
        { status: 500 }
      );
    }
  }
);
