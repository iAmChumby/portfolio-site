import express from 'express'
import database from '../config/database.js'

const router = express.Router()

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Get user data
router.get('/user', async (req, res) => {
  try {
    const user = await database.getUser()
    const lastUpdated = await database.getLastUpdated()
    
    res.json({
      data: user,
      lastUpdated,
      cached: true
    })
  } catch (error) {
    console.error('Error fetching user data:', error)
    res.status(500).json({
      error: 'Failed to fetch user data',
      message: error.message
    })
  }
})

// Get repositories
router.get('/repositories', async (req, res) => {
  try {
    const repositories = await database.getRepositories()
    const lastUpdated = await database.getLastUpdated()
    
    res.json({
      data: repositories,
      lastUpdated,
      cached: true
    })
  } catch (error) {
    console.error('Error fetching repositories:', error)
    res.status(500).json({
      error: 'Failed to fetch repositories',
      message: error.message
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
    
    const lastUpdated = await database.getLastUpdated()
    
    res.json({
      data: featured,
      lastUpdated,
      cached: true
    })
  } catch (error) {
    console.error('Error fetching featured repositories:', error)
    res.status(500).json({
      error: 'Failed to fetch featured repositories',
      message: error.message
    })
  }
})

// Get languages
router.get('/languages', async (req, res) => {
  try {
    const languages = await database.getLanguages()
    const lastUpdated = await database.getLastUpdated()
    
    // Convert to array and sort by percentage
    const languageArray = Object.entries(languages)
      .map(([name, data]) => ({
        name,
        ...data
      }))
      .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
    
    res.json({
      data: languageArray,
      lastUpdated,
      cached: true
    })
  } catch (error) {
    console.error('Error fetching languages:', error)
    res.status(500).json({
      error: 'Failed to fetch languages',
      message: error.message
    })
  }
})

// Get activity/events
router.get('/activity', async (req, res) => {
  try {
    const activity = await database.getActivity()
    const lastUpdated = await database.getLastUpdated()
    
    res.json({
      data: activity,
      lastUpdated,
      cached: true
    })
  } catch (error) {
    console.error('Error fetching activity:', error)
    res.status(500).json({
      error: 'Failed to fetch activity',
      message: error.message
    })
  }
})

// Get workflow runs
router.get('/workflows', async (req, res) => {
  try {
    const workflows = await database.getWorkflows()
    const lastUpdated = await database.getLastUpdated()
    
    res.json({
      data: workflows,
      lastUpdated,
      cached: true
    })
  } catch (error) {
    console.error('Error fetching workflows:', error)
    res.status(500).json({
      error: 'Failed to fetch workflows',
      message: error.message
    })
  }
})

// Get stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await database.getStats()
    const lastUpdated = await database.getLastUpdated()
    
    res.json({
      data: stats,
      lastUpdated,
      cached: true
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({
      error: 'Failed to fetch stats',
      message: error.message
    })
  }
})

// Get all data
router.get('/all', async (req, res) => {
  try {
    const allData = await database.getAllData()
    
    res.json({
      data: allData,
      cached: true
    })
  } catch (error) {
    console.error('Error fetching all data:', error)
    res.status(500).json({
      error: 'Failed to fetch all data',
      message: error.message
    })
  }
})

export default router