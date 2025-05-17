import { HttpResponse, http } from 'msw';

import { chatStore } from '../../data/chat.store';
import { FeedbackRequest, SendMessageRequest } from '../../types/chat';
import { validateAuth } from '../../utils/auth.middleware';
import { createErrorResponse, getUserIdFromAuthHeader } from '../../utils/auth.utils';
import { CHAT_ERRORS } from './constants';

// Test response for simulating AI responses
const TEST_RESPONSES = [
  'I understand your question. Let me help you with that.',
  "That's an interesting point. Here's what I think...",
  "Based on what you've said, I would suggest...",
  'Let me analyze this for you...',
  "Here's my perspective on this matter...",
];

/**
 * Handler for chat messages endpoint
 * POST /api/chat/messages
 *
 * Handles:
 * 1. Message validation
 * 2. Thread creation/validation
 * 3. AI response generation
 * 4. Error scenarios
 */
export const sendMessageHandler = http.post('/api/chat/messages', async ({ request }) => {
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

    // Parse and validate request body
    const body = (await request.json()) as SendMessageRequest;

    if (!body.message?.trim()) {
      return HttpResponse.json(
        createErrorResponse(CHAT_ERRORS.INVALID_MESSAGE.code, CHAT_ERRORS.INVALID_MESSAGE.message),
        { status: 400 }
      );
    }

    if (!body.modelId) {
      return HttpResponse.json(
        createErrorResponse(CHAT_ERRORS.MODEL_NOT_FOUND.code, CHAT_ERRORS.MODEL_NOT_FOUND.message),
        { status: 400 }
      );
    }

    // Get or create thread
    let threadId = body.threadId;
    if (!threadId) {
      // Create new thread with first message as title
      const thread = await chatStore.createThread(
        body.modelId,
        body.message.slice(0, 50) + (body.message.length > 50 ? '...' : ''),
        userId
      );
      threadId = thread.id;
    } else {
      // Validate existing thread
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
    }

    // Store user's message first
    await chatStore.createMessage(body.message, threadId, 'user');

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create and store AI response
    const response = await chatStore.createMessage(
      TEST_RESPONSES[Math.floor(Math.random() * TEST_RESPONSES.length)],
      threadId,
      'assistant'
    );

    return HttpResponse.json(response);
  } catch (error) {
    return HttpResponse.json(
      createErrorResponse(CHAT_ERRORS.SERVER_ERROR.code, CHAT_ERRORS.SERVER_ERROR.message),
      {
        status: 500,
      }
    );
  }
});

/**
 * Handler for streaming chat messages endpoint
 * POST /api/chat/messages/stream
 *
 * Handles:
 * 1. Message validation
 * 2. Thread creation/validation
 * 3. Token-by-token AI response streaming
 * 4. Error scenarios
 */
