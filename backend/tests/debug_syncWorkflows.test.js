import { jest } from '@jest/globals'

// Create mock objects
const mockDatabase = {
  getRepositories: jest.fn(),
  setWorkflows: jest.fn()
}

const mockGitHubService = {
  fetchWorkflowRuns: jest.fn()
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

describe('Debug syncWorkflows', () => {
  let dataSyncJob

  beforeEach(async () => {
    jest.clearAllMocks()
    dataSyncJob = new DataSyncJob()
    
    // Force GitHub configuration to be true
    dataSyncJob.isGitHubConfigured = true
    dataSyncJob.githubService = mockGitHubService
    
    // Setup mock returns
    mockDatabase.getRepositories.mockResolvedValue([
      { name: 'repo1', stargazers_count: 10, fork: false },
      { name: 'repo2', stargazers_count: 5, fork: false }
    ])
    
    mockGitHubService.fetchWorkflowRuns.mockResolvedValue([
      { id: 1, name: 'CI', status: 'completed', created_at: '2023-01-01T00:00:00Z' }
    ])
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('should call database.getRepositories', async () => {
    console.log('Before syncWorkflows call')
    console.log('mockDatabase.getRepositories mock:', typeof mockDatabase.getRepositories)
    console.log('dataSyncJob.isGitHubConfigured:', dataSyncJob.isGitHubConfigured)
    console.log('dataSyncJob.isRunning:', dataSyncJob.isRunning)
    
    try {
      await dataSyncJob.syncWorkflows()
    } catch (error) {
      console.log('Error in syncWorkflows:', error)
    }
    
    console.log('After syncWorkflows call')
    console.log('mockDatabase.getRepositories call count:', mockDatabase.getRepositories.mock.calls.length)
    console.log('mockDatabase.getRepositories calls:', mockDatabase.getRepositories.mock.calls)
    
    expect(mockDatabase.getRepositories).toHaveBeenCalled()
  })
})
