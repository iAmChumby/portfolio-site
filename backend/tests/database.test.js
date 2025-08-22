import fs from 'fs/promises'
import database from '../src/config/database.js'

describe('Database', () => {
  const testDbPath = './data/test-database.json'

  beforeEach(async () => {
    // Clean up any existing test database
    try {
      await fs.unlink(testDbPath)
    } catch (error) {
      // File doesn't exist, that's fine
    }
    
    // Reset the database instance
    database.isInitialized = false
    database.db = null
  })

  afterEach(async () => {
    // Clean up test database
    try {
      await fs.unlink(testDbPath)
    } catch (error) {
      // File doesn't exist, that's fine
    }
  })

  describe('initialize', () => {
    test('should create database file with default structure', async () => {
      await database.initialize()
      
      const data = database.db.data
      expect(data).toHaveProperty('user')
      expect(data).toHaveProperty('repositories')
      expect(data).toHaveProperty('languages')
      expect(data).toHaveProperty('activity')
      expect(data).toHaveProperty('workflows')
      expect(data).toHaveProperty('stats')
      expect(data).toHaveProperty('lastUpdated')
    })

    test('should not overwrite existing data', async () => {
      await database.initialize()
      
      // Add some test data
      database.db.data.user = { name: 'Test User' }
      await database.db.write()
      
      // Reset and initialize again
      database.isInitialized = false
      await database.initialize()
      
      expect(database.db.data.user.name).toBe('Test User')
    })
  })

  describe('setUser', () => {
    beforeEach(async () => {
      await database.initialize()
    })

    test('should update user data', async () => {
      const userData = {
        login: 'testuser',
        name: 'Test User',
        bio: 'Test bio',
        public_repos: 10
      }

      await database.setUser(userData)
      
      const user = await database.getUser()
      expect(user).toEqual(userData)
      expect(database.db.data.lastUpdated).toBeDefined()
    })
  })

  describe('setRepositories', () => {
    beforeEach(async () => {
      await database.initialize()
    })

    test('should update repositories data', async () => {
      const reposData = [
        { id: 1, name: 'repo1', stargazers_count: 5 },
        { id: 2, name: 'repo2', stargazers_count: 10 }
      ]

      await database.setRepositories(reposData)
      
      const repositories = await database.getRepositories()
      expect(repositories).toEqual(reposData)
      expect(database.db.data.lastUpdated).toBeDefined()
    })
  })

  describe('setLanguages', () => {
    beforeEach(async () => {
      await database.initialize()
    })

    test('should update languages data', async () => {
      const languagesData = {
        JavaScript: 1000,
        Python: 800,
        TypeScript: 600
      }

      await database.setLanguages(languagesData)
      
      const languages = await database.getLanguages()
      expect(languages).toEqual(languagesData)
      expect(database.db.data.lastUpdated).toBeDefined()
    })
  })

  describe('setActivity', () => {
    beforeEach(async () => {
      await database.initialize()
    })

    test('should update activity data', async () => {
      const activityData = [
        { id: '1', type: 'PushEvent', created_at: '2023-01-01T00:00:00Z' },
        { id: '2', type: 'CreateEvent', created_at: '2023-01-02T00:00:00Z' }
      ]

      await database.setActivity(activityData)
      
      const activity = await database.getActivity()
      expect(activity).toEqual(activityData)
      expect(database.db.data.lastUpdated).toBeDefined()
    })
  })

  describe('setWorkflows', () => {
    beforeEach(async () => {
      await database.initialize()
    })

    test('should update workflows data', async () => {
      const workflowsData = [
        { id: 1, name: 'CI', status: 'completed', conclusion: 'success' },
        { id: 2, name: 'Deploy', status: 'in_progress', conclusion: null }
      ]

      await database.setWorkflows(workflowsData)
      
      const workflows = await database.getWorkflows()
      expect(workflows).toEqual(workflowsData)
      expect(database.db.data.lastUpdated).toBeDefined()
    })
  })

  describe('setStats', () => {
    beforeEach(async () => {
      await database.initialize()
    })

    test('should update stats data', async () => {
      const statsData = {
        totalRepos: 15,
        totalStars: 100,
        totalForks: 25,
        totalCommits: 500,
        followers: 0,
        following: 0
      }

      await database.setStats(statsData)
      
      const stats = await database.getStats()
      expect(stats).toEqual(statsData)
      expect(database.db.data.lastUpdated).toBeDefined()
    })
  })

  describe('getter methods', () => {
    beforeEach(async () => {
      await database.initialize()
      
      // Clear all data first
      database.db.data.user = null
      database.db.data.repositories = []
      database.db.data.languages = {}
      database.db.data.activity = []
      database.db.data.workflows = []
      database.db.data.stats = {
        totalStars: 0,
        totalForks: 0,
        totalRepos: 0,
        followers: 0,
        following: 0
      }
      
      // Set up test data
      database.db.data.user = { name: 'Test User' }
      database.db.data.repositories = [{ name: 'repo1' }]
      database.db.data.languages = { JavaScript: 1000 }
      database.db.data.activity = [{ type: 'PushEvent' }]
      database.db.data.workflows = [{ name: 'CI' }]
      database.db.data.stats = { totalRepos: 1 }
      
      await database.db.write()
    })

    test('getUser should return user data', async () => {
      const user = await database.getUser()
      expect(user).toEqual({ name: 'Test User' })
    })

    test('getRepositories should return repositories data', async () => {
      const repositories = await database.getRepositories()
      expect(repositories).toEqual([{ name: 'repo1' }])
    })

    test('getLanguages should return languages data', async () => {
      const languages = await database.getLanguages()
      expect(languages).toEqual({ JavaScript: 1000 })
    })

    test('getActivity should return activity data', async () => {
      const activity = await database.getActivity()
      expect(activity).toEqual([{ type: 'PushEvent' }])
    })

    test('getWorkflows should return workflows data', async () => {
      const workflows = await database.getWorkflows()
      expect(workflows).toEqual([{ name: 'CI' }])
    })

    test('getStats should return stats data', async () => {
      const stats = await database.getStats()
      expect(stats).toEqual({ totalRepos: 1 })
    })

    test('getAllData should return all data', async () => {
      const allData = await database.getAllData()
      
      expect(allData).toHaveProperty('user')
      expect(allData).toHaveProperty('repositories')
      expect(allData).toHaveProperty('languages')
      expect(allData).toHaveProperty('activity')
      expect(allData).toHaveProperty('workflows')
      expect(allData).toHaveProperty('stats')
      expect(allData).toHaveProperty('lastUpdated')
    })
  })
})
