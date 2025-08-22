import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals'
import request from 'supertest'
import express from 'express'
import {
  errorHandler,
  asyncHandler,
  requestId,
  notFoundHandler,
  healthCheck
} from '../../middleware/errorHandler.js'
import {
  ValidationError,
  AuthenticationError,
  NotFoundError,
  DatabaseError,
  GitHubApiError
} from '../../utils/errors.js'

// Mock console methods
const originalConsole = { ...console }
beforeEach(() => {
  console.error = jest.fn()
  console.warn = jest.fn()
  console.info = jest.fn()
  console.log = jest.fn()
})

afterEach(() => {
  Object.assign(console, originalConsole)
})

describe('Error Handler Middleware', () => {
  let app
  
  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use(requestId)
  })
  
  describe('errorHandler', () => {
    beforeEach(() => {
      app.use('/test', (req, res, next) => {
        const errorType = req.query.errorType
        
        switch (errorType) {
          case 'validation':
            throw new ValidationError('Invalid input', 'email')
          case 'authentication':
            throw new AuthenticationError('Invalid credentials')
          case 'notfound':
            throw new NotFoundError('User')
          case 'database':
            throw new DatabaseError('Connection failed', 'connect')
          case 'github':
            throw new GitHubApiError('Rate limit exceeded', '/repos', 429)
          case 'generic':
            throw new Error('Generic error')
          default:
            res.json({ success: true })
        }
      })
      
      app.use(errorHandler)
    })
    
    it('should handle ValidationError correctly', async () => {
      const response = await request(app)
        .get('/test?errorType=validation')
        .expect(400)
      
      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: 'Invalid input',
          code: 'VALIDATION_ERROR',
          field: 'email'
        }
      })
      
      expect(response.headers['x-error-id']).toBeDefined()
    })
    
    it('should handle AuthenticationError correctly', async () => {
      const response = await request(app)
        .get('/test?errorType=authentication')
        .expect(401)
      
      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: 'Invalid credentials',
          code: 'AUTHENTICATION_ERROR'
        }
      })
    })
    
    it('should handle NotFoundError correctly', async () => {
      const response = await request(app)
        .get('/test?errorType=notfound')
        .expect(404)
      
      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: 'User not found',
          code: 'NOT_FOUND',
          resource: 'User'
        }
      })
    })
    
    it('should handle DatabaseError correctly', async () => {
      const response = await request(app)
        .get('/test?errorType=database')
        .expect(500)
      
      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: 'Connection failed',
          code: 'DATABASE_ERROR',
          operation: 'connect'
        }
      })
    })
    
    it('should handle GitHubApiError correctly', async () => {
      const response = await request(app)
        .get('/test?errorType=github')
        .expect(502)
      
      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: 'Rate limit exceeded',
          code: 'GITHUB_API_ERROR',
          endpoint: '/repos',
          githubStatusCode: 429
        }
      })
    })
    
    it('should handle generic errors correctly', async () => {
      const response = await request(app)
        .get('/test?errorType=generic')
        .expect(500)
      
      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR'
        }
      })
      
      // Should not expose internal error details
      expect(response.body.error.message).not.toBe('Generic error')
    })
    
    it('should set security headers', async () => {
      const response = await request(app)
        .get('/test?errorType=validation')
        .expect(400)
      
      expect(response.headers['x-content-type-options']).toBe('nosniff')
      expect(response.headers['x-frame-options']).toBe('DENY')
    })
    
    it('should include request ID in response', async () => {
      const response = await request(app)
        .get('/test?errorType=validation')
        .expect(400)
      
      expect(response.body.requestId).toBeDefined()
      expect(typeof response.body.requestId).toBe('string')
    })
  })
  
  describe('asyncHandler', () => {
    it('should handle async functions that resolve', async () => {
      app.get('/test', asyncHandler(async (req, res) => {
        await new Promise(resolve => setTimeout(resolve, 10))
        res.json({ success: true })
      }))
      
      const response = await request(app)
        .get('/test')
        .expect(200)
      
      expect(response.body).toEqual({ success: true })
    })
    
    it('should handle async functions that reject', async () => {
      app.get('/test', asyncHandler(async (req, res) => {
        await new Promise(resolve => setTimeout(resolve, 10))
        throw new ValidationError('Async error')
      }))
      
      app.use(errorHandler)
      
      const response = await request(app)
        .get('/test')
        .expect(400)
      
      expect(response.body.error.message).toBe('Async error')
    })
    
    it('should handle sync functions that throw', async () => {
      app.get('/test', asyncHandler((req, res) => {
        throw new NotFoundError('Resource')
      }))
      
      app.use(errorHandler)
      
      const response = await request(app)
        .get('/test')
        .expect(404)
      
      expect(response.body.error.message).toBe('Resource not found')
    })
  })
  
  describe('requestId middleware', () => {
    it('should add request ID to req object', async () => {
      let capturedReqId
      
      app.get('/test', (req, res) => {
        capturedReqId = req.id
        res.json({ requestId: req.id })
      })
      
      const response = await request(app)
        .get('/test')
        .expect(200)
      
      expect(capturedReqId).toBeDefined()
      expect(typeof capturedReqId).toBe('string')
      expect(response.body.requestId).toBe(capturedReqId)
    })
    
    it('should use existing X-Request-ID header if present', async () => {
      const existingId = 'existing-request-id'
      let capturedReqId
      
      app.get('/test', (req, res) => {
        capturedReqId = req.id
        res.json({ requestId: req.id })
      })
      
      const response = await request(app)
        .get('/test')
        .set('X-Request-ID', existingId)
        .expect(200)
      
      expect(capturedReqId).toBe(existingId)
      expect(response.body.requestId).toBe(existingId)
    })
  })
  
  describe('notFoundHandler', () => {
    it('should handle 404 errors', async () => {
      app.use(notFoundHandler)
      app.use(errorHandler)
      
      const response = await request(app)
        .get('/nonexistent')
        .expect(404)
      
      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: 'Route not found: GET /nonexistent',
          code: 'NOT_FOUND'
        }
      })
    })
  })
  
  describe('healthCheck', () => {
    it('should return health status', async () => {
      app.get('/health', healthCheck)
      
      const response = await request(app)
        .get('/health')
        .expect(200)
      
      expect(response.body).toMatchObject({
        success: true,
        message: 'Server is healthy',
        timestamp: expect.any(String),
        uptime: expect.any(Number),
        memory: expect.any(Object)
      })
      
      expect(response.body.memory).toHaveProperty('rss')
      expect(response.body.memory).toHaveProperty('heapUsed')
      expect(response.body.memory).toHaveProperty('heapTotal')
    })
  })
})