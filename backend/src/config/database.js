import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Default data structure
const defaultData = {
  user: null,
  repositories: [],
  languages: {},
  activity: [],
  workflows: [],
  lastUpdated: null,
  stats: {
    totalStars: 0,
    totalForks: 0,
    totalRepos: 0,
    followers: 0,
    following: 0
  },
  analytics: {
    totalVisits: 0,
    uniqueVisitors: 0,
    dailyStats: {},
    hourlyStats: {},
    popularPages: {},
    referrers: {},
    userAgents: {},
    responseTimeStats: {
      average: 0,
      min: 0,
      max: 0,
      samples: 0
    },
    requestLogs: []
  }
}

class Database {
  constructor () {
    this.db = null
    this.isInitialized = false
  }

  async initialize () {
    if (this.isInitialized) {
      return this.db
    }

    try {
      const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/portfolio.json')
      
      // Ensure directory exists
      const fs = await import('fs/promises')
      const dbDir = path.dirname(dbPath)
      try {
        await fs.mkdir(dbDir, { recursive: true })
      } catch (error) {
        // Directory might already exist, that's fine
      }
      
      const adapter = new JSONFile(dbPath)
      this.db = new Low(adapter, defaultData)

      // Read the database
      await this.db.read()

      // Initialize with default data if empty
      if (!this.db.data) {
        this.db.data = defaultData
        await this.db.write()
      } else {
        // Ensure analytics structure exists in existing data
        if (!this.db.data.analytics) {
          this.db.data.analytics = defaultData.analytics
          await this.db.write()
        }
      }

      this.isInitialized = true
      console.log('Database initialized successfully')
      return this.db
    } catch (error) {
      console.error('Database initialization failed:', error)
      throw error
    }
  }

  async getDb () {
    if (!this.isInitialized) {
      await this.initialize()
    }
    return this.db
  }

  // User data methods
  async getUser () {
    const db = await this.getDb()
    return db.data.user
  }

  async setUser (userData) {
    const db = await this.getDb()
    db.data.user = userData
    db.data.lastUpdated = new Date().toISOString()
    await db.write()
    return userData
  }

  // Repository methods
  async getRepositories () {
    const db = await this.getDb()
    return db.data.repositories
  }

  async setRepositories (repositories) {
    const db = await this.getDb()
    db.data.repositories = repositories
    db.data.lastUpdated = new Date().toISOString()
    await db.write()
    return repositories
  }

  // Languages methods
  async getLanguages () {
    const db = await this.getDb()
    return db.data.languages
  }

  async setLanguages (languages) {
    const db = await this.getDb()
    db.data.languages = languages
    db.data.lastUpdated = new Date().toISOString()
    await db.write()
    return languages
  }

  // Activity methods
  async getActivity () {
    const db = await this.getDb()
    return db.data.activity
  }

  async setActivity (activity) {
    const db = await this.getDb()
    db.data.activity = activity
    db.data.lastUpdated = new Date().toISOString()
    await db.write()
    return activity
  }

  // Workflows methods
  async getWorkflows () {
    const db = await this.getDb()
    return db.data.workflows
  }

  async setWorkflows (workflows) {
    const db = await this.getDb()
    db.data.workflows = workflows
    db.data.lastUpdated = new Date().toISOString()
    await db.write()
    return workflows
  }

  // Stats methods
  async getStats () {
    const db = await this.getDb()
    return db.data.stats
  }

  async setStats (stats) {
    const db = await this.getDb()
    db.data.stats = { ...db.data.stats, ...stats }
    db.data.lastUpdated = new Date().toISOString()
    await db.write()
    return db.data.stats
  }

  // Analytics methods
  async getAnalytics () {
    const db = await this.getDb()
    if (!db || !db.data) {
      return null
    }
    return db.data.analytics
  }

  async setAnalytics (analytics) {
    const db = await this.getDb()
    db.data.analytics = { ...db.data.analytics, ...analytics }
    db.data.lastUpdated = new Date().toISOString()
    await db.write()
    return db.data.analytics
  }

  async incrementVisits () {
    const db = await this.getDb()
    db.data.analytics.totalVisits += 1
    db.data.lastUpdated = new Date().toISOString()
    await db.write()
    return db.data.analytics.totalVisits
  }

