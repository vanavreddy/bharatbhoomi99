/**
 * API response and request types
 */

export interface ApiResponse<T> {
  readonly success: true;
  readonly data: T;
  readonly message?: string;
  readonly timestamp: string;
}

export interface ApiError {
  readonly success: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly details?: Record<string, string[]>;
  };
  readonly timestamp: string;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

export function isApiError(response: ApiResult<unknown>): response is ApiError {
  return !response.success;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SearchParams extends PaginationParams {
  query?: string;
}
