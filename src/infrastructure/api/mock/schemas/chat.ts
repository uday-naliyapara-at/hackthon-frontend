/**
 * OpenAPI/Swagger schema definitions for chat endpoints.
 * This file serves as:
 * 1. API Documentation (via Swagger UI)
 * 2. Type definitions for MSW handlers
 * 3. Contract for frontend-backend integration
 * 4. Source for generating API client types
 */

// Schema Definitions for Message Content Types
const TextContent = {
  type: 'object',
  required: ['type', 'text', 'timestamp'],
  properties: {
    type: {
      type: 'string',
      enum: ['text'],
      description: 'Indicates this is a text content block',
    },
    text: {
      type: 'string',
      description: 'The text content',
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
      description: 'When this content was created',
    },
  },
};

const ToolCallContent = {
  type: 'object',
  required: ['type', 'toolCallId', 'toolName', 'args', 'timestamp'],
  properties: {
    type: {
      type: 'string',
      enum: ['tool-call'],
      description: 'Indicates this is a tool call content block',
    },
    toolCallId: {
      type: 'string',
      description: 'Unique identifier for this tool call',
    },
    toolName: {
      type: 'string',
      description: 'Name of the tool being called',
    },
    args: {
      type: 'object',
      description: 'Arguments passed to the tool',
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
      description: 'When this tool call was made',
    },
  },
};

const ToolResultContent = {
  type: 'object',
  required: ['type', 'toolCallId', 'toolName', 'result', 'timestamp'],
  properties: {
    type: {
      type: 'string',
      enum: ['tool-result'],
      description: 'Indicates this is a tool result content block',
    },
    toolCallId: {
      type: 'string',
      description: 'ID of the tool call this result is for',
    },
    toolName: {
      type: 'string',
      description: 'Name of the tool that was called',
    },
    result: {
      type: 'object',
      description: 'Result returned by the tool',
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
      description: 'When this result was received',
    },
  },
};

const MessageContent = {
  oneOf: [
    { $ref: '#/components/schemas/TextContent' },
    { $ref: '#/components/schemas/ToolCallContent' },
    { $ref: '#/components/schemas/ToolResultContent' },
  ],
};

const ChatMessage = {
  type: 'object',
  required: ['id', 'content', 'threadId', 'timestamp', 'role'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique identifier for the message',
    },
    content: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/MessageContent',
      },
      description: 'Structured message content array',
    },
    threadId: {
      type: 'string',
      format: 'uuid',
      description: 'ID of the thread this message belongs to',
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
      description: 'When the message was created',
    },
    role: {
      type: 'string',
      enum: ['user', 'assistant'],
      description: 'Indicates whether the message is from a user or AI assistant',
    },
    modelId: {
      type: 'string',
      format: 'uuid',
      description: 'ID of the model used for this message',
    },
    traceId: {
      type: 'string',
      description: 'Trace ID for tracking message generation',
    },
    replacedBy: {
      type: 'string',
      format: 'uuid',
      description: 'ID of the message that replaced this one (if edited)',
    },
    replacedMessageId: {
      type: 'string',
      format: 'uuid',
      description: 'ID of the message this one replaces (if this is an edited version)',
    },
    userMessageId: {
      type: 'string',
      format: 'uuid',
      description: 'ID of the user message that triggered this assistant message',
    },
  },
};

const ChatThread = {
  type: 'object',
  required: ['id', 'title', 'modelId', 'userId', 'createdAt', 'updatedAt'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique identifier for the thread',
    },
    title: {
      type: 'string',
      description: 'Title of the thread, usually derived from the first message',
    },
    modelId: {
      type: 'string',
      description: 'ID of the model used for this thread',
    },
    userId: {
      type: 'string',
      description: 'ID of the user who owns this thread',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'When the thread was created',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'When the thread was last updated',
    },
  },
};

const ThreadWithMessages = {
  type: 'object',
  required: ['thread', 'messages'],
  properties: {
    thread: {
      $ref: '#/components/schemas/ChatThread',
    },
    messages: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/ChatMessage',
      },
      description: 'Messages in this thread',
    },
  },
};

