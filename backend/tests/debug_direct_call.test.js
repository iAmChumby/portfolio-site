import { jest } from '@jest/globals'

// Mock database - create a complete mock of the Database singleton
const mockDatabase = {
  db: null,
  isInitialized: false,
  initialize: jest.fn().mockResolvedValue({}),
  getDb: jest.fn().mockResolvedValue({}),
  getRepositories: jest.fn().mockResolvedValue([{ name: 'repo1' }]),
  setRepositories: jest.fn(),
  getWorkflows: jest.fn(),
  setWorkflows: jest.fn(),
  getUser: jest.fn(),
  setUser: jest.fn(),
  getLanguages: jest.fn(),
  setLanguages: jest.fn(),
  getActivity: jest.fn(),
  setActivity: jest.fn(),
  getStats: jest.fn(),
  setStats: jest.fn(),
  getLastUpdated: jest.fn(),
  getAllData: jest.fn()
}

// Mock GitHub service
const mockGitHubService = {
  isConfigured: true,
  fetchWorkflowRuns: jest.fn().mockResolvedValue([{ id: 1, name: 'test-workflow' }])
}

// Mock cron
const mockCron = {
  schedule: jest.fn()
}

// Use unstable_mockModule for ES modules
jest.unstable_mockModule('../src/config/database.js', () => ({
  default: mockDatabase
}))

jest.unstable_mockModule('../src/services/github.js', () => ({
  default: jest.fn().mockImplementation(() => mockGitHubService)
}))

jest.unstable_mockModule('node-cron', () => ({
  default: mockCron
}))

// Import after mocking
const { default: DataSyncJob } = await import('../src/jobs/dataSync.js')

describe('Direct Database Call Test', () => {
  let dataSyncJob

  beforeEach(() => {
    jest.clearAllMocks()
    dataSyncJob = new DataSyncJob()
    dataSyncJob.isGitHubConfigured = true
    dataSyncJob.githubService = mockGitHubService
  })

  test('should call database.getRepositories directly', async () => {
    // Import database directly to test
    const database = (await import('../src/config/database.js')).default
    
    process.stderr.write(`Database object: ${JSON.stringify(database)}\n`)
    process.stderr.write(`Database getRepositories: ${database.getRepositories}\n`)
    process.stderr.write(`Mock getRepositories: ${mockDatabase.getRepositories}\n`)
    process.stderr.write(`Are they the same? ${database.getRepositories === mockDatabase.getRepositories}\n`)
    
    // Call getRepositories directly
    const result = await database.getRepositories()
    process.stderr.write(`Result: ${JSON.stringify(result)}\n`)
    process.stderr.write(`Mock call count: ${mockDatabase.getRepositories.mock.calls.length}\n`)
    
    expect(mockDatabase.getRepositories).toHaveBeenCalled()
  })
})