export const streamMessageHandler = http.post('/api/chat/messages/stream', async ({ request }) => {
  // Create an AbortController to handle cancellation
  const controller = new AbortController();
  const { signal } = controller;

  // Handle abort signal from client
  request.signal.addEventListener('abort', () => {
    controller.abort();
  });

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

    // Parse and validate request body
    const body = (await request.json()) as SendMessageRequest;

    if (!body.message?.trim()) {
      return HttpResponse.json(
        createErrorResponse(CHAT_ERRORS.INVALID_MESSAGE.code, CHAT_ERRORS.INVALID_MESSAGE.message),
        { status: 400 }
      );
    }

    if (!body.modelId) {
      return HttpResponse.json(
        createErrorResponse(CHAT_ERRORS.MODEL_NOT_FOUND.code, CHAT_ERRORS.MODEL_NOT_FOUND.message),
        { status: 400 }
      );
    }

    // Get or create thread
    let threadId = body.threadId;
    if (!threadId) {
      // Create new thread with first message as title
      const thread = await chatStore.createThread(
        body.modelId,
        body.message.slice(0, 50) + (body.message.length > 50 ? '...' : ''),
        userId
      );
      threadId = thread.id;
    } else {
      // Validate existing thread
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
    }

    // Store user's message first
    await chatStore.createMessage(body.message, threadId, 'user');

    // Select a random response
    const responseText = TEST_RESPONSES[Math.floor(Math.random() * TEST_RESPONSES.length)];

    // Create and store the complete AI response
    const message = await chatStore.createMessage(responseText, threadId, 'assistant');

    // Create a text encoder for the response
    const encoder = new TextEncoder();

    // Create a response with a readable stream
    return new Response(
      new ReadableStream({
        start(streamController) {
          // Function to send an event
          const sendEvent = (event: string, data: unknown) => {
            streamController.enqueue(
              encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
            );
          };

          // Send start event immediately
          sendEvent('start', { status: 'started' });

          // Split the response into tokens (words for simplicity)
          const tokens = responseText.split(' ');

          // Send tokens with delays
          let tokenIndex = 0;
          let timeoutId: ReturnType<typeof setTimeout>;

          // Check if the signal is already aborted
          if (signal.aborted) {
            sendEvent('error', { error: 'Request aborted' });
            streamController.close();
            return;
          }

          // Add abort listener
          signal.addEventListener('abort', () => {
            // Clear timeout to stop next token
            if (timeoutId) clearTimeout(timeoutId);

            // Send an error event indicating the abort
            sendEvent('error', { error: 'Request aborted by user' });

            // Close the stream
            streamController.close();
          });

          const sendNextToken = () => {
            if (signal.aborted) {
              return;
            }

            if (tokenIndex < tokens.length) {
              sendEvent('token', { token: tokens[tokenIndex] + ' ' });
              tokenIndex++;
              timeoutId = setTimeout(sendNextToken, 100); // 100ms delay between tokens
            } else {
              // Get the created message to include its content array
              chatStore.getMessage(message.id).then((completeMessage) => {
                // All tokens sent, send completion event
                sendEvent('done', {
                  threadId,
                  messageId: message.id,
                  // Include structured content array instead of just string
                  content: completeMessage?.content || [],
                  timestamp: message.timestamp,
                });

                // Close the stream
                streamController.close();
              });
            }
          };

          // Start sending tokens after a delay
          timeoutId = setTimeout(sendNextToken, 500);
        },
      }),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
        },
      }
    );
  } catch (error) {
    return HttpResponse.json(
      createErrorResponse(CHAT_ERRORS.SERVER_ERROR.code, CHAT_ERRORS.SERVER_ERROR.message),
      {
        status: 500,
      }
    );
  }
});

/**
 * Handler for chat message feedback endpoint
 * POST /api/chat/messages/feedback
 *
 * Handles:
 * 1. Authentication validation
 * 2. Message existence validation
 * 3. Feedback submission
 * 4. Error scenarios
 */
export const submitFeedbackHandler = http.post(
  '/api/chat/messages/feedback',
  async ({ request }) => {
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

      // Parse and validate request body
      const body = (await request.json()) as FeedbackRequest;

      // Validate required fields
      if (!body.messageId) {
        return HttpResponse.json(
          createErrorResponse('VALIDATION_ERROR', 'Message ID is required'),
          { status: 400 }
        );
      }

      if (!body.rating || !['positive', 'negative'].includes(body.rating)) {
        return HttpResponse.json(
          createErrorResponse('VALIDATION_ERROR', 'Rating must be either "positive" or "negative"'),
          { status: 400 }
        );
      }

      // Check if message exists
      const message = await chatStore.getMessage(body.messageId);
      if (!message) {
        return HttpResponse.json(
          createErrorResponse(
            CHAT_ERRORS.MESSAGE_NOT_FOUND.code,
            CHAT_ERRORS.MESSAGE_NOT_FOUND.message
          ),
          { status: 404 }
        );
      }

      // Submit feedback
      await chatStore.submitFeedback(body.messageId, body.rating, body.comment);

      // Return success response
      return HttpResponse.json({ message: 'Feedback submitted successfully' }, { status: 200 });
    } catch (error) {
      return HttpResponse.json(
        createErrorResponse(CHAT_ERRORS.SERVER_ERROR.code, CHAT_ERRORS.SERVER_ERROR.message),
        { status: 500 }
      );
    }
  }
);
