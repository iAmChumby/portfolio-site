/**
 * Custom error classes for the portfolio backend API
 * Provides structured error handling with proper HTTP status codes
 */

/**
 * Base API Error class
 */
export class ApiError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null, isOperational = true) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.isOperational = isOperational
    this.timestamp = new Date().toISOString()
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      details: this.details,
      isOperational: this.isOperational,
      timestamp: this.timestamp,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined
    }
  }
}

/**
 * Validation Error - 400 Bad Request
 */
export class ValidationError extends ApiError {
  constructor(message = 'Validation failed', field = null) {
    super(message, 400, 'VALIDATION_ERROR', { field })
    this.field = field
    this.name = 'ValidationError'
  }
}

/**
 * Authentication Error - 401 Unauthorized
 */
export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR')
    this.name = 'AuthenticationError'
  }
}

/**
 * Authorization Error - 403 Forbidden
 */
export class AuthorizationError extends ApiError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR')
    this.name = 'AuthorizationError'
  }
}

/**
 * Not Found Error - 404 Not Found
 */
export class NotFoundError extends ApiError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND', { resource })
    this.resource = resource
    this.name = 'NotFoundError'
  }
}

/**
 * Conflict Error - 409 Conflict
 */
export class ConflictError extends ApiError {
  constructor(message = 'Resource conflict') {
    super(message, 409, 'CONFLICT_ERROR')
    this.name = 'ConflictError'
  }
}

/**
 * Rate Limit Error - 429 Too Many Requests
 */
export class RateLimitError extends ApiError {
  constructor(message = 'Rate limit exceeded', retryAfter = null) {
    super(message, 429, 'RATE_LIMIT_ERROR', { retryAfter })
    this.name = 'RateLimitError'
  }
}

/**
 * External Service Error - 502 Bad Gateway
 */
export class ExternalServiceError extends ApiError {
  constructor(service, message = 'External service unavailable') {
    super(`${service}: ${message}`, 502, 'EXTERNAL_SERVICE_ERROR', { service })
    this.name = 'ExternalServiceError'
  }
}

/**
 * Database Error - 500 Internal Server Error
 */
export class DatabaseError extends ApiError {
  constructor(message = 'Database operation failed', operation = null) {
    super(message, 500, 'DATABASE_ERROR', { operation })
    this.operation = operation
    this.name = 'DatabaseError'
  }
}

/**
 * GitHub API Error - handles GitHub-specific errors
 */
export class GitHubApiError extends ApiError {
  constructor(message, endpoint = null, githubStatusCode = null) {
    super(message, 502, 'GITHUB_API_ERROR', { endpoint, githubStatusCode })
    this.endpoint = endpoint
    this.githubStatusCode = githubStatusCode
    this.name = 'GitHubApiError'
  }
}

/**
 * Webhook Error - handles webhook-specific errors
 */
export class WebhookError extends ApiError {
  constructor(message, source = 'unknown') {
    super(message, 400, 'WEBHOOK_ERROR', { source })
    this.name = 'WebhookError'
  }
}

/**
 * Analytics Error - handles analytics-specific errors
 */
export class AnalyticsError extends ApiError {
  constructor(message, operation = null) {
    super(message, 500, 'ANALYTICS_ERROR', { operation })
    this.name = 'AnalyticsError'
  }
}

/**
 * Helper function to create appropriate error from unknown error
 */
export function createErrorFromUnknown(error, defaultMessage = 'An unexpected error occurred') {
  if (error instanceof ApiError) {
    return error
  }
  
  if (error instanceof Error) {
    return new ApiError(error.message || defaultMessage, 500, 'UNKNOWN_ERROR')
  }
  
  return new ApiError(defaultMessage, 500, 'UNKNOWN_ERROR')
}

/**
 * Helper function to check if error is operational (expected) vs programming error
 */
export function isOperationalError(error) {
  if (error instanceof ApiError) {
    return true
  }
  
  // Check for known operational errors
  const operationalErrors = [
    'ENOTFOUND',
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ECONNRESET',
    'EPIPE'
  ]
  
  if (error.code && operationalErrors.includes(error.code)) {
    return true
  }
  
  return false
}

/**
 * Error severity levels
 */
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

/**
 * Get error severity based on status code and type
 */
export function getErrorSeverity(error) {
  if (error instanceof ApiError) {
    if (error.statusCode >= 500) {
      return ERROR_SEVERITY.HIGH
    }
    if (error.statusCode >= 400) {
      return ERROR_SEVERITY.MEDIUM
    }
  }
  
  if (!isOperationalError(error)) {
    return ERROR_SEVERITY.CRITICAL
  }
  
  return ERROR_SEVERITY.LOW
}