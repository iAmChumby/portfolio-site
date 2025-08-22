import express from 'express'
import path from 'path'
import { promises as fs } from 'fs'
import database from '../config/database.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { DatabaseError, NotFoundError, ValidationError, AuthenticationError } from '../utils/errors.js'

const router = express.Router()

// Import DataSyncJob singleton instance
import dataSyncJobInstance from '../jobs/dataSync.js'

// Admin key verification middleware
const verifyAdminKey = (req, res, next) => {
  const adminKey = process.env.ADMIN_KEY
  
  if (!adminKey) {
    return res.status(500).json({ 
      error: 'Admin access not configured' 
    })
  }

  const providedKey = req.body.adminKey || req.headers['x-admin-key']
  
  if (!providedKey || providedKey !== adminKey) {
    return res.status(401).json({ 
      error: 'Invalid admin key' 
    })
  }

  next()
}

// Verify admin access
router.post('/verify', verifyAdminKey, (req, res) => {
  res.json({ 
    success: true, 
    message: 'Admin access verified' 
  })
})

// Get all data for dashboard
router.get('/all', verifyAdminKey, async (req, res) => {
  try {
    await database.initialize()
    const data = await database.getAllData()

    res.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    res.status(500).json({ 
      error: 'Failed to fetch dashboard data' 
    })
  }
})

// Trigger manual data refresh
router.post('/refresh', verifyAdminKey, async (req, res) => {
  try {
    if (dataSyncJobInstance.isRunning) {
      return res.status(409).json({ 
        error: 'Data sync is already in progress' 
      })
    }
    
    // Use the singleton instance to sync data
    await dataSyncJobInstance.syncAllData()

    res.json({ 
      success: true, 
      message: 'Data refresh completed successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error during manual refresh:', error)
    res.status(500).json({ 
      error: 'Failed to refresh data',
      details: error.message
    })
  }
})

// Get analytics data
router.get('/analytics', verifyAdminKey, asyncHandler(async (req, res) => {
  await database.initialize()
  const analytics = await database.getAnalytics()
  
  // Check if analytics data exists
  if (!analytics) {
    throw new DatabaseError('Analytics data not found', 'getAnalytics')
  }
  
  // Process daily visits for the last 30 days
  const dailyVisits = Object.entries(analytics.dailyStats || {})
    .slice(-30)
    .map(([date, stats]) => ({
      date,
      visits: stats.visits || 0,
      uniqueVisitors: stats.uniqueVisitors.length
    }))
  
  // Get top 10 popular pages
  const popularPages = Object.entries(analytics.popularPages || {})
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([page, visits]) => ({ page, visits }))
  
  // Get recent visitors (last 50 from request logs)
  const recentVisitors = (analytics.requestLogs || [])
    .slice(-50)
    .map(log => ({
      ip: log.ip,
      timestamp: log.timestamp,
      userAgent: log.userAgent,
      path: log.path
    }))

  res.json({
    success: true,
    data: {
      summary: {
        totalVisits: analytics.totalVisits || 0,
        uniqueVisitors: analytics.uniqueVisitors || 0,
        topPages: popularPages.slice(0, 5),
        dailyStats: {
          today: dailyVisits[dailyVisits.length - 1]?.visits || 0,
          todayUnique: dailyVisits[dailyVisits.length - 1]?.uniqueVisitors || 0
        }
      },
      dailyVisits,
      popularPages,
      recentVisitors
    }
  })
}))

// Get system information
router.get('/system', verifyAdminKey, (req, res) => {
  const memoryUsage = process.memoryUsage()
  const formatBytes = (bytes) => Math.round(bytes / 1024 / 1024) + ' MB'
  
  const systemInfo = {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    uptime: process.uptime(),
    memory: {
      rss: formatBytes(memoryUsage.rss),
      heapTotal: formatBytes(memoryUsage.heapTotal),
      heapUsed: formatBytes(memoryUsage.heapUsed)
    },
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    pid: process.pid,
    cwd: process.cwd(),
    versions: process.versions
  }

  res.json({
    success: true,
    data: systemInfo
  })
})

// Get logs (last 100 lines)
router.get('/logs', verifyAdminKey, asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 100
  const level = req.query.level || 'all'
  
  if (limit < 1 || limit > 1000) {
    throw new ValidationError('Limit must be between 1 and 1000')
  }
  
  const validLevels = ['all', 'error', 'warn', 'info', 'debug']
  if (!validLevels.includes(level)) {
    throw new ValidationError(`Level must be one of: ${validLevels.join(', ')}`)
  }
  
  const logsPath = path.join(process.cwd(), 'logs')
  
  try {
    const files = await fs.readdir(logsPath)
    const logFiles = files.filter(file => file.endsWith('.log'))
    
    if (logFiles.length === 0) {
      return res.json({
        success: true,
        data: {
          logs: [],
          message: 'Logs directory not found or empty'
        }
      })
    }

    // Get the most recent log file
    const latestLogFile = logFiles.sort().reverse()[0]
    const logContent = await fs.readFile(path.join(logsPath, latestLogFile), 'utf8')
    let logLines = logContent.split('\n').filter(line => line.trim())
    
    // Filter by level if specified
    if (level !== 'all') {
      logLines = logLines.filter(line => line.toLowerCase().includes(level.toLowerCase()))
    }
    
    // Apply limit
    logLines = logLines.slice(-limit)

    res.json({
      success: true,
      data: {
        logs: logLines,
        file: latestLogFile,
        totalLines: logLines.length,
        level,
        limit
      }
    })
  } catch (error) {
    res.json({
      success: true,
      data: {
        logs: [],
        message: 'Logs directory not found or empty'
      }
    })
  }
}))

export default router
