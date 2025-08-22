import { describe, it, expect } from '@jest/globals'
import {
  ApiError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  GitHubApiError,
  createErrorFromUnknown,
  isOperationalError,
  getErrorSeverity,
  ERROR_SEVERITY
} from '../../utils/errors.js'

describe('Error Classes', () => {
  describe('ApiError', () => {
    it('should create an ApiError with default values', () => {
      const error = new ApiError('Test error')
      
      expect(error.message).toBe('Test error')
      expect(error.statusCode).toBe(500)
      expect(error.code).toBe('INTERNAL_ERROR')
      expect(error.isOperational).toBe(true)
      expect(error.name).toBe('ApiError')
    })
    
    it('should create an ApiError with custom values', () => {
      const error = new ApiError('Custom error', 400, 'CUSTOM_ERROR', null, false)
      
      expect(error.message).toBe('Custom error')
      expect(error.statusCode).toBe(400)
      expect(error.code).toBe('CUSTOM_ERROR')
      expect(error.isOperational).toBe(false)
    })
  })
  
  describe('ValidationError', () => {
    it('should create a ValidationError with correct defaults', () => {
      const error = new ValidationError('Invalid input')
      
      expect(error.message).toBe('Invalid input')
      expect(error.statusCode).toBe(400)
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.isOperational).toBe(true)
    })
    
    it('should create a ValidationError with field information', () => {
      const error = new ValidationError('Invalid email', 'email')
      
      expect(error.message).toBe('Invalid email')
      expect(error.field).toBe('email')
    })
  })
  
  describe('AuthenticationError', () => {
    it('should create an AuthenticationError with correct defaults', () => {
      const error = new AuthenticationError('Invalid credentials')
      
      expect(error.message).toBe('Invalid credentials')
      expect(error.statusCode).toBe(401)
      expect(error.code).toBe('AUTHENTICATION_ERROR')
    })
  })
  
  describe('NotFoundError', () => {
    it('should create a NotFoundError with correct defaults', () => {
      const error = new NotFoundError('User')
      
      expect(error.message).toBe('User not found')
      expect(error.statusCode).toBe(404)
      expect(error.code).toBe('NOT_FOUND')
    })
    
    it('should create a NotFoundError with resource', () => {
      const error = new NotFoundError('Custom resource')
      
      expect(error.message).toBe('Custom resource not found')
      expect(error.resource).toBe('Custom resource')
    })
  })
  
  describe('DatabaseError', () => {
    it('should create a DatabaseError with correct defaults', () => {
      const error = new DatabaseError('Connection failed')
      
      expect(error.message).toBe('Connection failed')
      expect(error.statusCode).toBe(500)
      expect(error.code).toBe('DATABASE_ERROR')
    })
    
    it('should create a DatabaseError with operation info', () => {
      const error = new DatabaseError('Query failed', 'findUser')
      
      expect(error.message).toBe('Query failed')
      expect(error.operation).toBe('findUser')
    })
  })
  
  describe('GitHubApiError', () => {
    it('should create a GitHubApiError with correct defaults', () => {
      const error = new GitHubApiError('API rate limit exceeded')
      
      expect(error.message).toBe('API rate limit exceeded')
      expect(error.statusCode).toBe(502)
      expect(error.code).toBe('GITHUB_API_ERROR')
    })
    
    it('should create a GitHubApiError with endpoint info', () => {
      const error = new GitHubApiError('Not found', '/user/repos', 404)
      
      expect(error.message).toBe('Not found')
      expect(error.endpoint).toBe('/user/repos')
      expect(error.githubStatusCode).toBe(404)
    })
  })
})

describe('Error Helper Functions', () => {
  describe('createErrorFromUnknown', () => {
    it('should return ApiError as-is', () => {
      const originalError = new ValidationError('Test validation error')
      const result = createErrorFromUnknown(originalError)
      
      expect(result).toBe(originalError)
    })
    
    it('should convert Error to ApiError', () => {
      const originalError = new Error('Test error')
      const result = createErrorFromUnknown(originalError)
      
      expect(result).toBeInstanceOf(ApiError)
      expect(result.message).toBe('Test error')
      expect(result.statusCode).toBe(500)
      expect(result.code).toBe('UNKNOWN_ERROR')
    })
    
    it('should use default message for non-Error objects', () => {
      const result = createErrorFromUnknown('string error')
      
      expect(result).toBeInstanceOf(ApiError)
      expect(result.message).toBe('An unexpected error occurred')
      expect(result.statusCode).toBe(500)
      expect(result.code).toBe('UNKNOWN_ERROR')
    })
    
    it('should use custom default message', () => {
      const result = createErrorFromUnknown('string error', 'Custom default')
      
      expect(result).toBeInstanceOf(ApiError)
      expect(result.message).toBe('Custom default')
    })
  })
})

describe('Error Utility Functions', () => {
  describe('isOperationalError', () => {
    it('should return true for operational errors', () => {
      const error = new ValidationError('Test')
      expect(isOperationalError(error)).toBe(true)
    })
    
    it('should return false for non-operational errors', () => {
      const error = new Error('System error')
      expect(isOperationalError(error)).toBe(false)
    })
    
    it('should return false for non-ApiError instances', () => {
      const error = new TypeError('Type error')
      expect(isOperationalError(error)).toBe(false)
    })
  })
  
  describe('getErrorSeverity', () => {
    it('should return correct severity for different error types', () => {
      expect(getErrorSeverity(new ValidationError('Test'))).toBe(ERROR_SEVERITY.MEDIUM)
      expect(getErrorSeverity(new AuthenticationError('Test'))).toBe(ERROR_SEVERITY.MEDIUM)
      expect(getErrorSeverity(new DatabaseError('Test'))).toBe(ERROR_SEVERITY.HIGH)
      expect(getErrorSeverity(new Error('Test'))).toBe(ERROR_SEVERITY.CRITICAL)
    })
    
    it('should return critical for unknown errors', () => {
      const error = new Error('Unknown error')
      expect(getErrorSeverity(error)).toBe(ERROR_SEVERITY.CRITICAL)
    })
    
    it('should return low for operational errors', () => {
      const error = { code: 'ENOTFOUND' }
      expect(getErrorSeverity(error)).toBe(ERROR_SEVERITY.LOW)
    })
  })
})