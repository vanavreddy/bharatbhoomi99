/**
 * BB Response Unwrapper — extracts model from BBApiResponse, throws on errors
 */

import { ApiError } from './errors';
import type { BBApiResponse } from './bb-types';

export function unwrapBBResponse<T>(data: BBApiResponse<T>): T {
  if (data.apiErrors && data.apiErrors.length > 0) {
    throw new ApiError({
      code: 'SERVER_ERROR',
      message: data.apiErrors.join('; '),
      retryable: false,
    });
  }

  if (!data.isAuthorized) {
    throw new ApiError({
      code: 'UNAUTHORIZED',
      message: 'Not authorized',
      retryable: false,
    });
  }

  return data.model;
}
