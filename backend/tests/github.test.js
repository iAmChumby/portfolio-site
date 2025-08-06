import { jest } from '@jest/globals'
import GitHubService from '../src/services/github.js'

// Mock fetch globally
global.fetch = jest.fn()

describe('GitHubService', () => {
  let githubService
  const mockToken = 'test-token'
  const mockUsername = 'testuser'

  beforeEach(() => {
    githubService = new GitHubService(mockToken, mockUsername)
    fetch.mockClear()
  })

  describe('constructor', () => {
    test('should initialize with token and username', () => {
      expect(githubService.token).toBe(mockToken)
      expect(githubService.username).toBe(mockUsername)
      expect(githubService.baseURL).toBe('https://api.github.com')
    })

    test('should throw error if token is missing', () => {
      expect(() => new GitHubService(null, mockUsername)).toThrow('GitHub token is required')
    })

    test('should throw error if username is missing', () => {
      expect(() => new GitHubService(mockToken, null)).toThrow('GitHub username is required')
    })
  })

  describe('makeRequest', () => {
    test('should make successful API request', async () => {
      const mockResponse = { data: 'test' }
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await githubService.makeRequest('/test')
      
      expect(fetch).toHaveBeenCalledWith('https://api.github.com/test', {
        headers: {
          'Authorization': `token ${mockToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-Backend/1.0'
        }
      })
      expect(result).toEqual(mockResponse)
    })

    test('should handle API errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })

      await expect(githubService.makeRequest('/test')).rejects.toThrow('GitHub API error: 404 Not Found')
    })

    test('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(githubService.makeRequest('/test')).rejects.toThrow('Network error')
    })
  })

  describe('getUserData', () => {
    test('should fetch user data successfully', async () => {
      const mockUserData = {
        login: 'testuser',
        name: 'Test User',
        bio: 'Test bio',
        public_repos: 10
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUserData)
      })

      const result = await githubService.getUserData()
      
      expect(fetch).toHaveBeenCalledWith(`https://api.github.com/users/${mockUsername}`, expect.any(Object))
      expect(result).toEqual(mockUserData)
    })
  })

  describe('getAllRepositories', () => {
    test('should fetch all repositories with pagination', async () => {
      const mockRepos1 = [
        { id: 1, name: 'repo1' },
        { id: 2, name: 'repo2' }
      ]
      const mockRepos2 = [
        { id: 3, name: 'repo3' }
      ]

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockRepos1)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockRepos2)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([])
        })

      const result = await githubService.getAllRepositories()
      
      expect(result).toHaveLength(3)
      expect(result).toEqual([...mockRepos1, ...mockRepos2])
    })
  })

  describe('getRepositoryLanguages', () => {
    test('should fetch repository languages', async () => {
      const mockLanguages = {
        JavaScript: 1000,
        Python: 800
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockLanguages)
      })

      const result = await githubService.getRepositoryLanguages('test-repo')
      
      expect(fetch).toHaveBeenCalledWith(
        `https://api.github.com/repos/${mockUsername}/test-repo/languages`,
        expect.any(Object)
      )
      expect(result).toEqual(mockLanguages)
    })
  })

  describe('getUserEvents', () => {
    test('should fetch user events with pagination', async () => {
      const mockEvents1 = [
        { id: '1', type: 'PushEvent' },
        { id: '2', type: 'CreateEvent' }
      ]
      const mockEvents2 = [
        { id: '3', type: 'IssueEvent' }
      ]

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockEvents1)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockEvents2)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([])
        })

      const result = await githubService.getUserEvents()
      
      expect(result).toHaveLength(3)
      expect(result).toEqual([...mockEvents1, ...mockEvents2])
    })
  })

  describe('aggregateLanguageStats', () => {
    test('should aggregate language statistics from repositories', async () => {
      const mockRepos = [
        { name: 'repo1' },
        { name: 'repo2' }
      ]

      const mockLang1 = { JavaScript: 1000, Python: 500 }
      const mockLang2 = { JavaScript: 800, TypeScript: 600 }

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockLang1)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockLang2)
        })

      const result = await githubService.aggregateLanguageStats(mockRepos)
      
      expect(result).toEqual({
        JavaScript: 1800,
        Python: 500,
        TypeScript: 600
      })
    })

    test('should handle repositories with no languages', async () => {
      const mockRepos = [{ name: 'repo1' }]

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      })

      const result = await githubService.aggregateLanguageStats(mockRepos)
      
      expect(result).toEqual({})
    })
  })

  describe('calculateOverallStats', () => {
    test('should calculate overall repository statistics', () => {
      const mockRepos = [
        { stargazers_count: 10, forks_count: 5, size: 1000 },
        { stargazers_count: 20, forks_count: 8, size: 2000 },
        { stargazers_count: 5, forks_count: 2, size: 500 }
      ]

      const result = githubService.calculateOverallStats(mockRepos)
      
      expect(result).toEqual({
        totalRepos: 3,
        totalStars: 35,
        totalForks: 15,
        totalSize: 3500,
        averageStars: 11.67,
        averageForks: 5,
        averageSize: 1166.67
      })
    })

    test('should handle empty repository array', () => {
      const result = githubService.calculateOverallStats([])
      
      expect(result).toEqual({
        totalRepos: 0,
        totalStars: 0,
        totalForks: 0,
        totalSize: 0,
        averageStars: 0,
        averageForks: 0,
        averageSize: 0
      })
    })
  })

  describe('getFeaturedRepositories', () => {
    test('should return featured repositories sorted by stars', () => {
      const mockRepos = [
        { name: 'repo1', stargazers_count: 5, fork: false },
        { name: 'repo2', stargazers_count: 20, fork: false },
        { name: 'repo3', stargazers_count: 10, fork: false },
        { name: 'fork-repo', stargazers_count: 30, fork: true }
      ]

      const result = githubService.getFeaturedRepositories(mockRepos, 2)
      
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('repo2')
      expect(result[1].name).toBe('repo3')
    })

    test('should exclude forks by default', () => {
      const mockRepos = [
        { name: 'repo1', stargazers_count: 5, fork: false },
        { name: 'fork-repo', stargazers_count: 30, fork: true }
      ]

      const result = githubService.getFeaturedRepositories(mockRepos, 5)
      
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('repo1')
    })
  })

  describe('processRecentActivity', () => {
    test('should process and simplify activity events', () => {
      const mockEvents = [
        {
          id: '1',
          type: 'PushEvent',
          created_at: '2023-01-01T00:00:00Z',
          repo: { name: 'user/repo1' },
          payload: { commits: [{ message: 'Test commit' }] }
        },
        {
          id: '2',
          type: 'CreateEvent',
          created_at: '2023-01-02T00:00:00Z',
          repo: { name: 'user/repo2' },
          payload: { ref_type: 'repository' }
        }
      ]

      const result = githubService.processRecentActivity(mockEvents)
      
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: '1',
        type: 'PushEvent',
        date: '2023-01-01T00:00:00Z',
        repo: 'user/repo1',
        description: 'Pushed commits to user/repo1'
      })
      expect(result[1]).toEqual({
        id: '2',
        type: 'CreateEvent',
        date: '2023-01-02T00:00:00Z',
        repo: 'user/repo2',
        description: 'Created repository user/repo2'
      })
    })
  })
})