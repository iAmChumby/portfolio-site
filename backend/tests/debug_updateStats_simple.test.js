import { jest } from '@jest/globals'

// Create mock database
const mockDatabase = {
  db: null,
  isInitialized: false,
  initialize: jest.fn().mockResolvedValue({}),
  getDb: jest.fn().mockResolvedValue({}),
  getRepositories: jest.fn().mockResolvedValue([{ name: 'test-repo' }]),
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

// Create mock GitHub service
const mockGitHubService = {
  calculateStats: jest.fn().mockResolvedValue({ totalStars: 10 })
}

// Use unstable_mockModule for ES modules
jest.unstable_mockModule('../src/config/database.js', () => ({
  default: mockDatabase
}))

jest.unstable_mockModule('../src/services/github.js', () => ({
  default: jest.fn(() => mockGitHubService)
}))

// Import after mocking
const { default: DataSyncJob } = await import('../src/jobs/dataSync.js')

describe('Debug updateStats', () => {
  test('should call database methods', async () => {
    const dataSyncJob = new DataSyncJob()
    await dataSyncJob.initialize()
    
    // Ensure GitHub is configured
    dataSyncJob.isGitHubConfigured = true
    dataSyncJob.githubService = mockGitHubService
    
    // Call updateStats directly
    await dataSyncJob.updateStats()
    
    // Check if database methods were called
    expect(mockDatabase.getRepositories).toHaveBeenCalled()
    expect(mockDatabase.getUser).toHaveBeenCalled()
    expect(mockGitHubService.calculateStats).toHaveBeenCalled()
    expect(mockDatabase.setStats).toHaveBeenCalled()
  })
})
