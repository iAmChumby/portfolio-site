import crypto from 'crypto'
import database from '../config/database.js'
import { DatabaseError } from '../utils/errors.js'

/**
 * Generate a unique visitor ID based on IP and User-Agent
 * @param {string} ip - Client IP address
 * @param {string} userAgent - Client User-Agent string
 * @returns {string} - Unique visitor ID
 */
export function generateVisitorId(ip, userAgent) {
  const data = `${ip}-${userAgent}`
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16)
}

/**
 * Check if a request path should be excluded from analytics
 * @param {string} path - Request path
 * @returns {boolean} - True if path should be excluded
 */
export function shouldExcludePath(path) {
  const excludedPaths = [
    '/health',
    '/api/health',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/_next',
    '/static'
  ]
  
  return excludedPaths.some(excludedPath => 
    path === excludedPath || path.startsWith(excludedPath)
  )
}

/**
 * Analytics middleware to track requests
 * @returns {Function} - Express middleware function
 */
export function analyticsMiddleware() {
  return (req, res, next) => {
    // Skip analytics for excluded paths
    if (shouldExcludePath(req.path)) {
      return next()
    }

    const startTime = Date.now()
    const visitorId = generateVisitorId(
      req.ip || req.connection.remoteAddress || 'unknown',
      req.get('User-Agent') || 'unknown'
    )

    // Override res.end to capture response data
    const originalEnd = res.end
    res.end = function(...args) {
      const endTime = Date.now()
      const responseTime = endTime - startTime

      // Log request and track visitor asynchronously to avoid blocking response
      setImmediate(async () => {
        try {
          // Increment total visits
          await database.incrementVisits()
          
          // Add visitor (handles uniqueness internally)
          const visitorId = generateVisitorId(req.ip || req.connection.remoteAddress || 'unknown', req.get('User-Agent'))
          await database.addVisitor(visitorId, req.get('User-Agent'))
          
          // Update page statistics
          await database.updatePageStats(req.path)
          
          // Update hourly statistics
          await database.updateHourlyStats()
          
          // Update referrer statistics
          const referrer = req.get('Referer')
          if (referrer) {
            await database.updateReferrerStats(referrer)
          }
          
          // Update user agent statistics
          const userAgent = req.get('User-Agent')
          if (userAgent) {
            await database.updateUserAgentStats(userAgent)
          }
          
          // Update response time statistics
          await database.updateResponseTimeStats(responseTime)
          
          // Add request log
          await database.addRequestLog({
            timestamp: new Date(),
            method: req.method,
            url: req.path,
            userAgent: req.get('User-Agent'),
            ip: req.ip || req.connection.remoteAddress || 'unknown',
            referrer: req.get('Referer'),
            responseTime,
            statusCode: res.statusCode,
            visitorId
          })
        } catch (error) {
          // Log error but don't throw to avoid breaking the response
          console.error('Analytics logging error:', error.message)
        }
      })

      // Call original end method
      originalEnd.apply(this, args)
    }

    next()
  }
}

/**
 * Get analytics summary with formatted data
 * @param {Database} database - Database instance
 * @returns {Object} - Formatted analytics summary
 */
export async function getAnalyticsSummary() {
  try {
    const analytics = await database.getAnalytics()
    
    if (!analytics || !analytics.popularPages) {
      throw new DatabaseError('Failed to fetch analytics summary', 'getAnalytics')
    }
    
    // Get top 5 pages
    const topPages = Object.entries(analytics.popularPages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([page, visits]) => ({ page, visits }))
    
    // Get today's stats
    const today = new Date().toISOString().split('T')[0]
    const todayStats = analytics.dailyStats[today] || { visits: 0, uniqueVisitors: 0 }
    
    return {
      totalVisits: analytics.totalVisits,
      uniqueVisitors: analytics.uniqueVisitors,
      dailyStats: {
        today: todayStats.visits,
        todayUnique: todayStats.uniqueVisitors
      },
      hourlyStats: analytics.hourlyStats,
      topPages
    }
  } catch (error) {
    console.error('Error getting analytics summary:', error)
    throw error
  }
}

export default analyticsMiddleware