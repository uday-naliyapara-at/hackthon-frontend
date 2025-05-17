/**
 * Error messages for chat-related operations
 */
export const CHAT_ERROR_MESSAGES = {
  INVALID_MESSAGE: 'Message content is required',
  THREAD_NOT_FOUND: 'Thread not found',
  MODEL_NOT_FOUND: 'Model not found',
  MODEL_NOT_ENABLED: 'Selected model is not enabled',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded, please try again later',
  FAILED_TO_RETRIEVE_THREADS: 'Failed to retrieve threads',
  FAILED_TO_RETRIEVE_THREAD: 'Failed to retrieve thread',
  UNAUTHORIZED_THREAD_ACCESS: 'You do not have permission to access this thread',
  UNAUTHORIZED_ACCESS: 'Unauthorized access',
  MESSAGE_NOT_FOUND: 'Message not found',
  INVALID_TITLE: 'Thread title is invalid',
} as const;

/**
 * Error codes for chat-related operations
 */
export const CHAT_ERRORS = {
  INVALID_MESSAGE: {
    code: 'CHAT_001',
    message: CHAT_ERROR_MESSAGES.INVALID_MESSAGE,
  },
  THREAD_NOT_FOUND: {
    code: 'CHAT_002',
    message: CHAT_ERROR_MESSAGES.THREAD_NOT_FOUND,
  },
  MODEL_NOT_FOUND: {
    code: 'CHAT_003',
    message: CHAT_ERROR_MESSAGES.MODEL_NOT_FOUND,
  },
  MODEL_NOT_ENABLED: {
    code: 'CHAT_004',
    message: CHAT_ERROR_MESSAGES.MODEL_NOT_ENABLED,
  },
  RATE_LIMIT_EXCEEDED: {
    code: 'CHAT_005',
    message: CHAT_ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
  },
  MESSAGE_NOT_FOUND: {
    code: 'CHAT_006',
    message: CHAT_ERROR_MESSAGES.MESSAGE_NOT_FOUND,
  },
  INVALID_TITLE: {
    code: 'CHAT_007',
    message: CHAT_ERROR_MESSAGES.INVALID_TITLE,
  },
  UNAUTHORIZED_THREAD_ACCESS: {
    code: 'CHAT_403',
    message: CHAT_ERROR_MESSAGES.UNAUTHORIZED_THREAD_ACCESS,
  },
  UNAUTHORIZED_ACCESS: {
    code: 'CHAT_401',
    message: CHAT_ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
  },
  SERVER_ERROR: {
    code: 'CHAT_500',
    message: 'An unexpected error occurred',
  },
} as const;
