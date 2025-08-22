import request from 'supertest'
import express from 'express'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import analyticsRoutes from '../src/routes/analytics.js'
import database from '../src/config/database.js'
import { errorHandler, requestId } from '../src/middleware/errorHandler.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const testDbPath = path.join(__dirname, '../data/test-analytics-routes-database.json')

describe('Analytics Routes', () => {
  let app

  beforeEach(async () => {
    // Clean up any existing test database
    try {
      await fs.unlink(testDbPath)
    } catch (error) {
      // File doesn't exist, that's fine
    }

    // Reset database instance
    database.db = null
    database.isInitialized = false
    process.env.DB_PATH = testDbPath
    
    // Initialize database
    await database.initialize()
    
    // Reset analytics data to default state
    await database.setAnalytics({
      totalVisits: 0,
      uniqueVisitors: 0,
      dailyStats: {},
      hourlyStats: {},
      popularPages: {},
      referrers: {},
      userAgents: {},
      responseTimeStats: {
        average: 0,
        min: 0,
        max: 0,
        samples: 0
      },
      requestLogs: []
    })

    // Create Express app with analytics routes
    app = express()
    app.use(requestId)
    app.use(express.json())
    app.use('/api/analytics', analyticsRoutes)
    app.use(errorHandler)
  })

  afterEach(async () => {
    // Clean up test database
    try {
      await fs.unlink(testDbPath)
    } catch (error) {
      // File doesn't exist, that's fine
    }
  })

  describe('GET /api/analytics/summary', () => {
    test('should return analytics summary with default values', async () => {
      const response = await request(app)
        .get('/api/analytics/summary')
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        data: {
          totalVisits: 0,
          uniqueVisitors: 0,
          dailyStats: {
            today: 0,
            todayUnique: 0
          },
          hourlyStats: {},
          topPages: []
        }
      })
    })

    test('should return analytics summary with data', async () => {
      // Add some test data
      await database.incrementVisits()
      await database.incrementVisits()
      await database.addVisitor('127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
      await database.updatePageStats('/home')
      await database.updatePageStats('/about')
      await database.updatePageStats('/home')

      const response = await request(app)
        .get('/api/analytics/summary')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.totalVisits).toBe(2)
      expect(response.body.data.uniqueVisitors).toBe(1)
      expect(response.body.data.topPages).toEqual([
        { page: '/home', visits: 2 },
        { page: '/about', visits: 1 }
      ])
    })

    test('should handle database errors', async () => {
      // Simulate database error
      database.db = null

      const response = await request(app)
        .get('/api/analytics/summary')
        .expect(500)

      expect(response.body.success).toBe(false)
      expect(response.body.error.message).toContain('Failed to fetch')
      expect(response.body.requestId).toBeDefined()
      expect(response.body.timestamp).toBeDefined()
    })
  })

  describe('GET /api/analytics/visits', () => {
    test('should return total visits count', async () => {
      await database.incrementVisits()
      await database.incrementVisits()
      await database.incrementVisits()

      const response = await request(app)
        .get('/api/analytics/visits')
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        data: {
          totalVisits: 3
        }
      })
    })

    test('should return zero visits for empty database', async () => {
      const response = await request(app)
        .get('/api/analytics/visits')
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        data: {
          totalVisits: 0
        }
      })
    })
  })

  describe('GET /api/analytics/visitors', () => {
    test('should return unique visitors count', async () => {
      await database.addVisitor('127.0.0.1', 'Mozilla/5.0')
      await database.addVisitor('192.168.1.1', 'Chrome/91.0')
      await database.addVisitor('127.0.0.1', 'Mozilla/5.0') // Duplicate IP

      const response = await request(app)
        .get('/api/analytics/visitors')
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        data: {
          uniqueVisitors: 2
        }
      })
    })
  })

  describe('GET /api/analytics/daily', () => {
    test('should return daily statistics', async () => {
      const today = new Date().toISOString().split('T')[0]
      await database.incrementVisits()
      await database.addVisitor('127.0.0.1', 'Mozilla/5.0')

      const response = await request(app)
        .get('/api/analytics/daily')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.dailyStats).toHaveProperty(today)
      expect(response.body.data.dailyStats[today].visits).toBe(1)
      expect(response.body.data.dailyStats[today].uniqueVisitors).toHaveLength(1)
    })

    test('should limit daily statistics based on query parameter', async () => {
      const response = await request(app)
        .get('/api/analytics/daily?limit=7')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('dailyStats')
    })
  })

  describe('GET /api/analytics/hourly', () => {
    test('should return hourly statistics', async () => {
      await database.updateHourlyStats()

      const response = await request(app)
        .get('/api/analytics/hourly')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('hourlyStats')
    })
  })

  describe('GET /api/analytics/pages', () => {
    test('should return popular pages statistics', async () => {
      await database.updatePageStats('/home')
      await database.updatePageStats('/about')
      await database.updatePageStats('/home')
      await database.updatePageStats('/contact')

      const response = await request(app)
        .get('/api/analytics/pages')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.topPages).toEqual([
        { path: '/home', visits: 2 },
        { path: '/about', visits: 1 },
        { path: '/contact', visits: 1 }
      ])
    })

    test('should limit pages based on query parameter', async () => {
      await database.updatePageStats('/home')
      await database.updatePageStats('/about')
      await database.updatePageStats('/contact')

      const response = await request(app)
        .get('/api/analytics/pages?limit=2')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.topPages).toHaveLength(2)
    })
  })

  describe('GET /api/analytics/referrers', () => {
    test('should return referrer statistics', async () => {
      await database.updateReferrerStats('google.com')
      await database.updateReferrerStats('facebook.com')
      await database.updateReferrerStats('google.com')

      const response = await request(app)
        .get('/api/analytics/referrers')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.topReferrers).toEqual([
        { source: 'google.com', visits: 2 },
        { source: 'facebook.com', visits: 1 }
      ])
    })

    test('should limit referrers based on query parameter', async () => {
      await database.updateReferrerStats('google.com')
      await database.updateReferrerStats('facebook.com')
      await database.updateReferrerStats('twitter.com')

      const response = await request(app)
        .get('/api/analytics/referrers?limit=2')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.topReferrers).toHaveLength(2)
    })
  })

  describe('GET /api/analytics/browsers', () => {
    test('should return browser statistics', async () => {
      await database.updateUserAgentStats('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
      await database.updateUserAgentStats('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0')
      await database.updateUserAgentStats('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')

      const response = await request(app)
        .get('/api/analytics/browsers')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.browserStats).toEqual([
        { browser: 'Chrome', visits: 2 },
        { browser: 'Firefox', visits: 1 }
      ])
    })
  })

  describe('GET /api/analytics/performance', () => {
    test('should return response time statistics', async () => {
      await database.updateResponseTimeStats(100)
      await database.updateResponseTimeStats(200)
      await database.updateResponseTimeStats(150)

      const response = await request(app)
        .get('/api/analytics/performance')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.responseTimeStats.samples).toBe(3)
      expect(response.body.data.responseTimeStats.min).toBe(100)
      expect(response.body.data.responseTimeStats.max).toBe(200)
      expect(response.body.data.responseTimeStats.average).toBeCloseTo(150, 1)
    })

    test('should return default stats for empty database', async () => {
      const response = await request(app)
        .get('/api/analytics/performance')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.responseTimeStats).toEqual({
        average: 0,
        min: 0,
        max: 0,
        samples: 0
      })
    })
  })

  describe('GET /api/analytics/requests', () => {
    test('should return recent request logs', async () => {
      const requestData = {
        method: 'GET',
        path: '/test',
        statusCode: 200,
        ip: '127.0.0.1',
        userAgent: 'Test Browser',
        referer: 'https://example.com',
        responseTime: 150,
        visitorId: 'test-visitor-id',
        timestamp: new Date().toISOString()
      }

      await database.addRequestLog(requestData)

      const response = await request(app)
        .get('/api/analytics/requests')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.recentRequests).toHaveLength(1)
      expect(response.body.data.recentRequests[0]).toMatchObject({
        method: 'GET',
        path: '/test',
        statusCode: 200,
        ip: '127.0.0.1'
      })
    })

    test('should limit request logs based on query parameter', async () => {
      // Add multiple request logs
      for (let i = 0; i < 5; i++) {
        await database.addRequestLog({
          method: 'GET',
          path: `/test${i}`,
          statusCode: 200,
          ip: '127.0.0.1',
          userAgent: 'Test Browser',
          referer: '',
          responseTime: 100 + i,
          visitorId: `visitor-${i}`,
          timestamp: new Date().toISOString()
        })
      }

      const response = await request(app)
        .get('/api/analytics/requests?limit=3')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.recentRequests).toHaveLength(3)
    })
  })

  describe('Error handling', () => {
    test('should handle database errors gracefully for all endpoints', async () => {
      // Simulate database error by setting db to null
      database.db = null

      const endpoints = [
        '/api/analytics/visits',
        '/api/analytics/visitors',
        '/api/analytics/daily',
        '/api/analytics/hourly',
        '/api/analytics/pages',
        '/api/analytics/referrers',
        '/api/analytics/browsers',
        '/api/analytics/performance',
        '/api/analytics/requests'
      ]

      for (const endpoint of endpoints) {
        const response = await request(app)
          .get(endpoint)
          .expect(500)

        expect(response.body.success).toBe(false)
        expect(response.body.error.message).toContain('Failed to fetch')
        expect(response.body.requestId).toBeDefined()
        expect(response.body.timestamp).toBeDefined()
      }
    })
  })
})