const SendMessageRequest = {
  type: 'object',
  required: ['modelId', 'message'],
  properties: {
    threadId: {
      type: 'string',
      format: 'uuid',
      description: 'Optional thread ID for continuing conversation',
    },
    modelId: {
      type: 'string',
      description: 'ID of the model to use',
    },
    message: {
      type: 'string',
      minLength: 1,
      description: 'Message content',
    },
  },
};

const FeedbackRequest = {
  type: 'object',
  required: ['messageId', 'rating'],
  properties: {
    messageId: {
      type: 'string',
      format: 'uuid',
      description: 'ID of the message to provide feedback for',
    },
    rating: {
      type: 'string',
      enum: ['positive', 'negative'],
      description: 'Feedback rating (thumbs up or thumbs down)',
    },
    comment: {
      type: 'string',
      description: 'Optional comment with the feedback',
    },
  },
};

const UpdateThreadModelRequest = {
  type: 'object',
  required: ['modelId'],
  properties: {
    modelId: {
      type: 'string',
      format: 'uuid',
      description: 'New model ID to use for the thread',
    },
  },
};

const ErrorResponse = {
  type: 'object',
  required: ['code', 'message'],
  properties: {
    code: {
      type: 'string',
      example: 'CHAT_001',
      description: 'Error code for client handling',
    },
    message: {
      type: 'string',
      example: 'Invalid message format',
      description: 'Human-readable error message',
    },
    details: {
      type: 'object',
      description: 'Additional error context if available',
    },
  },
};

// Export Components
export const chatComponents = {
  schemas: {
    ChatMessage,
    ChatThread,
    ThreadWithMessages,
    SendMessageRequest,
    FeedbackRequest,
    UpdateThreadModelRequest,
    ErrorResponse,
    TextContent,
    ToolCallContent,
    ToolResultContent,
    MessageContent,
  },
};

