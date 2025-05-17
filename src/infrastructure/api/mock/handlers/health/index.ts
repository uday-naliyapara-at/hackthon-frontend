import { HttpResponse, http } from 'msw';

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  version: string;
  timestamp: string;
}

export const healthHandler = http.get('/health', async () => {
  const response: HealthCheckResponse = {
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  };

  return HttpResponse.json(response, { status: 200 });
});
