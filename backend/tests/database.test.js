import { jest } from '@jest/globals'
import fs from 'fs/promises'
import path from 'path'
import Database from '../src/config/database.js'

describe('Database', () => {
  let database
  const testDbPath = './data/test-database.json'

  beforeEach(async () => {
    // Clean up any existing test database
    try {
      await fs.unlink(testDbPath)
    } catch (error) {
      // File doesn't exist, that's fine
    }
    
    database = new Database(testDbPath)
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
      
      // Initialize again
      const newDatabase = new Database(testDbPath)
      await newDatabase.initialize()
      
      expect(newDatabase.db.data.user.name).toBe('Test User')
    })
  })

  describe('updateUser', () => {
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

      await database.updateUser(userData)
      
      expect(database.db.data.user).toEqual(userData)
      expect(database.db.data.lastUpdated.user).toBeDefined()
    })
  })

  describe('updateRepositories', () => {
    beforeEach(async () => {
      await database.initialize()
    })

    test('should update repositories data', async () => {
      const reposData = [
        { id: 1, name: 'repo1', stargazers_count: 5 },
        { id: 2, name: 'repo2', stargazers_count: 10 }
      ]

      await database.updateRepositories(reposData)
      
      expect(database.db.data.repositories).toEqual(reposData)
      expect(database.db.data.lastUpdated.repositories).toBeDefined()
    })
  })

  describe('updateLanguages', () => {
    beforeEach(async () => {
      await database.initialize()
    })

    test('should update languages data', async () => {
      const languagesData = {
        JavaScript: 1000,
        Python: 800,
        TypeScript: 600
      }

      await database.updateLanguages(languagesData)
      
      expect(database.db.data.languages).toEqual(languagesData)
      expect(database.db.data.lastUpdated.languages).toBeDefined()
    })
  })

  describe('updateActivity', () => {
    beforeEach(async () => {
      await database.initialize()
    })

    test('should update activity data', async () => {
      const activityData = [
        { id: '1', type: 'PushEvent', created_at: '2023-01-01T00:00:00Z' },
        { id: '2', type: 'CreateEvent', created_at: '2023-01-02T00:00:00Z' }
      ]

      await database.updateActivity(activityData)
      
      expect(database.db.data.activity).toEqual(activityData)
      expect(database.db.data.lastUpdated.activity).toBeDefined()
    })
  })

  describe('updateWorkflows', () => {
    beforeEach(async () => {
      await database.initialize()
    })

    test('should update workflows data', async () => {
      const workflowsData = [
        { id: 1, name: 'CI', status: 'completed', conclusion: 'success' },
        { id: 2, name: 'Deploy', status: 'in_progress', conclusion: null }
      ]

      await database.updateWorkflows(workflowsData)
      
      expect(database.db.data.workflows).toEqual(workflowsData)
      expect(database.db.data.lastUpdated.workflows).toBeDefined()
    })
  })

  describe('updateStats', () => {
    beforeEach(async () => {
      await database.initialize()
    })

    test('should update stats data', async () => {
      const statsData = {
        totalRepos: 15,
        totalStars: 100,
        totalForks: 25,
        totalCommits: 500
      }

      await database.updateStats(statsData)
      
      expect(database.db.data.stats).toEqual(statsData)
      expect(database.db.data.lastUpdated.stats).toBeDefined()
    })
  })

  describe('getter methods', () => {
    beforeEach(async () => {
      await database.initialize()
      
      // Set up test data
      database.db.data.user = { name: 'Test User' }
      database.db.data.repositories = [{ name: 'repo1' }]
      database.db.data.languages = { JavaScript: 1000 }
      database.db.data.activity = [{ type: 'PushEvent' }]
      database.db.data.workflows = [{ name: 'CI' }]
      database.db.data.stats = { totalRepos: 1 }
    })

    test('getUser should return user data', () => {
      expect(database.getUser()).toEqual({ name: 'Test User' })
    })

    test('getRepositories should return repositories data', () => {
      expect(database.getRepositories()).toEqual([{ name: 'repo1' }])
    })

    test('getLanguages should return languages data', () => {
      expect(database.getLanguages()).toEqual({ JavaScript: 1000 })
    })

    test('getActivity should return activity data', () => {
      expect(database.getActivity()).toEqual([{ type: 'PushEvent' }])
    })

    test('getWorkflows should return workflows data', () => {
      expect(database.getWorkflows()).toEqual([{ name: 'CI' }])
    })

    test('getStats should return stats data', () => {
      expect(database.getStats()).toEqual({ totalRepos: 1 })
    })

    test('getAllData should return all data', () => {
      const allData = database.getAllData()
      
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