/**
 * HTTP Client - Abstraction over fetch with retry, timeout, and error handling
 * Following Interface Segregation Principle (ISP) and Dependency Inversion (DIP)
 */

import { API_CONFIG } from './config';
import { ApiError } from './errors';

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  signal?: AbortSignal;
}

export interface HttpResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

// Sleep utility for retry delays
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Create timeout signal that cleans up properly
function createTimeoutSignal(timeout: number): { signal: AbortSignal; cleanup: () => void } {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  return {
    signal: controller.signal,
    cleanup: () => clearTimeout(timeoutId),
  };
}

// Combine multiple abort signals
function combineSignals(signals: AbortSignal[]): { signal: AbortSignal; cleanup: () => void } {
  const controller = new AbortController();
  const handlers: Array<() => void> = [];

  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort();
      break;
    }
    const handler = () => controller.abort();
    signal.addEventListener('abort', handler);
    handlers.push(() => signal.removeEventListener('abort', handler));
  }

  return {
    signal: controller.signal,
    cleanup: () => handlers.forEach((h) => h()),
  };
}

export async function httpRequest<T>(
  url: string,
  config: RequestConfig = {}
): Promise<HttpResponse<T>> {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = API_CONFIG.TIMEOUT,
    retries = API_CONFIG.RETRY_ATTEMPTS,
    retryDelay = API_CONFIG.RETRY_DELAY,
    signal: externalSignal,
  } = config;

  const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.BASE_URL}${url}`;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...headers,
  };

  let lastError: ApiError | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    // Create timeout signal with cleanup
    const timeoutControl = createTimeoutSignal(timeout);

    // Combine with external signal if provided
    const signals = externalSignal
      ? combineSignals([timeoutControl.signal, externalSignal])
      : { signal: timeoutControl.signal, cleanup: () => {} };

    try {
      const response = await fetch(fullUrl, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: signals.signal,
      });

      // Clean up signals
      timeoutControl.cleanup();
      signals.cleanup();

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = ApiError.fromHttpStatus(
          response.status,
          errorData.message || errorData.error?.message
        );

        // Don't retry non-retryable errors
        if (!error.retryable || attempt === retries) {
          throw error;
        }

        lastError = error;
        await sleep(retryDelay * Math.pow(2, attempt)); // Exponential backoff
        continue;
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      // Clean up signals on error
      timeoutControl.cleanup();
      signals.cleanup();

      // Handle abort from external signal
      if (externalSignal?.aborted) {
        throw ApiError.networkError('Request was cancelled');
      }

      if (error instanceof ApiError) {
        if (!error.retryable || attempt === retries) {
          throw error;
        }
        lastError = error;
      } else if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw ApiError.timeoutError();
        }
        if (error.message.includes('fetch')) {
          const networkError = ApiError.networkError();
          if (attempt === retries) throw networkError;
          lastError = networkError;
        } else {
          throw new ApiError({
            code: 'UNKNOWN_ERROR',
            message: error.message,
            retryable: false,
          });
        }
      }

      await sleep(retryDelay * Math.pow(2, attempt));
    }
  }

  throw lastError || ApiError.networkError();
}

// Convenience methods
export const httpClient = {
  get: <T>(url: string, config?: Omit<RequestConfig, 'method' | 'body'>) =>
    httpRequest<T>(url, { ...config, method: 'GET' }),

  post: <T>(url: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>) =>
    httpRequest<T>(url, { ...config, method: 'POST', body }),

  put: <T>(url: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>) =>
    httpRequest<T>(url, { ...config, method: 'PUT', body }),

  patch: <T>(url: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>) =>
    httpRequest<T>(url, { ...config, method: 'PATCH', body }),

  delete: <T>(url: string, config?: Omit<RequestConfig, 'method' | 'body'>) =>
    httpRequest<T>(url, { ...config, method: 'DELETE' }),
};