// Export Paths
export const chatPaths = {
  '/api/chat/messages': {
    post: {
      tags: ['Chat'],
      summary: 'Send a message and get AI response',
      description: 'Sends a user message and returns AI generated response',
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/SendMessageRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'AI response generated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ChatMessage',
              },
              example: {
                id: '550e8400-e29b-41d4-a716-446655440000',
                content: [
                  {
                    type: 'text',
                    text: 'Hello! How can I help you today?',
                    timestamp: '2024-02-12T04:12:00Z',
                  },
                ],
                threadId: '7a052649-8d0f-4244-a336-89b5f7637af0',
                timestamp: '2024-02-12T04:12:00Z',
                role: 'assistant',
                modelId: '550e8400-e29b-41d4-a716-446655440002',
                traceId: 'trace_abc123',
              },
            },
          },
        },
        400: {
          description: 'Invalid request - Missing required fields or invalid format',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'CHAT_001',
                message: 'Message content is required',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or missing authentication token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'COMMON_001',
                message: 'Unauthorized access',
              },
            },
          },
        },
        404: {
          description: 'Thread or model not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'CHAT_002',
                message: 'Thread not found',
              },
            },
          },
        },
      },
    },
  },
  '/api/chat/threads': {
    get: {
      tags: ['Chat'],
      summary: 'Get all chat threads',
      description:
        'Retrieves all chat threads for the authenticated user, sorted by most recent first',
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: 'List of chat threads retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/ChatThread',
                },
              },
              example: [
                {
                  id: '7a052649-8d0f-4244-a336-89b5f7637af0',
                  title: 'How to implement a React component?',
                  modelId: 'gpt-4',
                  userId: '123e4567-e89b-12d3-a456-426614174000',
                  createdAt: '2024-02-12T04:12:00Z',
                  updatedAt: '2024-02-12T04:15:30Z',
                },
                {
                  id: '550e8400-e29b-41d4-a716-446655440000',
                  title: 'Explain quantum computing',
                  modelId: 'gpt-3.5-turbo',
                  userId: '123e4567-e89b-12d3-a456-426614174000',
                  createdAt: '2024-02-10T14:22:10Z',
                  updatedAt: '2024-02-10T14:30:45Z',
                },
              ],
            },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or missing authentication token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'COMMON_001',
                message: 'Unauthorized access',
              },
            },
          },
        },
        500: {
          description: 'Server error while retrieving threads',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'CHAT_500',
                message: 'Failed to retrieve threads',
              },
            },
          },
        },
      },
    },
  },
  '/api/chat/threads/{id}': {
    get: {
      tags: ['Chat'],
      summary: 'Get a specific chat thread with messages',
      description: 'Retrieves a specific chat thread and all its messages',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
          description: 'Thread ID to retrieve',
        },
      ],
      responses: {
        200: {
          description: 'Thread and messages retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ThreadWithMessages',
              },
              example: {
                thread: {
                  id: '7a052649-8d0f-4244-a336-89b5f7637af0',
                  title: 'How to implement a React component?',
                  modelId: 'gpt-4',
                  userId: '123e4567-e89b-12d3-a456-426614174000',
                  createdAt: '2024-02-12T04:12:00Z',
                  updatedAt: '2024-02-12T04:15:30Z',
                },
                messages: [
                  {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    content: [
                      {
                        type: 'text',
                        text: 'How do I implement a React component?',
                        timestamp: '2024-02-12T04:12:00Z',
                      },
                    ],
                    threadId: '7a052649-8d0f-4244-a336-89b5f7637af0',
                    timestamp: '2024-02-12T04:12:00Z',
                    role: 'user',
                  },
                  {
                    id: '550e8400-e29b-41d4-a716-446655440000',
                    content: [
                      {
                        type: 'text',
                        text: 'To implement a React component, you can use either a function or class approach...',
                        timestamp: '2024-02-12T04:15:30Z',
                      },
                      {
                        type: 'tool-call',
                        toolCallId: 'call_abc123',
                        toolName: 'codeExample',
                        args: {
                          language: 'jsx',
                          type: 'functional',
                        },
                        timestamp: '2024-02-12T04:15:35Z',
                      },
                      {
                        type: 'tool-result',
                        toolCallId: 'call_abc123',
                        toolName: 'codeExample',
                        result: {
                          code: 'function MyComponent() {\n  return <div>Hello World</div>;\n}\n\nexport default MyComponent;',
                        },
                        timestamp: '2024-02-12T04:15:40Z',
                      },
                    ],
                    threadId: '7a052649-8d0f-4244-a336-89b5f7637af0',
                    timestamp: '2024-02-12T04:15:30Z',
                    role: 'assistant',
                    modelId: 'gpt-4',
                    traceId: 'trace_xyz789',
                  },
                ],
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or missing authentication token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'COMMON_001',
                message: 'Unauthorized access',
              },
            },
          },
        },
        404: {
          description: 'Thread not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'CHAT_002',
                message: 'Thread not found',
              },
            },
          },
        },
        500: {
          description: 'Server error while retrieving thread',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'CHAT_500',
                message: 'Failed to retrieve thread',
              },
            },
          },
        },
      },
    },
  },
  '/api/chat/messages/feedback': {
    post: {
      tags: ['Chat'],
      summary: 'Submit feedback for an AI message',
      description: 'Submits user feedback (thumbs up/down) for an AI-generated message',
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/FeedbackRequest',
            },
            example: {
              messageId: '550e8400-e29b-41d4-a716-446655440000',
              rating: 'positive',
              comment: 'This response was very helpful!',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Feedback submitted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Feedback submitted successfully',
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Invalid request - Missing required fields or invalid format',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'VALIDATION_ERROR',
                message: 'Rating must be either "positive" or "negative"',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or missing authentication token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'COMMON_001',
                message: 'Unauthorized access',
              },
            },
          },
        },
        404: {
          description: 'Message not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'CHAT_006',
                message: 'Message not found',
              },
            },
          },
        },
        500: {
          description: 'Server error while submitting feedback',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'CHAT_500',
                message: 'Failed to submit feedback',
              },
            },
          },
        },
      },
    },
  },
  '/api/chat/threads/{threadId}/messages/{messageId}/stream': {
    put: {
      tags: ['Chat'],
      summary: 'Edit an existing message in a thread',
      description: 'Edits an existing message and returns updated AI response as a stream',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'threadId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
          description: 'ID of the thread containing the message',
        },
        {
          name: 'messageId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
          description: 'ID of the message to edit',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['content', 'modelId'],
              properties: {
                content: {
                  type: 'string',
                  description: 'New content for the message',
                  minLength: 1,
                },
                modelId: {
                  type: 'string',
                  description: 'ID of the model to use for generating the updated AI response',
                },
              },
            },
            example: {
              content: 'Updated message content',
              modelId: 'gpt-4',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Message edited successfully and streaming response started',
          content: {
            'text/event-stream': {
              schema: {
                type: 'string',
                description: 'Stream of message chunks and events',
              },
              example: [
                'event: start\ndata: {"threadId":"7a052649-8d0f-4244-a336-89b5f7637af0","messageId":"123e4567-e89b-12d3-a456-426614174000"}\n\n',
                'event: token\ndata: {"token":"Hello"}\n\n',
                'event: token\ndata: {"token":" there"}\n\n',
                'event: tool-call\ndata: {"toolCallId":"call_abc123","toolName":"weather","args":{"location":"New York","unit":"celsius"}}\n\n',
                'event: tool-result\ndata: {"toolCallId":"call_abc123","toolName":"weather","result":{"temperature":22,"condition":"sunny"}}\n\n',
                'event: token\ndata: {"token":"! The current weather in New York is 22°C and sunny."}\n\n',
                'event: done\ndata: {"threadId":"7a052649-8d0f-4244-a336-89b5f7637af0","messageId":"550e8400-e29b-41d4-a716-446655440000","userMessageId":"123e4567-e89b-12d3-a456-426614174000"}\n\n',
              ].join(''),
            },
          },
        },
        400: {
          description: 'Invalid request - Missing required fields or invalid format',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'CHAT_001',
                message: 'Message content is required',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or missing authentication token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'COMMON_001',
                message: 'Unauthorized access',
              },
            },
          },
        },
        404: {
          description: 'Thread or message not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'CHAT_002',
                message: 'Thread or message not found',
              },
            },
          },
        },
        500: {
          description: 'Server error while editing message',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'CHAT_500',
                message: 'Failed to edit message',
              },
            },
          },
        },
      },
    },
  },
  '/api/chat-threads/{threadId}/model': {
    put: {
      tags: ['Chat'],
      summary: 'Update model used in a chat thread',
      description: 'Updates the model ID for an existing chat thread',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'threadId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
          description: 'ID of the thread to update',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateThreadModelRequest',
            },
            example: {
              modelId: '550e8400-e29b-41d4-a716-446655440000',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Model ID updated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ChatThread',
              },
              example: {
                id: '7a052649-8d0f-4244-a336-89b5f7637af0',
                title: 'Thread Title',
                modelId: '550e8400-e29b-41d4-a716-446655440000',
                userId: '33c7d659-8571-4c19-a9fb-d33ac1fd1b61',
                createdAt: '2024-04-12T15:32:44Z',
                updatedAt: '2024-04-15T09:21:02Z',
              },
            },
          },
        },
        400: {
          description: 'Invalid request parameters',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'CHAT_004',
                message: 'Missing required modelId',
                details: {},
              },
            },
          },
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
        403: {
          description: 'Forbidden - user does not own this thread',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'CHAT_003',
                message: 'Unauthorized access to chat thread',
                details: {},
              },
            },
          },
        },
        404: {
          description: 'Thread not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                code: 'CHAT_001',
                message: 'Thread not found',
                details: {},
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
      },
    },
  },
};