  async addVisitor (visitorId) {
    const db = await this.getDb()
    const today = new Date().toISOString().split('T')[0]
    
    // Update unique visitors count
    if (!db.data.analytics.dailyStats[today]) {
      db.data.analytics.dailyStats[today] = {
        visits: 0,
        uniqueVisitors: []
      }
    }
    
    // Handle both Array (from JSON) and Set cases
    const uniqueVisitors = Array.isArray(db.data.analytics.dailyStats[today].uniqueVisitors) 
      ? db.data.analytics.dailyStats[today].uniqueVisitors
      : Array.from(db.data.analytics.dailyStats[today].uniqueVisitors)
    
    const wasNewVisitor = !uniqueVisitors.includes(visitorId)
    if (wasNewVisitor) {
      uniqueVisitors.push(visitorId)
      db.data.analytics.uniqueVisitors += 1
    }
    
    db.data.analytics.dailyStats[today].visits += 1
    db.data.analytics.dailyStats[today].uniqueVisitors = uniqueVisitors
    
    db.data.lastUpdated = new Date().toISOString()
    await db.write()
    
    return wasNewVisitor
  }

  async updatePageStats (path) {
    const db = await this.getDb()
    
    if (!db.data.analytics.popularPages[path]) {
      db.data.analytics.popularPages[path] = 0
    }
    
    db.data.analytics.popularPages[path] += 1
    db.data.lastUpdated = new Date().toISOString()
    await db.write()
    
    return db.data.analytics.popularPages[path]
  }

  async updateHourlyStats () {
    const db = await this.getDb()
    const hour = new Date().getHours()
    
    if (!db.data.analytics.hourlyStats[hour]) {
      db.data.analytics.hourlyStats[hour] = 0
    }
    
    db.data.analytics.hourlyStats[hour] += 1
    db.data.lastUpdated = new Date().toISOString()
    await db.write()
    
    return db.data.analytics.hourlyStats[hour]
  }

  async updateReferrerStats (referrer) {
    const db = await this.getDb()
    
    if (referrer && referrer !== 'direct') {
      if (!db.data.analytics.referrers[referrer]) {
        db.data.analytics.referrers[referrer] = 0
      }
      
      db.data.analytics.referrers[referrer] += 1
      db.data.lastUpdated = new Date().toISOString()
      await db.write()
    }
    
    return db.data.analytics.referrers[referrer] || 0
  }

  async updateUserAgentStats (userAgent) {
    const db = await this.getDb()
    
    if (userAgent) {
      // Extract browser name from user agent
      const browser = this.extractBrowserName(userAgent)
      
      if (!db.data.analytics.userAgents[browser]) {
        db.data.analytics.userAgents[browser] = 0
      }
      
      db.data.analytics.userAgents[browser] += 1
      db.data.lastUpdated = new Date().toISOString()
      await db.write()
    }
    
    return db.data.analytics.userAgents
  }

  async updateResponseTimeStats (responseTime) {
    const db = await this.getDb()
    const stats = db.data.analytics.responseTimeStats
    
    // Update running statistics
    if (stats.samples === 0) {
      stats.min = responseTime
      stats.max = responseTime
      stats.average = responseTime
    } else {
      stats.min = Math.min(stats.min, responseTime)
      stats.max = Math.max(stats.max, responseTime)
      stats.average = ((stats.average * stats.samples) + responseTime) / (stats.samples + 1)
    }
    
    stats.samples += 1
    db.data.lastUpdated = new Date().toISOString()
    await db.write()
    
    return stats
  }

  async addRequestLog (logEntry) {
    const db = await this.getDb()
    
    // Keep only the last 1000 request logs to prevent database bloat
    if (db.data.analytics.requestLogs.length >= 1000) {
      db.data.analytics.requestLogs = db.data.analytics.requestLogs.slice(-999)
    }
    
    db.data.analytics.requestLogs.push({
      ...logEntry,
      timestamp: new Date().toISOString()
    })
    
    db.data.lastUpdated = new Date().toISOString()
    await db.write()
    
    return db.data.analytics.requestLogs.length
  }

  // Helper method to extract browser name from user agent
  extractBrowserName (userAgent) {
    if (userAgent.includes('Edg/') || userAgent.includes('Edge/')) return 'Edge'
    if (userAgent.includes('Opera') || userAgent.includes('OPR/')) return 'Opera'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari'
    if (userAgent.includes('Chrome')) return 'Chrome'
    return 'Other'
  }

  // Utility methods
  async getLastUpdated () {
    const db = await this.getDb()
    return db.data.lastUpdated
  }

  async getAllData () {
    const db = await this.getDb()
    return db.data
  }
}

// Export singleton instance
export default new Database()
