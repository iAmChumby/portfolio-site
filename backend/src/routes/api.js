import express from 'express'
import database from '../config/database.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { DatabaseError, NotFoundError, ValidationError } from '../utils/errors.js'

const router = express.Router()

// Get user profile
router.get('/user', asyncHandler(async (req, res) => {
  const user = await database.getUser()
  
  if (!user) {
    throw new NotFoundError('User profile')
  }
  
  res.json({
    success: true,
    data: user
  })
}))

// Get repositories
router.get('/repositories', asyncHandler(async (req, res) => {
  const repositories = await database.getRepositories()
  
  if (!repositories) {
    throw new DatabaseError('Failed to fetch repositories', 'getRepositories')
  }
  
  res.json({
    success: true,
    data: repositories,
    count: repositories.length
  })
}))

// Get featured repositories
router.get('/repositories/featured', asyncHandler(async (req, res) => {
  const repositories = await database.getRepositories()
  const limit = parseInt(req.query.limit) || 6
  
  if (!repositories) {
    throw new DatabaseError('Failed to fetch repositories', 'getRepositories')
  }
  
  if (limit < 1 || limit > 50) {
    throw new ValidationError('Limit must be between 1 and 50')
  }
  
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
    data: featured,
    count: featured.length
  })
}))

// Get languages
router.get('/languages', asyncHandler(async (req, res) => {
  const languages = await database.getLanguages()
  
  if (!languages) {
    throw new DatabaseError('Failed to fetch languages', 'getLanguages')
  }
  
  res.json({
    success: true,
    data: languages
  })
}))

// Get activity/events
router.get('/activity', asyncHandler(async (req, res) => {
  const activity = await database.getActivity()
  
  if (!activity) {
    throw new DatabaseError('Failed to fetch activity', 'getActivity')
  }
  
  const limit = parseInt(req.query.limit) || activity.length
  
  if (limit < 1) {
    throw new ValidationError('Limit must be greater than 0')
  }
  
  const limitedActivity = activity.slice(0, limit)
  
  res.json({
    success: true,
    data: limitedActivity,
    count: limitedActivity.length
  })
}))

// Get workflow runs
router.get('/workflows', asyncHandler(async (req, res) => {
  const workflows = await database.getWorkflows()
  
  if (!workflows) {
    throw new DatabaseError('Failed to fetch workflows', 'getWorkflows')
  }
  
  res.json({
    success: true,
    data: workflows,
    count: workflows.length
  })
}))

// Get stats
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = await database.getStats()
  
  if (!stats) {
    throw new DatabaseError('Failed to fetch stats', 'getStats')
  }
  
  res.json({
    success: true,
    data: stats
  })
}))

// Get all data
router.get('/all', asyncHandler(async (req, res) => {
  const allData = await database.getAllData()
  
  if (!allData) {
    throw new DatabaseError('Failed to fetch all data', 'getAllData')
  }
  
  res.json({
    success: true,
    data: allData
  })
}))

export default router
