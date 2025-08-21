import express from 'express'
import database from '../config/database.js'

const router = express.Router()

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0'
  })
})

// Get user data
router.get('/user', async (req, res) => {
  try {
    const user = await database.getUser()
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User data not found'
      })
    }
    
    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get repositories
router.get('/repositories', async (req, res) => {
  try {
    const repositories = await database.getRepositories()
    
    res.json({
      success: true,
      data: repositories,
      count: repositories.length
    })
  } catch (error) {
    console.error('Error fetching repositories:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get featured repositories
router.get('/repositories/featured', async (req, res) => {
  try {
    const repositories = await database.getRepositories()
    const limit = parseInt(req.query.limit) || 6
    
    // Filter and sort featured repositories
    const featured = repositories
      .filter(repo => !repo.fork)
      .sort((a, b) => {
        const starDiff = (b.stargazers_count || 0) - (a.stargazers_count || 0)
        if (starDiff !== 0) return starDiff
        return new Date(b.updated_at) - new Date(a.updated_at)
      })
      .slice(0, limit)
    
    res.json({
      success: true,
      data: featured
    })
  } catch (error) {
    console.error('Error fetching featured repositories:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get languages
router.get('/languages', async (req, res) => {
  try {
    const languages = await database.getLanguages()
    
    res.json({
      success: true,
      data: languages
    })
  } catch (error) {
    console.error('Error fetching languages:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get activity/events
router.get('/activity', async (req, res) => {
  try {
    const activity = await database.getActivity()
    const limit = parseInt(req.query.limit) || activity.length
    
    const limitedActivity = activity.slice(0, limit)
    
    res.json({
      success: true,
      data: limitedActivity,
      count: limitedActivity.length
    })
  } catch (error) {
    console.error('Error fetching activity:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get workflow runs
router.get('/workflows', async (req, res) => {
  try {
    const workflows = await database.getWorkflows()
    
    res.json({
      success: true,
      data: workflows,
      count: workflows.length
    })
  } catch (error) {
    console.error('Error fetching workflows:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await database.getStats()
    
    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get all data
router.get('/all', async (req, res) => {
  try {
    const allData = await database.getAllData()
    
    res.json({
      success: true,
      data: allData
    })
  } catch (error) {
    console.error('Error fetching all data:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router
