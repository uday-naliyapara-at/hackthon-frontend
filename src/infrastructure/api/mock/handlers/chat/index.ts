import { sendMessageHandler, streamMessageHandler, submitFeedbackHandler } from './messages';
import {
  deleteThreadHandler,
  getThreadHandler,
  getThreadsHandler,
  renameThreadHandler,
  updateThreadModelHandler,
} from './threads';

export const chatHandlers = [
  sendMessageHandler,
  streamMessageHandler,
  getThreadsHandler,
  getThreadHandler,
  submitFeedbackHandler,
  renameThreadHandler,
  deleteThreadHandler,
  updateThreadModelHandler,
];
