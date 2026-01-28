/**
 * API Error Types - Centralized error handling
 * Following Open/Closed Principle (OCP) - extensible error types
 */

export type ApiErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'
  | 'SERVER_ERROR'
  | 'CLIENT_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'UNKNOWN_ERROR';

export interface ApiErrorDetails {
  readonly code: ApiErrorCode;
  readonly message: string;
  readonly status?: number;
  readonly details?: Record<string, string[]>;
  readonly retryable: boolean;
}

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status?: number;
  readonly details?: Record<string, string[]>;
  readonly retryable: boolean;

  constructor(error: ApiErrorDetails) {
    super(error.message);
    this.name = 'ApiError';
    this.code = error.code;
    this.status = error.status;
    this.details = error.details;
    this.retryable = error.retryable;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  static fromHttpStatus(status: number, message?: string): ApiError {
    const errorMap: Record<number, Omit<ApiErrorDetails, 'status'>> = {
      400: { code: 'VALIDATION_ERROR', message: message || 'Invalid request data', retryable: false },
      401: { code: 'UNAUTHORIZED', message: message || 'Authentication required', retryable: false },
      403: { code: 'FORBIDDEN', message: message || 'Access denied', retryable: false },
      404: { code: 'NOT_FOUND', message: message || 'Resource not found', retryable: false },
      429: { code: 'RATE_LIMITED', message: message || 'Too many requests', retryable: true },
      500: { code: 'SERVER_ERROR', message: message || 'Internal server error', retryable: true },
      502: { code: 'SERVER_ERROR', message: message || 'Bad gateway', retryable: true },
      503: { code: 'SERVER_ERROR', message: message || 'Service unavailable', retryable: true },
      504: { code: 'TIMEOUT_ERROR', message: message || 'Gateway timeout', retryable: true },
    };

    const errorDetails = errorMap[status] || {
      code: status >= 500 ? 'SERVER_ERROR' : 'CLIENT_ERROR',
      message: message || `HTTP Error ${status}`,
      retryable: status >= 500,
    };

    return new ApiError({ ...errorDetails, status });
  }

  static networkError(message?: string): ApiError {
    return new ApiError({
      code: 'NETWORK_ERROR',
      message: message || 'Network connection failed',
      retryable: true,
    });
  }

  static timeoutError(message?: string): ApiError {
    return new ApiError({
      code: 'TIMEOUT_ERROR',
      message: message || 'Request timed out',
      retryable: true,
    });
  }

  toJSON(): ApiErrorDetails {
    return {
      code: this.code,
      message: this.message,
      status: this.status,
      details: this.details,
      retryable: this.retryable,
    };
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
