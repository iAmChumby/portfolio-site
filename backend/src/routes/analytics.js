import express from 'express'
import { getAnalyticsSummary } from '../middleware/analytics.js'
import database from '../config/database.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { DatabaseError, ValidationError } from '../utils/errors.js'

const router = express.Router()

/**
 * GET /api/analytics/summary
 * Get analytics summary including total visits, unique visitors, and top pages
 */
router.get('/summary', asyncHandler(async (req, res) => {
  try {
    const summary = await getAnalyticsSummary()
    
    if (!summary) {
      throw new DatabaseError('Failed to fetch analytics summary', 'getAnalyticsSummary')
    }
    
    res.json({
      success: true,
      data: summary
    })
  } catch (error) {
    if (error.message && error.message.includes('Cannot read properties of null')) {
      throw new DatabaseError('Failed to fetch analytics summary', 'database')
    }
    throw error
  }
}))

/**
 * GET /api/analytics/visits
 * Get total visits count
 */
router.get('/visits', asyncHandler(async (req, res) => {
  try {
    const analytics = await database.getAnalytics()
    
    if (!analytics) {
      throw new DatabaseError('Failed to fetch visits data', 'getAnalytics')
    }
    
    res.json({
      success: true,
      data: {
        totalVisits: analytics.totalVisits || 0
      }
    })
  } catch (error) {
    if (error.message && error.message.includes('Cannot read properties of null')) {
      throw new DatabaseError('Failed to fetch visits data', 'database')
    }
    throw error
  }
}))

/**
 * GET /api/analytics/visitors
 * Get unique visitors count
 */
router.get('/visitors', asyncHandler(async (req, res) => {
  try {
    const analytics = await database.getAnalytics()
    
    if (!analytics) {
      throw new DatabaseError('Failed to fetch visitors data', 'getAnalytics')
    }
    
    res.json({
      success: true,
      data: {
        uniqueVisitors: analytics.uniqueVisitors || 0
      }
    })
  } catch (error) {
    if (error.message && error.message.includes('Cannot read properties of null')) {
      throw new DatabaseError('Failed to fetch visitors data', 'database')
    }
    throw error
  }
}))

/**
 * GET /api/analytics/daily
 * Get daily statistics
 */
router.get('/daily', asyncHandler(async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30
    
    if (days < 1 || days > 365) {
      throw new ValidationError('Days must be between 1 and 365')
    }
    
    const analytics = await database.getAnalytics()
    
    if (!analytics) {
      throw new DatabaseError('Failed to fetch daily stats', 'getAnalytics')
    }
    
    // Get last N days of data
    const dailyStats = analytics.dailyStats || {}
    const sortedDays = Object.keys(dailyStats)
      .sort((a, b) => new Date(b) - new Date(a))
      .slice(0, days)
    
    const limitedStats = {}
    sortedDays.forEach(day => {
      limitedStats[day] = dailyStats[day]
    })
    
    res.json({
      success: true,
      data: {
        dailyStats: limitedStats
      },
      count: sortedDays.length,
      period: `${days} days`
    })
  } catch (error) {
    if (error.message && error.message.includes('Cannot read properties of null')) {
      throw new DatabaseError('Failed to fetch daily stats', 'database')
    }
    throw error
  }
}))

/**
 * GET /api/analytics/hourly
 * Get hourly statistics for today
 */
router.get('/hourly', asyncHandler(async (req, res) => {
  try {
    const analytics = await database.getAnalytics()
    
    if (!analytics) {
      throw new DatabaseError('Failed to fetch hourly statistics', 'getAnalytics')
    }
    
    res.json({
      success: true,
      data: {
        hourlyStats: analytics.hourlyStats || {}
      }
    })
  } catch (error) {
    if (error.message && error.message.includes('Cannot read properties of null')) {
      throw new DatabaseError('Failed to fetch hourly statistics', 'database')
    }
    throw error
  }
}))

/**
 * GET /api/analytics/pages
 * Get popular pages statistics
 */
