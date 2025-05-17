import { forgotPasswordHandler } from './forgot-password';
import { loginHandler } from './login';
import { logoutHandler } from './logout';
import { getCurrentUserHandler } from './me';
import { refreshTokenHandler } from './refresh';
import { registerHandler } from './register';
import { resendVerificationHandler } from './resend-verification';
import { resetPasswordHandler } from './reset-password';
import { verifyEmailHandler } from './verify-email';

export const authHandlers = [
  registerHandler,
  loginHandler,
  logoutHandler,
  refreshTokenHandler,
  verifyEmailHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  resendVerificationHandler,
  getCurrentUserHandler,
];
