import cron from 'node-cron'
import GitHubService from '../services/github.js'
import database from '../config/database.js'

class DataSyncJob {
  constructor () {
    this.githubService = null
    this.isRunning = false
    this.isGitHubConfigured = false
  }

  async initialize () {
    try {
      this.githubService = new GitHubService()
      this.isGitHubConfigured = this.githubService.isConfigured
      
      if (this.isGitHubConfigured) {
        console.log('DataSync job initialized with GitHub integration')
      } else {
        console.log('DataSync job initialized without GitHub integration (credentials not configured)')
        await this.initializeMockData()
      }
    } catch (error) {
      console.error('Failed to initialize DataSync job:', error)
      this.isGitHubConfigured = false
      await this.initializeMockData()
    }
  }

  async initializeMockData () {
    console.log('Initializing with mock data for development...')
    
    const mockUser = {
      login: 'developer',
      name: 'Portfolio Developer',
      bio: 'Full-stack developer passionate about creating amazing web experiences',
      location: 'Remote',
      followers: 42,
      following: 24,
      public_repos: 15,
      avatar_url: 'https://github.com/identicons/developer.png',
      html_url: 'https://github.com/developer'
    }

    const mockRepositories = [
      {
        name: 'portfolio-site',
        description: 'Personal portfolio website built with modern web technologies',
        stargazers_count: 12,
        forks_count: 3,
        language: 'JavaScript',
        updated_at: new Date().toISOString(),
        html_url: 'https://github.com/developer/portfolio-site',
        fork: false
      },
      {
        name: 'react-dashboard',
        description: 'Modern React dashboard with real-time analytics',
        stargazers_count: 8,
        forks_count: 2,
        language: 'TypeScript',
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        html_url: 'https://github.com/developer/react-dashboard',
        fork: false
      }
    ]

    const mockLanguages = {
      JavaScript: { bytes: 45000, percentage: '60.00' },
      TypeScript: { bytes: 20000, percentage: '26.67' },
      CSS: { bytes: 8000, percentage: '10.67' },
      HTML: { bytes: 2000, percentage: '2.67' }
    }

    const mockActivity = [
      {
        id: '1',
        type: 'PushEvent',
        repo: { name: 'developer/portfolio-site' },
        created_at: new Date().toISOString(),
        payload: { commits: [{ message: 'Update portfolio design' }] }
      }
    ]

    const mockStats = {
      totalStars: 20,
      totalForks: 5,
      totalRepos: 2,
      followers: 42,
      following: 24
    }

    // Save mock data to database
    await database.setUser(mockUser)
    await database.setRepositories(mockRepositories)
    await database.setLanguages(mockLanguages)
    await database.setActivity(mockActivity)
    await database.setStats(mockStats)
    await database.setWorkflows([])

    console.log('✅ Mock data initialized successfully')
  }

  async syncAllData () {
    if (this.isRunning) {
      console.log('⏳ Data sync already in progress, skipping...')
      return
    }

    if (!this.isGitHubConfigured) {
      console.log('⚠️  GitHub not configured, skipping data sync')
      return
    }

    this.isRunning = true
    console.log('🔄 Starting full data sync...')

    try {
      // Sync user data
      await this.syncUserData()
      
      // Sync repositories
      await this.syncRepositories()
      
      // Sync languages (depends on repositories)
      await this.syncLanguages()
      
      // Sync activity
      await this.syncActivity()
      
      // Sync workflows
      await this.syncWorkflows()
      
      // Update stats
      await this.updateStats()
      
      console.log('✅ Full data sync completed successfully')
    } catch (error) {
      console.error('❌ Data sync failed:', error)
    } finally {
      this.isRunning = false
    }
  }

  async syncUserData () {
    try {
      console.log('👤 Syncing user data...')
      const userData = await this.githubService.fetchUser()
      await database.setUser(userData)
      console.log('✅ User data synced')
    } catch (error) {
      console.error('❌ Failed to sync user data:', error)
      throw error
    }
  }

  async syncRepositories () {
    try {
      console.log('📁 Syncing repositories...')
      const repositories = await this.githubService.fetchAllRepositories()
      await database.setRepositories(repositories)
      console.log(`✅ Synced ${repositories.length} repositories`)
    } catch (error) {
      console.error('❌ Failed to sync repositories:', error)
      throw error
    }
  }

  async syncLanguages () {
    try {
      console.log('💻 Syncing languages...')
      const repositories = await database.getRepositories()
      const languages = await this.githubService.aggregateLanguages(repositories)
      await database.setLanguages(languages)
      console.log(`✅ Synced ${Object.keys(languages).length} languages`)
    } catch (error) {
      console.error('❌ Failed to sync languages:', error)
      throw error
    }
  }

  async syncActivity () {
    try {
      console.log('📊 Syncing activity...')
      const events = await this.githubService.fetchUserEvents()
      const activity = await this.githubService.processRecentActivity(events)
      await database.setActivity(activity)
      console.log(`✅ Synced ${activity.length} activity items`)
    } catch (error) {
      console.error('❌ Failed to sync activity:', error)
      throw error
    }
  }

  async syncWorkflows () {
    try {
      console.log('🔄 Syncing workflows...')
      const repositories = await database.getRepositories()
      
      // Get workflows from top repositories (to avoid rate limits)
      const topRepos = repositories
        .filter(repo => !repo.fork)
        .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
        .slice(0, 10)
      
      const allWorkflows = []
      for (const repo of topRepos) {
        try {
          const workflows = await this.githubService.fetchWorkflowRuns(repo.name)
          allWorkflows.push(...workflows.map(w => ({ ...w, repo: repo.name })))
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 200))
        } catch (error) {
          console.warn(`⚠️  Skipping workflows for ${repo.name}:`, error.message)
        }
      }
      
      // Sort by date and limit
      const sortedWorkflows = allWorkflows
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 20)
      
      await database.setWorkflows(sortedWorkflows)
      console.log(`✅ Synced ${sortedWorkflows.length} workflow runs`)
    } catch (error) {
      console.error('❌ Failed to sync workflows:', error)
      throw error
    }
  }

  async updateStats () {
    try {
      console.log('📈 Updating stats...')
      const repositories = await database.getRepositories()
      const user = await database.getUser()
      const stats = await this.githubService.calculateStats(repositories, user)
      await database.setStats(stats)
      console.log('✅ Stats updated')
    } catch (error) {
      console.error('❌ Failed to update stats:', error)
      throw error
    }
  }

  startScheduledSync () {
    if (!this.isGitHubConfigured) {
      console.log('⚠️  GitHub not configured, scheduled sync disabled')
      return
    }

    // Run every 6 hours
    cron.schedule('0 */6 * * *', async () => {
      console.log('⏰ Scheduled data sync triggered')
      await this.syncAllData()
    })

    // Run every hour for activity (more frequent updates)
    cron.schedule('0 * * * *', async () => {
      if (this.isRunning) return
      
      console.log('⏰ Scheduled activity sync triggered')
      try {
        await this.syncActivity()
      } catch (error) {
        console.error('❌ Scheduled activity sync failed:', error)
      }
    })

    console.log('⏰ Scheduled data sync jobs started')
    console.log('   - Full sync: Every 6 hours')
    console.log('   - Activity sync: Every hour')
  }

  async performInitialSync () {
    if (!this.isGitHubConfigured) {
      console.log('⚠️  GitHub not configured, skipping initial sync (using mock data)')
      return
    }
    
    console.log('🚀 Performing initial data sync...')
    await this.syncAllData()
  }
}

export default DataSyncJob
