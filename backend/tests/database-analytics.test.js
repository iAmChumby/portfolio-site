import fs from 'fs/promises'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Import the Database class to create fresh instances
import database from '../src/config/database.js'

describe('Database Analytics', () => {
  const testDbPath = path.join(__dirname, '../data/test-analytics-database.json')

  beforeEach(async () => {
    // Clean up any existing test database
    try {
      await fs.unlink(testDbPath)
    } catch (error) {
      // File doesn't exist, that's fine
    }
    
    // Reset the database instance completely
    database.isInitialized = false
    database.db = null
    
    // Set test database path
    process.env.DB_PATH = testDbPath
    
    // Initialize database with fresh state
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
  })

  afterEach(async () => {
    // Clean up test database
    try {
      await fs.unlink(testDbPath)
    } catch (error) {
      // File doesn't exist, that's fine
    }
    
    // Reset environment
    delete process.env.DB_PATH
  })

  describe('getAnalytics', () => {
    test('should return default analytics structure', async () => {
      const analytics = await database.getAnalytics()
      
      expect(analytics).toHaveProperty('totalVisits', 0)
      expect(analytics).toHaveProperty('uniqueVisitors', 0)
      expect(analytics).toHaveProperty('dailyStats', {})
      expect(analytics).toHaveProperty('hourlyStats', {})
      expect(analytics).toHaveProperty('popularPages', {})
      expect(analytics).toHaveProperty('referrers', {})
      expect(analytics).toHaveProperty('userAgents', {})
      expect(analytics).toHaveProperty('responseTimeStats')
      expect(analytics).toHaveProperty('requestLogs', [])
      
      expect(analytics.responseTimeStats).toEqual({
        average: 0,
        min: 0,
        max: 0,
        samples: 0
      })
    })
  })

  describe('setAnalytics', () => {
    test('should update analytics data', async () => {
      const newAnalytics = {
        totalVisits: 100,
        uniqueVisitors: 50
      }

      await database.setAnalytics(newAnalytics)
      
      const analytics = await database.getAnalytics()
      expect(analytics.totalVisits).toBe(100)
      expect(analytics.uniqueVisitors).toBe(50)
      
      // Should preserve other fields
      expect(analytics.dailyStats).toEqual({})
      expect(analytics.hourlyStats).toEqual({})
    })
  })

  describe('incrementVisits', () => {
    test('should increment total visits', async () => {
      const initialVisits = await database.incrementVisits()
      expect(initialVisits).toBe(1)
      
      const secondVisit = await database.incrementVisits()
      expect(secondVisit).toBe(2)
      
      const analytics = await database.getAnalytics()
      expect(analytics.totalVisits).toBe(2)
    })
  })

  describe('addVisitor', () => {
    test('should track new visitor correctly', async () => {
      const visitorId = 'visitor-123'
      const wasNewVisitor = await database.addVisitor(visitorId)
      
      expect(wasNewVisitor).toBe(true)
      
      const analytics = await database.getAnalytics()
      expect(analytics.uniqueVisitors).toBe(1)
      
      const today = new Date().toISOString().split('T')[0]
      expect(analytics.dailyStats[today]).toBeDefined()
      expect(analytics.dailyStats[today].visits).toBe(1)
      expect(analytics.dailyStats[today].uniqueVisitors).toContain(visitorId)
    })

    test('should not count returning visitor as new', async () => {
      const visitorId = 'visitor-123'
      
      // First visit
      const firstVisit = await database.addVisitor(visitorId)
      expect(firstVisit).toBe(true)
      
      // Second visit same day
      const secondVisit = await database.addVisitor(visitorId)
      expect(secondVisit).toBe(false)
      
      const analytics = await database.getAnalytics()
      expect(analytics.uniqueVisitors).toBe(1)
      
      const today = new Date().toISOString().split('T')[0]
      expect(analytics.dailyStats[today].visits).toBe(2)
      expect(analytics.dailyStats[today].uniqueVisitors).toHaveLength(1)
    })
  })

  describe('updatePageStats', () => {
    test('should track page visits', async () => {
      const path = '/about'
      
      const firstVisit = await database.updatePageStats(path)
      expect(firstVisit).toBe(1)
      
      const secondVisit = await database.updatePageStats(path)
      expect(secondVisit).toBe(2)
      
      const analytics = await database.getAnalytics()
      expect(analytics.popularPages[path]).toBe(2)
    })

    test('should track multiple pages separately', async () => {
      await database.updatePageStats('/home')
      await database.updatePageStats('/about')
      await database.updatePageStats('/home')
      
      const analytics = await database.getAnalytics()
      expect(analytics.popularPages['/home']).toBe(2)
      expect(analytics.popularPages['/about']).toBe(1)
    })
  })

  describe('updateHourlyStats', () => {
    test('should track hourly statistics', async () => {
      const currentHour = new Date().getHours()
      
      const firstRequest = await database.updateHourlyStats()
      expect(firstRequest).toBe(1)
      
      const secondRequest = await database.updateHourlyStats()
      expect(secondRequest).toBe(2)
      
      const analytics = await database.getAnalytics()
      expect(analytics.hourlyStats[currentHour]).toBe(2)
    })
  })

  describe('updateReferrerStats', () => {
    test('should track referrer statistics', async () => {
      const referrer = 'https://google.com'
      
      const firstRef = await database.updateReferrerStats(referrer)
      expect(firstRef).toBe(1)
      
      const secondRef = await database.updateReferrerStats(referrer)
      expect(secondRef).toBe(2)
      
      const analytics = await database.getAnalytics()
      expect(analytics.referrers[referrer]).toBe(2)
    })

    test('should ignore direct traffic', async () => {
      const result = await database.updateReferrerStats('direct')
      expect(result).toBe(0)
      
      const analytics = await database.getAnalytics()
      expect(analytics.referrers.direct).toBeUndefined()
    })

    test('should ignore empty referrer', async () => {
      const result = await database.updateReferrerStats('')
      expect(result).toBe(0)
      
      const analytics = await database.getAnalytics()
      expect(Object.keys(analytics.referrers)).toHaveLength(0)
    })
  })

  describe('updateUserAgentStats', () => {
    test('should extract and track browser statistics', async () => {
      const chromeUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      
      const result = await database.updateUserAgentStats(chromeUA)
      expect(result.Chrome).toBe(1)
      
      const firefoxUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
      await database.updateUserAgentStats(firefoxUA)
      
      const analytics = await database.getAnalytics()
      expect(analytics.userAgents.Chrome).toBe(1)
      expect(analytics.userAgents.Firefox).toBe(1)
    })
  })

  describe('extractBrowserName', () => {
    test('should correctly identify different browsers', () => {
      const chromeUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      expect(database.extractBrowserName(chromeUA)).toBe('Chrome')
      
      const firefoxUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
      expect(database.extractBrowserName(firefoxUA)).toBe('Firefox')
      
      const safariUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15'
      expect(database.extractBrowserName(safariUA)).toBe('Safari')
      
      const edgeUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59'
      expect(database.extractBrowserName(edgeUA)).toBe('Edge')
      
      const unknownUA = 'SomeUnknownBrowser/1.0'
      expect(database.extractBrowserName(unknownUA)).toBe('Other')
    })
  })

  describe('updateResponseTimeStats', () => {
    test('should calculate response time statistics correctly', async () => {
      // First response time
      let stats = await database.updateResponseTimeStats(100)
      expect(stats.average).toBe(100)
      expect(stats.min).toBe(100)
      expect(stats.max).toBe(100)
      expect(stats.samples).toBe(1)
      
      // Second response time
      stats = await database.updateResponseTimeStats(200)
      expect(stats.average).toBe(150)
      expect(stats.min).toBe(100)
      expect(stats.max).toBe(200)
      expect(stats.samples).toBe(2)
      
      // Third response time
      stats = await database.updateResponseTimeStats(50)
      expect(stats.average).toBeCloseTo(116.67, 2)
      expect(stats.min).toBe(50)
      expect(stats.max).toBe(200)
      expect(stats.samples).toBe(3)
    })
  })

  describe('addRequestLog', () => {
    test('should add request log entry', async () => {
      const logEntry = {
        method: 'GET',
        path: '/api/test',
        statusCode: 200,
        responseTime: 150
      }
      
      const logCount = await database.addRequestLog(logEntry)
      expect(logCount).toBe(1)
      
      const analytics = await database.getAnalytics()
      expect(analytics.requestLogs).toHaveLength(1)
      expect(analytics.requestLogs[0]).toMatchObject(logEntry)
      expect(analytics.requestLogs[0]).toHaveProperty('timestamp')
    })

    test('should limit request logs to 1000 entries', async () => {
      // Add 1001 log entries
      for (let i = 0; i < 1001; i++) {
        await database.addRequestLog({
          method: 'GET',
          path: `/api/test-${i}`,
          statusCode: 200,
          responseTime: 100
        })
      }
      
      const analytics = await database.getAnalytics()
      expect(analytics.requestLogs).toHaveLength(1000)
      
      // Should keep the most recent entries
      expect(analytics.requestLogs[0].path).toBe('/api/test-1')
      expect(analytics.requestLogs[999].path).toBe('/api/test-1000')
    })
  })

  describe('integration tests', () => {
    test('should handle multiple analytics operations together', async () => {
      const visitorId = 'test-visitor'
      
      // Simulate a complete request cycle
      await database.addVisitor(visitorId)
      await database.incrementVisits()
      await database.updatePageStats('/home')
      await database.updateHourlyStats()
      await database.updateReferrerStats('https://google.com')
      await database.updateUserAgentStats('Mozilla/5.0 Chrome/91.0')
      await database.updateResponseTimeStats(120)
      await database.addRequestLog({
        method: 'GET',
        path: '/home',
        statusCode: 200,
        responseTime: 120
      })
      
      const analytics = await database.getAnalytics()
      
      expect(analytics.totalVisits).toBe(1)
      expect(analytics.uniqueVisitors).toBe(1)
      expect(analytics.popularPages['/home']).toBe(1)
      expect(analytics.referrers['https://google.com']).toBe(1)
      expect(analytics.userAgents.Chrome).toBe(1)
      expect(analytics.responseTimeStats.average).toBe(120)
      expect(analytics.requestLogs).toHaveLength(1)
      
      const today = new Date().toISOString().split('T')[0]
      const currentHour = new Date().getHours()
      expect(analytics.dailyStats[today].visits).toBe(1)
      expect(analytics.hourlyStats[currentHour]).toBe(1)
    })
  })
})