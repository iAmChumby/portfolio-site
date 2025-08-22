import express from 'express'
import path from 'path'
import { promises as fs } from 'fs'
import database from '../config/database.js'

const router = express.Router()

// Import DataSyncJob using dynamic import since it's an ES6 module
let dataSyncJobInstance = null;
(async () => {
  const module = await import('../jobs/dataSync.js')
  const DataSyncJob = module.default
  dataSyncJobInstance = new DataSyncJob()
  await dataSyncJobInstance.initialize()
})()

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
    if (!dataSyncJobInstance) {
      return res.status(500).json({ 
        error: 'DataSyncJob not initialized' 
      })
    }

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

// Get system information
router.get('/system', verifyAdminKey, (req, res) => {
  const uptime = process.uptime()
  const memoryUsage = process.memoryUsage()
  
  res.json({
    success: true,
    data: {
      uptime: Math.floor(uptime),
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB'
      },
      nodeVersion: process.version,
      platform: process.platform,
      timestamp: new Date().toISOString()
    }
  })
})

// Get logs (last 100 lines)
router.get('/logs', verifyAdminKey, async (req, res) => {
  try {
    const logsPath = path.join(process.cwd(), 'logs')
    
    try {
      const files = await fs.readdir(logsPath)
      const logFiles = files.filter(file => file.endsWith('.log'))
      
      if (logFiles.length === 0) {
        return res.json({
          success: true,
          data: {
            logs: [],
            message: 'No log files found'
          }
        })
      }

      // Get the most recent log file
      const latestLogFile = logFiles.sort().reverse()[0]
      const logContent = await fs.readFile(path.join(logsPath, latestLogFile), 'utf8')
      const logLines = logContent.split('\n').filter(line => line.trim()).slice(-100)

      res.json({
        success: true,
        data: {
          logs: logLines,
          file: latestLogFile,
          totalLines: logLines.length
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
  } catch (error) {
    console.error('Error fetching logs:', error)
    res.status(500).json({ 
      error: 'Failed to fetch logs' 
    })
  }
})

export default router
