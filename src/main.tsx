import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './index.css';
import { QueryProvider } from './presentation/shared/providers/QueryProvider';

// Enhanced error handling
window.addEventListener('error', (event) => {
  console.error('🔴 GLOBAL ERROR:', {
    message: event.message,
    error: event.error,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack,
  });
});

// Also catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('🔴 UNHANDLED PROMISE REJECTION:', {
    reason: event.reason,
    stack: event.reason?.stack,
  });
});

async function initMockServiceWorker() {
  const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

  if (useMockApi && import.meta.env.MODE === 'development') {
    console.log('🔶 Using Mock API');
    const { worker } = await import('./infrastructure/api/mock/browser');
    return worker.start();
  }
  console.log('🔷 Using Real API');
  return Promise.resolve();
}

initMockServiceWorker().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryProvider>
        <App />
      </QueryProvider>
    </React.StrictMode>
  );
});
