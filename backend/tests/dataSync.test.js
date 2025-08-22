import { jest } from '@jest/globals'

// Mock GitHub service
const mockGitHubService = {
  isConfigured: true,
  fetchUser: jest.fn(),
  fetchAllRepositories: jest.fn(),
  aggregateLanguages: jest.fn(),
  fetchUserEvents: jest.fn(),
  processRecentActivity: jest.fn(),
  fetchWorkflowRuns: jest.fn(),
  calculateStats: jest.fn()
}

const mockDatabase = {
  db: null,
  isInitialized: false,
  initialize: jest.fn().mockResolvedValue({}),
  getDb: jest.fn().mockResolvedValue({}),
  getUser: jest.fn(),
  setUser: jest.fn(),
  getRepositories: jest.fn(),
  setRepositories: jest.fn(),
  getLanguages: jest.fn(),
  setLanguages: jest.fn(),
  getActivity: jest.fn(),
  setActivity: jest.fn(),
  getWorkflows: jest.fn(),
  setWorkflows: jest.fn(),
  getStats: jest.fn(),
  setStats: jest.fn(),
  getLastUpdated: jest.fn(),
  getAllData: jest.fn()
}

const mockCron = {
  schedule: jest.fn()
}

// Hoist mocks before imports
jest.unstable_mockModule('../src/config/database.js', () => ({
  default: mockDatabase
}))

jest.unstable_mockModule('../src/services/github.js', () => ({
  default: jest.fn().mockImplementation(() => ({
    ...mockGitHubService,
    isConfigured: mockGitHubService.isConfigured
  }))
}))

jest.unstable_mockModule('node-cron', () => ({
  default: mockCron
}))

// Now import the module under test
const { default: dataSyncJobInstance } = await import('../src/jobs/dataSync.js')

