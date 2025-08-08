import { jest } from '@jest/globals'

// Mock database
const mockDatabase = {
  db: null,
  isInitialized: false,
  initialize: jest.fn().mockResolvedValue({}),
  getDb: jest.fn().mockResolvedValue({}),
  getRepositories: jest.fn().mockResolvedValue([
    { name: 'test-repo', stargazers_count: 10 }
  ]),
  setRepositories: jest.fn().mockResolvedValue([]),
  getUser: jest.fn().mockResolvedValue({ login: 'testuser' }),
  setUser: jest.fn().mockResolvedValue({}),
  getLanguages: jest.fn().mockResolvedValue({}),
  setLanguages: jest.fn().mockResolvedValue({}),
  getActivity: jest.fn().mockResolvedValue([]),
  setActivity: jest.fn().mockResolvedValue([]),
  getWorkflows: jest.fn().mockResolvedValue([]),
  setWorkflows: jest.fn().mockResolvedValue([]),
  getStats: jest.fn().mockResolvedValue({}),
  setStats: jest.fn().mockResolvedValue({}),
  getLastUpdated: jest.fn(),
  getAllData: jest.fn()
}

// Mock GitHub service
const mockGitHubService = {
  getUser: jest.fn().mockResolvedValue({ login: 'testuser' }),
  calculateStats: jest.fn().mockResolvedValue({ totalStars: 10 })
}

// Use unstable_mockModule for ES modules
jest.unstable_mockModule('../src/config/database.js', () => ({
  default: mockDatabase
}))

jest.unstable_mockModule('../src/services/github.js', () => ({
  default: jest.fn().mockImplementation(() => mockGitHubService)
}))

// Import after mocking
const { default: DataSyncJob } = await import('../src/jobs/dataSync.js')

describe('Debug updateStats', () => {
  let dataSyncJob
  let consoleLogSpy

  beforeEach(async () => {
    jest.clearAllMocks()
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
    
    dataSyncJob = new DataSyncJob()
    await dataSyncJob.initialize()
    dataSyncJob.githubService = mockGitHubService
    dataSyncJob.isGitHubConfigured = true
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
  })

  test('debug updateStats execution', async () => {
    const mockRepos = [{ name: 'repo1' }]
    const mockUser = { login: 'testuser' }
    const mockStats = { totalStars: 10, totalRepos: 1 }
    
    mockDatabase.getRepositories.mockResolvedValue(mockRepos)
    mockDatabase.getUser.mockResolvedValue(mockUser)
    mockGitHubService.calculateStats.mockResolvedValue(mockStats)

    console.log('Before calling updateStats')
    console.log('dataSyncJob.isGitHubConfigured:', dataSyncJob.isGitHubConfigured)
    console.log('dataSyncJob.githubService:', dataSyncJob.githubService)
    
    await dataSyncJob.updateStats()
    
    console.log('After calling updateStats')
    console.log('mockDatabase.getRepositories called:', mockDatabase.getRepositories.mock.calls.length)
    console.log('mockDatabase.getUser called:', mockDatabase.getUser.mock.calls.length)
    
    expect(mockDatabase.getRepositories).toHaveBeenCalled()
  })
})