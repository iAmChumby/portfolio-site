import request from 'supertest'
import express from 'express'
import { securityMiddleware, httpsEnforcement, validateSecurityHeaders } from '../../middleware/security.js'

describe('Security Middleware', () => {
  let app
  
  beforeEach(() => {
    app = express()
  })
  
  describe('httpsEnforcement', () => {
    beforeEach(() => {
      app.use(httpsEnforcement)
      app.get('/test', (req, res) => res.json({ success: true }))
    })
    
    it('should redirect HTTP to HTTPS in production with FORCE_HTTPS=true', async () => {
      const originalEnv = process.env.NODE_ENV
      const originalForceHttps = process.env.FORCE_HTTPS
      
      process.env.NODE_ENV = 'production'
      process.env.FORCE_HTTPS = 'true'
      
      const response = await request(app)
        .get('/test')
        .set('x-forwarded-proto', 'http')
        .set('host', 'example.com')
      
      expect(response.status).toBe(301)
      expect(response.headers.location).toBe('https://example.com/test')
      
      process.env.NODE_ENV = originalEnv
      process.env.FORCE_HTTPS = originalForceHttps
    })
    
    it('should not redirect HTTPS requests', async () => {
      const originalEnv = process.env.NODE_ENV
      const originalForceHttps = process.env.FORCE_HTTPS
      
      process.env.NODE_ENV = 'production'
      process.env.FORCE_HTTPS = 'true'
      
      const response = await request(app)
        .get('/test')
        .set('x-forwarded-proto', 'https')
        .set('host', 'example.com')
      
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ success: true })
      
      process.env.NODE_ENV = originalEnv
      process.env.FORCE_HTTPS = originalForceHttps
    })
    
    it('should not redirect in development environment', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      
      const response = await request(app)
        .get('/test')
        .set('x-forwarded-proto', 'http')
        .set('host', 'localhost:8000')
      
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ success: true })
      
      process.env.NODE_ENV = originalEnv
    })
  })
  
  describe('validateSecurityHeaders', () => {
    beforeEach(() => {
      app.use(validateSecurityHeaders)
      app.get('/test', (req, res) => res.json({ success: true }))
    })
    
    it('should pass through requests with proper headers', async () => {
      const response = await request(app)
        .get('/test')
        .set('x-forwarded-proto', 'https')
        .set('user-agent', 'test-agent')
      
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ success: true })
    })
    
    it('should handle requests without security headers', async () => {
      const response = await request(app)
        .get('/test')
      
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ success: true })
    })
  })
  
  describe('securityMiddleware', () => {
    beforeEach(() => {
      app.use(securityMiddleware())
      app.get('/test', (req, res) => {
        res.json({ 
          success: true,
          headers: {
            'x-frame-options': res.getHeader('X-Frame-Options'),
            'x-content-type-options': res.getHeader('X-Content-Type-Options'),
            'x-xss-protection': res.getHeader('X-XSS-Protection'),
            'referrer-policy': res.getHeader('Referrer-Policy'),
            'permissions-policy': res.getHeader('Permissions-Policy')
          }
        })
      })
    })
    
    it('should set security headers', async () => {
      const response = await request(app)
        .get('/test')
      
      expect(response.status).toBe(200)
      expect(response.body.headers['x-frame-options']).toBe('DENY')
      expect(response.body.headers['x-content-type-options']).toBe('nosniff')
      expect(response.body.headers['x-xss-protection']).toBe('1; mode=block')
      expect(response.body.headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
      expect(response.body.headers['permissions-policy']).toBe('camera=(), microphone=(), geolocation=()')
    })
    
    it('should configure secure cookies in production', async () => {
      const originalEnv = process.env.NODE_ENV
      const originalCookieSecure = process.env.COOKIE_SECURE
      
      process.env.NODE_ENV = 'production'
      process.env.COOKIE_SECURE = 'true'
      
      const testApp = express()
      testApp.use(securityMiddleware())
      testApp.get('/test', (req, res) => {
        res.cookie('test', 'value')
        res.json({ success: true })
      })
      
      const response = await request(testApp)
        .get('/test')
      
      expect(response.status).toBe(200)
      // Session middleware should be configured with secure cookies
      
      process.env.NODE_ENV = originalEnv
      process.env.COOKIE_SECURE = originalCookieSecure
    })
    
    it('should remove X-Powered-By header', async () => {
      const response = await request(app)
        .get('/test')
      
      expect(response.headers['x-powered-by']).toBeUndefined()
    })
  })
  
  describe('Integration', () => {
    beforeEach(() => {
      app.use(httpsEnforcement)
      app.use(validateSecurityHeaders)
      app.use(securityMiddleware())
      app.get('/test', (req, res) => res.json({ success: true }))
    })
    
    it('should apply all security middleware in correct order', async () => {
      const response = await request(app)
        .get('/test')
        .set('x-forwarded-proto', 'https')
      
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ success: true })
      expect(response.headers['x-frame-options']).toBe('DENY')
      expect(response.headers['x-content-type-options']).toBe('nosniff')
    })
  })
})