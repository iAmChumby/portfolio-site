import { jest } from '@jest/globals'
import request from 'supertest'
import express from 'express'

// Mock the database
const mockDatabase = {
  getUser: jest.fn(),
  getRepositories: jest.fn(),
  getLanguages: jest.fn(),
  getActivity: jest.fn(),
  getWorkflows: jest.fn(),
  getStats: jest.fn(),
  getAllData: jest.fn()
}

// Mock the database module BEFORE importing the routes
jest.unstable_mockModule('../src/config/database.js', () => ({
  default: mockDatabase
}))

// Import the routes AFTER setting up the mock
const { default: apiRoutes } = await import('../src/routes/api.js')
const { errorHandler, requestId } = await import('../src/middleware/errorHandler.js')

describe('API Routes', () => {
  let app

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use(requestId)
    app.use('/api', apiRoutes)
    app.use(errorHandler)
    
    // Clear all mocks
    jest.clearAllMocks()
  })

  describe('GET /api/health', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        message: 'API is healthy',
        timestamp: expect.any(String),
        uptime: expect.any(Number),
        memory: expect.any(Object)
      })
    })
  })

  describe('GET /api/user', () => {
    test('should return user data', async () => {
      const mockUserData = {
        login: 'testuser',
        name: 'Test User',
        bio: 'Test bio'
      }
      
      mockDatabase.getUser.mockReturnValue(mockUserData)

      const response = await request(app)
        .get('/api/user')
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        data: mockUserData
      })
      expect(mockDatabase.getUser).toHaveBeenCalledTimes(1)
    })

    test('should handle missing user data', async () => {
      mockDatabase.getUser.mockReturnValue(null)

      const response = await request(app)
        .get('/api/user')
        .expect(404)

      expect(response.body).toEqual({
        success: false,
        error: {
          message: 'User profile not found',
          code: 'NOT_FOUND',
          resource: 'User profile',
          stack: expect.any(String)
        },
        requestId: expect.any(String),
        timestamp: expect.any(String)
      })
    })
  })

  describe('GET /api/repositories', () => {
    test('should return repositories data', async () => {
      const mockReposData = [
        { id: 1, name: 'repo1', stargazers_count: 10 },
        { id: 2, name: 'repo2', stargazers_count: 5 }
      ]
      
      mockDatabase.getRepositories.mockReturnValue(mockReposData)

      const response = await request(app)
        .get('/api/repositories')
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        data: mockReposData,
        count: 2
      })
      expect(mockDatabase.getRepositories).toHaveBeenCalledTimes(1)
    })

    test('should handle empty repositories', async () => {
      mockDatabase.getRepositories.mockReturnValue([])

      const response = await request(app)
        .get('/api/repositories')
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        data: [],
        count: 0
      })
    })
  })

  describe('GET /api/repositories/featured', () => {
    test('should return featured repositories', async () => {
      const mockReposData = [
        { id: 1, name: 'repo1', stargazers_count: 20, fork: false },
        { id: 2, name: 'repo2', stargazers_count: 15, fork: false },
        { id: 3, name: 'repo3', stargazers_count: 10, fork: false },
        { id: 4, name: 'fork-repo', stargazers_count: 25, fork: true }
      ]
      
      mockDatabase.getRepositories.mockReturnValue(mockReposData)

      const response = await request(app)
        .get('/api/repositories/featured')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(3) // Should exclude forks
      expect(response.body.data[0].stargazers_count).toBe(20) // Should be sorted by stars
    })

    test('should respect limit parameter', async () => {
      const mockReposData = [
        { id: 1, name: 'repo1', stargazers_count: 20, fork: false },
        { id: 2, name: 'repo2', stargazers_count: 15, fork: false },
        { id: 3, name: 'repo3', stargazers_count: 10, fork: false }
      ]
      
      mockDatabase.getRepositories.mockReturnValue(mockReposData)

      const response = await request(app)
        .get('/api/repositories/featured?limit=2')
        .expect(200)

      expect(response.body.data).toHaveLength(2)
    })
  })

  describe('GET /api/languages', () => {
    test('should return languages data', async () => {
      const mockLanguagesData = {
        JavaScript: 1000,
        Python: 800,
        TypeScript: 600
      }
      
      mockDatabase.getLanguages.mockReturnValue(mockLanguagesData)

      const response = await request(app)
        .get('/api/languages')
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        data: mockLanguagesData
      })
      expect(mockDatabase.getLanguages).toHaveBeenCalledTimes(1)
    })
  })

  describe('GET /api/activity', () => {
    test('should return activity data', async () => {
      const mockActivityData = [
        { id: '1', type: 'PushEvent', date: '2023-01-01T00:00:00Z' },
        { id: '2', type: 'CreateEvent', date: '2023-01-02T00:00:00Z' }
      ]
      
      mockDatabase.getActivity.mockReturnValue(mockActivityData)

      const response = await request(app)
        .get('/api/activity')
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        data: mockActivityData,
        count: 2
      })
      expect(mockDatabase.getActivity).toHaveBeenCalledTimes(1)
    })

    test('should respect limit parameter', async () => {
      const mockActivityData = Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 1}`,
        type: 'PushEvent',
        date: `2023-01-${String(i + 1).padStart(2, '0')}T00:00:00Z`
      }))
      
      mockDatabase.getActivity.mockReturnValue(mockActivityData)

      const response = await request(app)
        .get('/api/activity?limit=5')
        .expect(200)

      expect(response.body.data).toHaveLength(5)
    })
  })

  describe('GET /api/workflows', () => {
    test('should return workflows data', async () => {
      const mockWorkflowsData = [
        { id: 1, name: 'CI', status: 'completed', conclusion: 'success' },
        { id: 2, name: 'Deploy', status: 'in_progress', conclusion: null }
      ]
      
      mockDatabase.getWorkflows.mockReturnValue(mockWorkflowsData)

      const response = await request(app)
        .get('/api/workflows')
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        data: mockWorkflowsData,
        count: 2
      })
      expect(mockDatabase.getWorkflows).toHaveBeenCalledTimes(1)
    })
  })

  describe('GET /api/stats', () => {
    test('should return stats data', async () => {
      const mockStatsData = {
        totalRepos: 15,
        totalStars: 100,
        totalForks: 25,
        totalCommits: 500
      }
      
      mockDatabase.getStats.mockReturnValue(mockStatsData)

      const response = await request(app)
        .get('/api/stats')
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        data: mockStatsData
      })
      expect(mockDatabase.getStats).toHaveBeenCalledTimes(1)
    })
  })

  describe('GET /api/all', () => {
    test('should return all data', async () => {
      const mockAllData = {
        user: { name: 'Test User' },
        repositories: [{ name: 'repo1' }],
        languages: { JavaScript: 1000 },
        activity: [{ type: 'PushEvent' }],
        workflows: [{ name: 'CI' }],
        stats: { totalRepos: 1 },
        lastUpdated: {
          user: '2023-01-01T00:00:00Z',
          repositories: '2023-01-01T00:00:00Z'
        }
      }
      
      mockDatabase.getAllData.mockReturnValue(mockAllData)

      const response = await request(app)
        .get('/api/all')
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        data: mockAllData
      })
      expect(mockDatabase.getAllData).toHaveBeenCalledTimes(1)
    })
  })

  describe('Error handling', () => {
    test('should handle database errors', async () => {
      mockDatabase.getUser.mockImplementation(() => {
        throw new Error('Database connection failed')
      })

      const response = await request(app)
        .get('/api/user')
        .expect(500)

      expect(response.body).toEqual({
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
          originalError: 'Database connection failed',
          stack: expect.any(String)
        },
        requestId: expect.any(String),
        timestamp: expect.any(String)
      })
    })
  })
})
