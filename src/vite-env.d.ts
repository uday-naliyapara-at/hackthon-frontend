/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    MODE: string;
    BASE_URL: string;
    PROD: boolean;
    DEV: boolean;
    VITE_USE_MOCK_API: string;
    VITE_API_BASE_URL: string;
    [key: string]: string | boolean | undefined;
  };
}
