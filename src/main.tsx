import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './index.css';
import { QueryProvider } from './presentation/shared/providers/QueryProvider';

async function initMockServiceWorker() {
  const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

  if (useMockApi && process.env.NODE_ENV === 'development') {
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
