import cron from 'node-cron'
import GitHubService from '../services/github.js'
import database from '../config/database.js'

class DataSyncJob {
  constructor() {
    this.githubService = null
    this.isRunning = false
  }

  async initialize() {
    try {
      this.githubService = new GitHubService()
      console.log('✅ DataSync job initialized')
    } catch (error) {
      console.error('❌ Failed to initialize DataSync job:', error)
      throw error
    }
  }

  async syncAllData() {
    if (this.isRunning) {
      console.log('⏳ Data sync already in progress, skipping...')
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

  async syncUserData() {
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

  async syncRepositories() {
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

  async syncLanguages() {
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

  async syncActivity() {
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

  async syncWorkflows() {
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

  async updateStats() {
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

  startScheduledSync() {
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

  async performInitialSync() {
    console.log('🚀 Performing initial data sync...')
    await this.syncAllData()
  }
}

export default DataSyncJob