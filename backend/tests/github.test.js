import { jest } from '@jest/globals'
import GitHubService from '../src/services/github.js'

describe('GitHubService', () => {
  let githubService
  let mockClient
  let originalEnv

  beforeEach(() => {
    // Save original environment variables
    originalEnv = {
      GITHUB_TOKEN: process.env.GITHUB_TOKEN,
      GITHUB_USERNAME: process.env.GITHUB_USERNAME
    }
    
    // Set test environment variables
    process.env.GITHUB_TOKEN = 'test-token'
    process.env.GITHUB_USERNAME = 'testuser'
    
    githubService = new GitHubService()
    
    // Mock the client directly
    mockClient = {
      get: jest.fn()
    }
    githubService.client = mockClient
  })

  afterEach(() => {
    // Restore original environment variables
    if (originalEnv.GITHUB_TOKEN !== undefined) {
      process.env.GITHUB_TOKEN = originalEnv.GITHUB_TOKEN
    } else {
      delete process.env.GITHUB_TOKEN
    }
    
    if (originalEnv.GITHUB_USERNAME !== undefined) {
      process.env.GITHUB_USERNAME = originalEnv.GITHUB_USERNAME
    } else {
      delete process.env.GITHUB_USERNAME
    }
  })

  describe('constructor', () => {
    test('should initialize with token and username from environment', () => {
      expect(githubService.token).toBe('test-token')
      expect(githubService.username).toBe('testuser')
      expect(githubService.baseURL).toBe('https://api.github.com')
      expect(githubService.isConfigured).toBe(true)
    })

    test('should not be configured if token is missing', () => {
      delete process.env.GITHUB_TOKEN
      const service = new GitHubService()
      expect(service.isConfigured).toBe(false)
    })

    test('should not be configured if username is missing', () => {
      delete process.env.GITHUB_USERNAME
      const service = new GitHubService()
      expect(service.isConfigured).toBe(false)
    })

    test('should not be configured if token is placeholder', () => {
      process.env.GITHUB_TOKEN = 'your_github_token_here'
      const service = new GitHubService()
      expect(service.isConfigured).toBe(false)
    })

    test('should not be configured if username is placeholder', () => {
      process.env.GITHUB_USERNAME = 'your_github_username'
      const service = new GitHubService()
      expect(service.isConfigured).toBe(false)
    })
  })

  describe('fetchUser', () => {
    test('should fetch user data successfully', async () => {
      const mockUserData = {
        login: 'testuser',
        name: 'Test User',
        bio: 'Test bio',
        public_repos: 10
      }

      mockClient.get.mockResolvedValueOnce({
        data: mockUserData
      })

      const result = await githubService.fetchUser()
      
      expect(mockClient.get).toHaveBeenCalledWith('/users/testuser')
      expect(result).toEqual(mockUserData)
    })
  })

  describe('fetchAllRepositories', () => {
    test('should fetch all repositories across multiple pages', async () => {
      const mockRepos1 = [
        { id: 1, name: 'repo1' },
        { id: 2, name: 'repo2' }
      ]
      const mockRepos2 = [
        { id: 3, name: 'repo3' }
      ]

      // Mock the fetchRepositories method to return different results for different pages
      const originalFetchRepositories = githubService.fetchRepositories
      githubService.fetchRepositories = jest.fn()
        .mockResolvedValueOnce(mockRepos1) // First page returns 2 repos (less than 100, so pagination stops)
        .mockResolvedValueOnce(mockRepos2) // This won't be called since first page has < 100 repos

      const result = await githubService.fetchAllRepositories()

      expect(result).toHaveLength(2) // Only first page repos since < 100 returned
      expect(result).toEqual(mockRepos1)
      expect(githubService.fetchRepositories).toHaveBeenCalledTimes(1)
      expect(githubService.fetchRepositories).toHaveBeenCalledWith(1, 100)

      // Restore original method
      githubService.fetchRepositories = originalFetchRepositories
    })
  })

  describe('fetchRepositoryLanguages', () => {
    test('should fetch repository languages', async () => {
      const mockLanguages = {
        JavaScript: 1000,
        Python: 800
      }

      mockClient.get.mockResolvedValueOnce({
        data: mockLanguages
      })

      const result = await githubService.fetchRepositoryLanguages('test-repo')
      
      expect(mockClient.get).toHaveBeenCalledWith('/repos/testuser/test-repo/languages')
      expect(result).toEqual(mockLanguages)
    })
  })

  describe('fetchUserEvents', () => {
    test('should fetch user events with pagination', async () => {
      const mockEvents = [
        { id: '1', type: 'PushEvent' },
        { id: '2', type: 'CreateEvent' }
      ]

      mockClient.get.mockResolvedValueOnce({
        data: mockEvents
      })

      const result = await githubService.fetchUserEvents()
      
      expect(result).toHaveLength(2)
      expect(result).toEqual(mockEvents)
    })
  })

  describe('aggregateLanguages', () => {
    test('should aggregate language statistics from repositories', async () => {
      const mockRepos = [
        { name: 'repo1', fork: false },
        { name: 'repo2', fork: false }
      ]

      const mockLang1 = { JavaScript: 1000, Python: 500 }
      const mockLang2 = { JavaScript: 800, TypeScript: 600 }

      // Mock the fetchRepositoryLanguages method directly
      githubService.fetchRepositoryLanguages = jest.fn()
        .mockResolvedValueOnce(mockLang1)
        .mockResolvedValueOnce(mockLang2)

      const result = await githubService.aggregateLanguages(mockRepos)
      
      expect(result).toEqual({
        JavaScript: {
          bytes: 1800,
          percentage: '62.07'
        },
        Python: {
          bytes: 500,
          percentage: '17.24'
        },
        TypeScript: {
          bytes: 600,
          percentage: '20.69'
        }
      })
    })

    test('should handle repositories with no languages', async () => {
      const mockRepos = [{ name: 'repo1', fork: false }]

      // Mock the fetchRepositoryLanguages method directly
      githubService.fetchRepositoryLanguages = jest.fn()
        .mockResolvedValueOnce({})

      const result = await githubService.aggregateLanguages(mockRepos)
      
      expect(result).toEqual({})
    })

    test('should skip forked repositories', async () => {
      const mockRepos = [
        { name: 'repo1', fork: false },
        { name: 'repo2', fork: true }
      ]

      const mockLang1 = { JavaScript: 1000 }

      // Mock the fetchRepositoryLanguages method directly
      githubService.fetchRepositoryLanguages = jest.fn()
        .mockResolvedValueOnce(mockLang1)

      const result = await githubService.aggregateLanguages(mockRepos)
      
      expect(githubService.fetchRepositoryLanguages).toHaveBeenCalledTimes(1)
      expect(githubService.fetchRepositoryLanguages).toHaveBeenCalledWith('repo1')
      expect(result).toEqual({
        JavaScript: {
          bytes: 1000,
          percentage: '100.00'
        }
      })
    })
  })

  describe('calculateStats', () => {
    test('should calculate overall repository statistics', async () => {
      const mockRepos = [
        { stargazers_count: 10, forks_count: 5 },
        { stargazers_count: 20, forks_count: 8 },
        { stargazers_count: 5, forks_count: 2 }
      ]
      const mockUser = { followers: 100, following: 50 }

      const result = await githubService.calculateStats(mockRepos, mockUser)
      
      expect(result).toEqual({
        totalRepos: 3,
        totalStars: 35,
        totalForks: 15,
        followers: 100,
        following: 50
      })
    })

    test('should handle empty repository array', async () => {
      const result = await githubService.calculateStats([], {})
      
      expect(result).toEqual({
        totalRepos: 0,
        totalStars: 0,
        totalForks: 0,
        followers: 0,
        following: 0
      })
    })
  })

  describe('getFeaturedRepositories', () => {
    test('should return featured repositories sorted by stars', async () => {
      const mockRepos = [
        { name: 'repo1', stargazers_count: 5, fork: false, updated_at: '2023-01-01' },
        { name: 'repo2', stargazers_count: 20, fork: false, updated_at: '2023-01-02' },
        { name: 'repo3', stargazers_count: 10, fork: false, updated_at: '2023-01-03' },
        { name: 'fork-repo', stargazers_count: 30, fork: true, updated_at: '2023-01-04' }
      ]

      const result = await githubService.getFeaturedRepositories(mockRepos, 2)
      
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('repo2')
      expect(result[1].name).toBe('repo3')
    })

    test('should exclude forks by default', async () => {
      const mockRepos = [
        { name: 'repo1', stargazers_count: 5, fork: false, updated_at: '2023-01-01' },
        { name: 'fork-repo', stargazers_count: 30, fork: true, updated_at: '2023-01-02' }
      ]

      const result = await githubService.getFeaturedRepositories(mockRepos, 5)
      
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('repo1')
    })
  })

  describe('processRecentActivity', () => {
    test('should process and simplify activity events', async () => {
      const mockEvents = [
        {
          id: '1',
          type: 'PushEvent',
          created_at: '2023-01-01T00:00:00Z',
          repo: { name: 'user/repo1' },
          payload: { commits: [{ message: 'Test commit' }], ref: 'refs/heads/main' }
        },
        {
          id: '2',
          type: 'CreateEvent',
          created_at: '2023-01-02T00:00:00Z',
          repo: { name: 'user/repo2' },
          payload: { ref_type: 'repository', ref: null }
        }
      ]

      const result = await githubService.processRecentActivity(mockEvents)
      
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: '1',
        type: 'PushEvent',
        repo: 'user/repo1',
        created_at: '2023-01-01T00:00:00Z',
        payload: {
          commits: 1,
          ref: 'refs/heads/main'
        }
      })
      expect(result[1]).toEqual({
        id: '2',
        type: 'CreateEvent',
        repo: 'user/repo2',
        created_at: '2023-01-02T00:00:00Z',
        payload: {
          ref_type: 'repository',
          ref: null
        }
      })
    })
  })
})