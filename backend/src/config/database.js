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
  }
}

class Database {
  constructor() {
    this.db = null
    this.isInitialized = false
  }

  async initialize() {
    if (this.isInitialized) {
      return this.db
    }

    try {
      const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/portfolio.json')
      const adapter = new JSONFile(dbPath)
      this.db = new Low(adapter, defaultData)

      // Read the database
      await this.db.read()

      // Initialize with default data if empty
      if (!this.db.data) {
        this.db.data = defaultData
        await this.db.write()
      }

      this.isInitialized = true
      console.log('Database initialized successfully')
      return this.db
    } catch (error) {
      console.error('Database initialization failed:', error)
      throw error
    }
  }

  async getDb() {
    if (!this.isInitialized) {
      await this.initialize()
    }
    return this.db
  }

  // User data methods
  async getUser() {
    const db = await this.getDb()
    await db.read()
    return db.data.user
  }

  async setUser(userData) {
    const db = await this.getDb()
    await db.read()
    db.data.user = userData
    db.data.lastUpdated = new Date().toISOString()
    await db.write()
    return userData
  }

  // Repository methods
  async getRepositories() {
    const db = await this.getDb()
    await db.read()
    return db.data.repositories
  }

  async setRepositories(repositories) {
    const db = await this.getDb()
    await db.read()
    db.data.repositories = repositories
    db.data.lastUpdated = new Date().toISOString()
    await db.write()
    return repositories
  }

  // Languages methods
  async getLanguages() {
    const db = await this.getDb()
    await db.read()
    return db.data.languages
  }

  async setLanguages(languages) {
    const db = await this.getDb()
    await db.read()
    db.data.languages = languages
    db.data.lastUpdated = new Date().toISOString()
    await db.write()
    return languages
  }

  // Activity methods
  async getActivity() {
    const db = await this.getDb()
    await db.read()
    return db.data.activity
  }

  async setActivity(activity) {
    const db = await this.getDb()
    await db.read()
    db.data.activity = activity
    db.data.lastUpdated = new Date().toISOString()
    await db.write()
    return activity
  }

  // Workflows methods
  async getWorkflows() {
    const db = await this.getDb()
    await db.read()
    return db.data.workflows
  }

  async setWorkflows(workflows) {
    const db = await this.getDb()
    await db.read()
    db.data.workflows = workflows
    db.data.lastUpdated = new Date().toISOString()
    await db.write()
    return workflows
  }

  // Stats methods
  async getStats() {
    const db = await this.getDb()
    await db.read()
    return db.data.stats
  }

  async setStats(stats) {
    const db = await this.getDb()
    await db.read()
    db.data.stats = { ...db.data.stats, ...stats }
    db.data.lastUpdated = new Date().toISOString()
    await db.write()
    return db.data.stats
  }

  // Utility methods
  async getLastUpdated() {
    const db = await this.getDb()
    await db.read()
    return db.data.lastUpdated
  }

  async getAllData() {
    const db = await this.getDb()
    await db.read()
    return db.data
  }
}

// Export singleton instance
export default new Database()