router.get('/pages', asyncHandler(async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10
    
    if (limit < 1 || limit > 50) {
      throw new ValidationError('Limit must be between 1 and 50')
    }
    
    const analytics = await database.getAnalytics()
    
    if (!analytics) {
      throw new DatabaseError('Failed to fetch popular pages', 'getAnalytics')
    }
    
    const popularPages = analytics.popularPages || {}
    const topPages = Object.entries(popularPages)
      .map(([path, visits]) => ({ path, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, limit)
    
    res.json({
      success: true,
      data: {
        topPages
      },
      count: topPages.length,
      limit
    })
  } catch (error) {
    if (error.message && error.message.includes('Cannot read properties of null')) {
      throw new DatabaseError('Failed to fetch popular pages', 'database')
    }
    throw error
  }
}))

/**
 * GET /api/analytics/referrers
 * Get referrer statistics
 */
router.get('/referrers', asyncHandler(async (req, res) => {
  try {
    const analytics = await database.getAnalytics()
    const { limit = 10 } = req.query
    
    if (!analytics) {
      throw new DatabaseError('Failed to fetch referrers statistics', 'getAnalytics')
    }
    
    // Convert referrers object to sorted array
    const referrers = analytics.referrers || {}
    const topReferrers = Object.entries(referrers)
      .map(([source, visits]) => ({ source, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, parseInt(limit))
    
    res.json({
      success: true,
      data: {
        topReferrers
      }
    })
  } catch (error) {
    if (error.message && error.message.includes('Cannot read properties of null')) {
      throw new DatabaseError('Failed to fetch referrers statistics', 'database')
    }
    throw error
  }
}))

/**
 * GET /api/analytics/browsers
 * Get browser/user agent statistics
 */
router.get('/browsers', asyncHandler(async (req, res) => {
  try {
    const analytics = await database.getAnalytics()
    const { limit = 10 } = req.query
    
    if (!analytics) {
      throw new DatabaseError('Failed to fetch browser statistics', 'getAnalytics')
    }
    
    // Convert userAgents object to sorted array
    const userAgents = analytics.userAgents || {}
    const browserStats = Object.entries(userAgents)
      .map(([browser, visits]) => ({ browser, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, parseInt(limit))
    
    res.json({
      success: true,
      data: {
        browserStats
      }
    })
  } catch (error) {
    if (error.message && error.message.includes('Cannot read properties of null')) {
      throw new DatabaseError('Failed to fetch browser statistics', 'database')
    }
    throw error
  }
}))

/**
 * GET /api/analytics/performance
 * Get response time statistics
 */
router.get('/performance', asyncHandler(async (req, res) => {
  try {
    const analytics = await database.getAnalytics()
    
    if (!analytics) {
      throw new DatabaseError('Failed to fetch performance statistics', 'getAnalytics')
    }
    
    res.json({
      success: true,
      data: {
        responseTimeStats: analytics.responseTimeStats || {
          average: 0,
          min: 0,
          max: 0,
          samples: 0
        }
      }
    })
  } catch (error) {
    if (error.message && error.message.includes('Cannot read properties of null')) {
      throw new DatabaseError('Failed to fetch performance statistics', 'database')
    }
    throw error
  }
}))

/**
 * GET /api/analytics/requests
 * Get recent request logs
 */
router.get('/requests', asyncHandler(async (req, res) => {
  try {
    const analytics = await database.getAnalytics()
    const { limit = 50 } = req.query
    
    if (!analytics) {
      throw new DatabaseError('Failed to fetch request logs', 'getAnalytics')
    }
    
    const requestLogs = analytics.requestLogs || []
    const recentRequests = requestLogs
      .slice(-parseInt(limit))
      .reverse() // Most recent first
    
    res.json({
      success: true,
      data: {
        recentRequests
      }
    })
  } catch (error) {
    if (error.message && error.message.includes('Cannot read properties of null')) {
      throw new DatabaseError('Failed to fetch request logs', 'database')
    }
    throw error
  }
}))

export default router