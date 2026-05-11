import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// ---------------------------------------------------------------------------
// Instancia base de Axios (tarea 5.1)
// ---------------------------------------------------------------------------

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ---------------------------------------------------------------------------
// Interceptor de autenticación — adjunta JWT (tarea 5.2)
// ---------------------------------------------------------------------------

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('pos_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ---------------------------------------------------------------------------
// Interceptor de logging y manejo global de errores HTTP (tarea 5.3)
// ---------------------------------------------------------------------------

apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} → ${response.status}`);
    }
    return response;
  },
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url} → ${error.response?.status}`, error.message);
    }

    // Normalizar el error para que los adaptadores reciban un mensaje claro
    const status = error.response?.status;
    const data = error.response?.data as Record<string, unknown> | undefined;
    const message =
      (data?.message as string) ??
      (data?.error as string) ??
      error.message ??
      'Error de red desconocido';

    const normalized = new Error(message);
    (normalized as Error & { status?: number; originalError?: AxiosError }).status = status;
    (normalized as Error & { status?: number; originalError?: AxiosError }).originalError = error;

    return Promise.reject(normalized);
  }
);

// ---------------------------------------------------------------------------
// Retry con backoff exponencial para errores 5xx (tarea 5.4)
// ---------------------------------------------------------------------------

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;

export function withRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  return fn().catch((error: Error & { status?: number }) => {
    const isServerError = error.status !== undefined && error.status >= 500;
    if (retries > 0 && isServerError) {
      const delay = BASE_DELAY_MS * Math.pow(2, MAX_RETRIES - retries);
      return new Promise<T>((resolve, reject) => {
        setTimeout(() => {
          withRetry(fn, retries - 1).then(resolve).catch(reject);
        }, delay);
      });
    }
    return Promise.reject(error);
  });
}