describe('DataSyncJob', () => {
  let dataSyncJob
  let consoleLogSpy, consoleErrorSpy, consoleWarnSpy

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()
    
    // Mock console methods
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

    // Reset mock service state
    mockGitHubService.isConfigured = true
    
    // Reset all mock functions
    Object.values(mockGitHubService).forEach(fn => {
      if (typeof fn === 'function') fn.mockReset()
    })
    Object.values(mockDatabase).forEach(fn => {
      if (typeof fn === 'function') fn.mockReset()
    })
    mockCron.schedule.mockReset()
    
    // Reset mock implementations
    mockDatabase.getRepositories.mockResolvedValue([])
    mockDatabase.setRepositories.mockResolvedValue([])
    mockDatabase.getWorkflows.mockResolvedValue([])
    mockDatabase.setWorkflows.mockResolvedValue([])
    mockDatabase.getUser.mockResolvedValue(null)
    mockDatabase.setUser.mockResolvedValue({})
    mockDatabase.getLanguages.mockResolvedValue({})
    mockDatabase.setLanguages.mockResolvedValue({})
    mockDatabase.getActivity.mockResolvedValue([])
    mockDatabase.setActivity.mockResolvedValue([])
    mockDatabase.getStats.mockResolvedValue({})
    mockDatabase.setStats.mockResolvedValue({})
    
    // Reset GitHub service mocks
    mockGitHubService.fetchUser.mockResolvedValue({})
    mockGitHubService.fetchAllRepositories.mockResolvedValue([])
    mockGitHubService.aggregateLanguages.mockResolvedValue({})
    mockGitHubService.fetchUserEvents.mockResolvedValue([])
    mockGitHubService.processRecentActivity.mockResolvedValue([])
    mockGitHubService.fetchWorkflowRuns.mockResolvedValue([])
    mockGitHubService.calculateStats.mockResolvedValue({})
    
    // Use the singleton instance for each test
    dataSyncJob = dataSyncJobInstance
    
    // Mock the GitHub service to be configured
    dataSyncJob.isGitHubConfigured = true
    dataSyncJob.githubService = mockGitHubService
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('constructor', () => {
    test('should initialize with default values', () => {
      dataSyncJob = dataSyncJobInstance

      // Since this is a singleton, it may already be initialized
      expect(dataSyncJob.isRunning).toBe(false)
      expect(typeof dataSyncJob.isGitHubConfigured).toBe('boolean')
    })
  })

  describe('initialize', () => {
    test('should initialize and create github service', async () => {
      dataSyncJob = dataSyncJobInstance
      await dataSyncJob.initialize()

      expect(dataSyncJob.githubService).toBeDefined()
      expect(consoleLogSpy).toHaveBeenCalled()
      // The isGitHubConfigured property should be set during initialization
      expect(Object.prototype.hasOwnProperty.call(dataSyncJob, 'isGitHubConfigured')).toBe(true)
    })

    test('should handle initialization errors gracefully', async () => {
      // Mock GitHubService constructor to throw an error
      jest.mocked(await import('../src/services/github.js')).default.mockImplementationOnce(() => {
        throw new Error('GitHub service initialization failed')
      })
      
      dataSyncJob = dataSyncJobInstance
      await dataSyncJob.initialize()

      expect(dataSyncJob.isGitHubConfigured).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to initialize DataSync job:', expect.any(Error))
      
      // Restore the original mock
      jest.mocked(await import('../src/services/github.js')).default.mockImplementation(() => mockGitHubService)
    })
  })

  describe('initializeMockData', () => {
    beforeEach(async () => {
      dataSyncJob = dataSyncJobInstance
      await dataSyncJob.initialize()
    })

    test('should initialize mock data successfully', async () => {
      await dataSyncJob.initializeMockData()

      expect(mockDatabase.setUser).toHaveBeenCalledWith(expect.objectContaining({
        login: 'developer',
        name: 'Portfolio Developer'
      }))
      expect(mockDatabase.setRepositories).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          name: 'portfolio-site'
        })
      ]))
      expect(mockDatabase.setLanguages).toHaveBeenCalled()
      expect(mockDatabase.setActivity).toHaveBeenCalled()
      expect(mockDatabase.setStats).toHaveBeenCalled()
      expect(mockDatabase.setWorkflows).toHaveBeenCalledWith([])
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Mock data initialized successfully')
    })
  })

  describe('syncAllData', () => {
    beforeEach(async () => {
      dataSyncJob = dataSyncJobInstance
      await dataSyncJob.initialize()
    })

    test('should sync all data successfully', async () => {
      // Force GitHub to be configured for this test
      dataSyncJob.isGitHubConfigured = true
      dataSyncJob.githubService = mockGitHubService
      
      // Mock all sync methods
      jest.spyOn(dataSyncJob, 'syncUserData').mockResolvedValue()
      jest.spyOn(dataSyncJob, 'syncRepositories').mockResolvedValue()
      jest.spyOn(dataSyncJob, 'syncLanguages').mockResolvedValue()
      jest.spyOn(dataSyncJob, 'syncActivity').mockResolvedValue()
      jest.spyOn(dataSyncJob, 'syncWorkflows').mockResolvedValue()
      jest.spyOn(dataSyncJob, 'updateStats').mockResolvedValue()

      await dataSyncJob.syncAllData()

      expect(consoleLogSpy).toHaveBeenCalledWith('🔄 Starting full data sync...')
      expect(dataSyncJob.syncUserData).toHaveBeenCalled()
      expect(dataSyncJob.syncRepositories).toHaveBeenCalled()
      expect(dataSyncJob.syncLanguages).toHaveBeenCalled()
      expect(dataSyncJob.syncActivity).toHaveBeenCalled()
      expect(dataSyncJob.syncWorkflows).toHaveBeenCalled()
      expect(dataSyncJob.updateStats).toHaveBeenCalled()
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Full data sync completed successfully')
    })

    test('should prevent concurrent syncs', async () => {
      dataSyncJob.isRunning = true

      await dataSyncJob.syncAllData()

      expect(consoleLogSpy).toHaveBeenCalledWith('⏳ Data sync already in progress, skipping...')
    })

    test('should handle GitHub service not configured', async () => {
      dataSyncJob.isGitHubConfigured = false
      dataSyncJob.isRunning = false
      consoleLogSpy.mockClear()

      await dataSyncJob.syncAllData()

      expect(consoleLogSpy).toHaveBeenCalledWith('⚠️  GitHub not configured, skipping data sync')
    })

    test('should handle sync errors gracefully', async () => {
      // Force GitHub to be configured for this test
      dataSyncJob.isGitHubConfigured = true
      dataSyncJob.githubService = mockGitHubService
      dataSyncJob.isRunning = false
      consoleErrorSpy.mockClear()
      
      jest.spyOn(dataSyncJob, 'syncUserData').mockRejectedValue(new Error('Sync error'))

      await dataSyncJob.syncAllData()

      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Data sync failed:', expect.any(Error))
      expect(dataSyncJob.isRunning).toBe(false)
    })
  })

  describe('syncUserData', () => {
    beforeEach(async () => {
      dataSyncJob = dataSyncJobInstance
      await dataSyncJob.initialize()
      // Force GitHub to be configured for these tests
      dataSyncJob.isGitHubConfigured = true
      dataSyncJob.githubService = mockGitHubService
    })

    test('should sync user data successfully', async () => {
      const mockUser = { login: 'testuser', name: 'Test User' }
      mockGitHubService.fetchUser.mockResolvedValue(mockUser)

      await dataSyncJob.syncUserData()

      expect(consoleLogSpy).toHaveBeenCalledWith('👤 Syncing user data...')
      expect(mockGitHubService.fetchUser).toHaveBeenCalled()
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ User data synced')
    })

    test('should handle user data sync errors', async () => {
      const error = new Error('User fetch failed')
      mockGitHubService.fetchUser.mockRejectedValue(error)

      await expect(dataSyncJob.syncUserData()).rejects.toThrow('User fetch failed')
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Failed to sync user data:', error)
    })
  })

  describe('syncRepositories', () => {
    beforeEach(async () => {
      dataSyncJob = dataSyncJobInstance
      await dataSyncJob.initialize()
      // Force GitHub to be configured for these tests
      dataSyncJob.isGitHubConfigured = true
      dataSyncJob.githubService = mockGitHubService
    })

    test('should sync repositories successfully', async () => {
      const mockRepos = [{ name: 'repo1' }, { name: 'repo2' }]
      mockGitHubService.fetchAllRepositories.mockResolvedValue(mockRepos)

      await dataSyncJob.syncRepositories()

      expect(consoleLogSpy).toHaveBeenCalledWith('📁 Syncing repositories...')
      expect(mockGitHubService.fetchAllRepositories).toHaveBeenCalled()
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Synced 2 repositories')
    })
  })

  describe('syncLanguages', () => {
    beforeEach(async () => {
      dataSyncJob = dataSyncJobInstance
      await dataSyncJob.initialize()
      // Force GitHub to be configured for these tests
      dataSyncJob.isGitHubConfigured = true
      dataSyncJob.githubService = mockGitHubService
    })

    test('should sync languages successfully', async () => {
      const mockRepos = [{ name: 'repo1' }]
      const mockLanguages = { JavaScript: { bytes: 1000, percentage: '100.00' } }
      
      mockDatabase.getRepositories.mockResolvedValue(mockRepos)
      mockGitHubService.aggregateLanguages.mockResolvedValue(mockLanguages)

      await dataSyncJob.syncLanguages()

      expect(consoleLogSpy).toHaveBeenCalledWith('💻 Syncing languages...')
      expect(mockGitHubService.aggregateLanguages).toHaveBeenCalledWith(mockRepos)
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Synced 1 languages')
    })
  })

  describe('syncActivity', () => {
    beforeEach(async () => {
      dataSyncJob = dataSyncJobInstance
      await dataSyncJob.initialize()
      // Force GitHub to be configured for these tests
      dataSyncJob.isGitHubConfigured = true
      dataSyncJob.githubService = mockGitHubService
    })

    test('should sync activity successfully', async () => {
      const mockEvents = [{ type: 'PushEvent' }]
      const mockActivity = [{ id: '1', type: 'PushEvent' }]
      
      mockGitHubService.fetchUserEvents.mockResolvedValue(mockEvents)
      mockGitHubService.processRecentActivity.mockResolvedValue(mockActivity)

      await dataSyncJob.syncActivity()

      expect(consoleLogSpy).toHaveBeenCalledWith('📊 Syncing activity...')
      expect(mockGitHubService.fetchUserEvents).toHaveBeenCalled()
      expect(mockGitHubService.processRecentActivity).toHaveBeenCalledWith(mockEvents)
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Synced 1 activity items')
    })

    test('should handle activity sync errors', async () => {
      const error = new Error('Activity fetch failed')
      mockGitHubService.fetchUserEvents.mockRejectedValue(error)

      await expect(dataSyncJob.syncActivity()).rejects.toThrow('Activity fetch failed')
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Failed to sync activity:', error)
    })
  })

  describe('syncWorkflows', () => {
    beforeEach(async () => {
      // Set up repositories mock
      mockDatabase.getRepositories.mockResolvedValue([
        { name: 'repo1', fork: false, stargazers_count: 10 }
      ])
      
      // Set up GitHub service mock
      mockGitHubService.fetchWorkflowRuns.mockResolvedValue([
        { id: 1, name: 'test-workflow', status: 'completed', created_at: '2023-01-01T00:00:00Z' }
      ])
      
      // Create instance and ensure GitHub service is properly set
      dataSyncJob = dataSyncJobInstance
      dataSyncJob.isGitHubConfigured = true
      dataSyncJob.githubService = mockGitHubService
    })

    test('should sync workflows successfully', async () => {
      await dataSyncJob.syncWorkflows()

      expect(consoleLogSpy).toHaveBeenCalledWith('🔄 Syncing workflows...')
      expect(mockDatabase.getRepositories).toHaveBeenCalled()
      expect(mockGitHubService.fetchWorkflowRuns).toHaveBeenCalledWith('repo1')
      expect(mockDatabase.setWorkflows).toHaveBeenCalled()
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Synced 1 workflow runs')
    })

    test('should handle workflow sync errors gracefully', async () => {
      mockGitHubService.fetchWorkflowRuns.mockRejectedValue(new Error('Workflow fetch failed'))

      await dataSyncJob.syncWorkflows()

      expect(consoleWarnSpy).toHaveBeenCalledWith('⚠️  Skipping workflows for repo1:', 'Workflow fetch failed')
      expect(mockDatabase.setWorkflows).toHaveBeenCalledWith([])
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Synced 0 workflow runs')
    })
  })

  describe('updateStats', () => {
    beforeEach(async () => {
      dataSyncJob = dataSyncJobInstance
      await dataSyncJob.initialize()
      // Override the githubService with our mock
      dataSyncJob.githubService = mockGitHubService
      // Ensure GitHub is configured for these tests
      dataSyncJob.isGitHubConfigured = true
    })

    test('should update stats successfully', async () => {
      const mockRepos = [{ name: 'repo1' }]
      const mockUser = { login: 'testuser' }
      const mockStats = { totalStars: 10, totalRepos: 1 }
      
      mockDatabase.getRepositories.mockResolvedValue(mockRepos)
      mockDatabase.getUser.mockResolvedValue(mockUser)
      mockGitHubService.calculateStats.mockResolvedValue(mockStats)

      await dataSyncJob.updateStats()

      expect(consoleLogSpy).toHaveBeenCalledWith('📈 Updating stats...')
      expect(mockDatabase.getRepositories).toHaveBeenCalled()
      expect(mockDatabase.getUser).toHaveBeenCalled()
      expect(mockGitHubService.calculateStats).toHaveBeenCalledWith(mockRepos, mockUser)
      expect(mockDatabase.setStats).toHaveBeenCalledWith(mockStats)
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Stats updated')
    })

    test('should handle stats update errors', async () => {
      const error = new Error('Stats calculation failed')
      mockDatabase.getRepositories.mockRejectedValue(error)

      await expect(dataSyncJob.updateStats()).rejects.toThrow('Stats calculation failed')
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Failed to update stats:', error)
    })
  })

  describe('startScheduledSync', () => {
    beforeEach(async () => {
      dataSyncJob = dataSyncJobInstance
      await dataSyncJob.initialize()
    })

    test('should start scheduled sync with cron jobs', () => {
      // Force GitHub to be configured for this test
      dataSyncJob.isGitHubConfigured = true
      
      dataSyncJob.startScheduledSync()

      expect(consoleLogSpy).toHaveBeenCalledWith('⏰ Scheduled data sync jobs started')
    })

    test('should handle GitHub service not configured', () => {
      dataSyncJob.isGitHubConfigured = false

      dataSyncJob.startScheduledSync()

      expect(consoleLogSpy).toHaveBeenCalledWith('⚠️  GitHub not configured, scheduled sync disabled')
    })
  })

  describe('performInitialSync', () => {
    beforeEach(async () => {
      dataSyncJob = dataSyncJobInstance
      await dataSyncJob.initialize()
    })

    test('should perform initial sync successfully', async () => {
      // Force GitHub to be configured for this test
      dataSyncJob.isGitHubConfigured = true
      dataSyncJob.githubService = mockGitHubService
      
      jest.spyOn(dataSyncJob, 'syncAllData').mockResolvedValue()

      await dataSyncJob.performInitialSync()

      expect(consoleLogSpy).toHaveBeenCalledWith('🚀 Performing initial data sync...')
      expect(dataSyncJob.syncAllData).toHaveBeenCalled()
    })

    test('should handle GitHub service not configured', async () => {
      dataSyncJob.isGitHubConfigured = false

      await dataSyncJob.performInitialSync()

      expect(consoleLogSpy).toHaveBeenCalledWith('⚠️  GitHub not configured, skipping initial sync (using mock data)')
    })
  })
})
