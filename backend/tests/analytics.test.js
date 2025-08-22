import { jest } from '@jest/globals'
import express from 'express'
import request from 'supertest'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  analyticsMiddleware,
  getAnalyticsSummary,
  generateVisitorId,
  shouldExcludePath
} from '../src/middleware/analytics.js'
import database from '../src/config/database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const testDbPath = path.join(__dirname, '../data/test-analytics-middleware.json')

describe('Analytics Middleware', () => {
  beforeEach(async () => {
    // Clean up any existing test database files
    try {
      await fs.unlink(testDbPath)
    } catch (error) {
      // File doesn't exist, that's fine
    }
    
    // Also clean up any temporary files that might exist
    try {
      await fs.unlink(testDbPath + '.tmp')
    } catch (error) {
      // File doesn't exist, that's fine
    }
    
    // Reset the database instance
    database.isInitialized = false
    database.db = null
    
    // Set test database path
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
  })
  
  afterEach(async () => {
    // Clean up test database and temporary files
    const filesToClean = [testDbPath, testDbPath + '.tmp']
    
    for (const filePath of filesToClean) {
      try {
        await fs.unlink(filePath)
      } catch (error) {
        // File doesn't exist, that's fine
      }
    }
    
    // Reset database state
    database.isInitialized = false
    database.db = null
  })
  let app

  beforeEach(() => {
    app = express()
    app.use(analyticsMiddleware())
    app.get('/test', (req, res) => res.json({ message: 'test' }))
    app.get('/health', (req, res) => res.json({ status: 'ok' }))
  })

  describe('generateVisitorId', () => {
    test('should generate unique visitor ID', () => {
      const ip = '192.168.1.1'
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      
      const id1 = generateVisitorId(ip, userAgent)
      const id2 = generateVisitorId(ip, userAgent)
      
      expect(id1).toBeDefined()
      expect(typeof id1).toBe('string')
      expect(id1.length).toBe(16)
      expect(id1).not.toBe(id2) // Should be unique due to timestamp and random
    })
  })

  describe('shouldExcludePath', () => {
    test('should exclude health check paths', () => {
      expect(shouldExcludePath('/health')).toBe(true)
      expect(shouldExcludePath('/api/health')).toBe(true)
    })

    test('should exclude static asset paths', () => {
      expect(shouldExcludePath('/favicon.ico')).toBe(true)
      expect(shouldExcludePath('/robots.txt')).toBe(true)
      expect(shouldExcludePath('/_next/static/css/app.css')).toBe(true)
      expect(shouldExcludePath('/static/images/logo.png')).toBe(true)
    })

    test('should not exclude regular API paths', () => {
      expect(shouldExcludePath('/api/projects')).toBe(false)
      expect(shouldExcludePath('/api/admin/dashboard')).toBe(false)
      expect(shouldExcludePath('/')).toBe(false)
      expect(shouldExcludePath('/about')).toBe(false)
    })
  })

  describe('middleware functionality', () => {
    test('should track requests to non-excluded paths', async () => {
      await request(app)
        .get('/test')
        .expect(200)
      
      // Wait a bit for async operations
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const analytics = await database.getAnalytics()
      expect(analytics.totalVisits).toBeGreaterThan(0)
    })

    test('should not track requests to excluded paths', async () => {
      const initialAnalytics = await database.getAnalytics()
      const initialVisits = initialAnalytics.totalVisits
      
      await request(app)
        .get('/health')
        .expect(200)
      
      // Wait a bit for async operations
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const finalAnalytics = await database.getAnalytics()
      expect(finalAnalytics.totalVisits).toBe(initialVisits)
    })

    test('should handle errors gracefully', async () => {
      // Should still respond successfully even if analytics fails
      await request(app)
        .get('/test')
        .expect(200)
    })
  })

  describe('getAnalyticsSummary', () => {
    test('should return formatted analytics summary', async () => {
      // Add some test data first
      await database.incrementVisits()
      await database.addVisitor('127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
      await database.updatePageStats('/test')
      
      const summary = await getAnalyticsSummary()
      
      expect(summary).toHaveProperty('totalVisits')
      expect(summary).toHaveProperty('uniqueVisitors')
      expect(summary).toHaveProperty('dailyStats')
      expect(summary).toHaveProperty('hourlyStats')
      expect(summary).toHaveProperty('topPages')
      expect(summary.topPages).toBeInstanceOf(Array)
    })

    test('should handle empty analytics data', async () => {
      const summary = await getAnalyticsSummary()
      
      expect(summary.totalVisits).toBe(0)
      expect(summary.uniqueVisitors).toBe(0)
      expect(summary.topPages).toEqual([])
    })

    test('should handle database errors', async () => {
      // Simulate database error by using invalid database state
      database.db = null
      
      await expect(getAnalyticsSummary())
        .rejects
        .toThrow()
    })
  })
})