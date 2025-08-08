import axios from 'axios'

class GitHubService {
  constructor() {
    this.token = process.env.GITHUB_TOKEN
    this.username = process.env.GITHUB_USERNAME
    this.baseURL = 'https://api.github.com'
    this.isConfigured = false
    
    if (!this.token || !this.username || this.token === 'your_github_token_here' || this.username === 'your_github_username') {
      console.warn('⚠️  GitHub credentials not configured. GitHub API features will be disabled.')
      console.warn('   Set GITHUB_TOKEN and GITHUB_USERNAME environment variables to enable GitHub integration.')
      this.isConfigured = false
      return
    }

    this.isConfigured = true
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Backend/1.0.0'
      },
      timeout: 10000
    })
  }

  _checkConfiguration() {
    if (!this.isConfigured) {
      throw new Error('GitHub service is not configured. Please set GITHUB_TOKEN and GITHUB_USERNAME environment variables.')
    }
  }

  async fetchUser() {
    this._checkConfiguration()
    try {
      const response = await this.client.get(`/users/${this.username}`)
      return response.data
    } catch (error) {
      console.error('Error fetching user data:', error.message)
      throw new Error(`Failed to fetch user data: ${error.message}`)
    }
  }

  async fetchRepositories(page = 1, perPage = 100) {
    this._checkConfiguration()
    try {
      const response = await this.client.get(`/users/${this.username}/repos`, {
        params: {
          sort: 'updated',
          direction: 'desc',
          per_page: perPage,
          page
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching repositories:', error.message)
      throw new Error(`Failed to fetch repositories: ${error.message}`)
    }
  }

  async fetchAllRepositories() {
    this._checkConfiguration()
    try {
      let allRepos = []
      let page = 1
      let hasMore = true

      while (hasMore) {
        const repos = await this.fetchRepositories(page, 100)
        allRepos = allRepos.concat(repos)
        hasMore = repos.length === 100
        page++
      }

      return allRepos
    } catch (error) {
      console.error('Error fetching all repositories:', error.message)
      throw error
    }
  }

  async fetchRepositoryLanguages(repoName) {
    this._checkConfiguration()
    try {
      const response = await this.client.get(`/repos/${this.username}/${repoName}/languages`)
      return response.data
    } catch (error) {
      console.error(`Error fetching languages for ${repoName}:`, error.message)
      return {}
    }
  }

  async fetchUserEvents(page = 1, perPage = 30) {
    this._checkConfiguration()
    try {
      const response = await this.client.get(`/users/${this.username}/events`, {
        params: {
          per_page: perPage,
          page
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching user events:', error.message)
      throw new Error(`Failed to fetch user events: ${error.message}`)
    }
  }

  async fetchWorkflowRuns(repoName, page = 1, perPage = 10) {
    this._checkConfiguration()
    try {
      const response = await this.client.get(`/repos/${this.username}/${repoName}/actions/runs`, {
        params: {
          per_page: perPage,
          page
        }
      })
      return response.data.workflow_runs || []
    } catch (error) {
      console.error(`Error fetching workflow runs for ${repoName}:`, error.message)
      return []
    }
  }

  async aggregateLanguages(repositories) {
    const languageStats = {}
    
    for (const repo of repositories) {
      if (repo.fork) continue // Skip forked repositories
      
      try {
        const languages = await this.fetchRepositoryLanguages(repo.name)
        
        for (const [language, bytes] of Object.entries(languages)) {
          if (languageStats[language]) {
            languageStats[language] += bytes
          } else {
            languageStats[language] = bytes
          }
        }
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.warn(`Skipping language stats for ${repo.name}:`, error.message)
      }
    }

    // Calculate percentages
    const totalBytes = Object.values(languageStats).reduce((sum, bytes) => sum + bytes, 0)
    const languagePercentages = {}
    
    for (const [language, bytes] of Object.entries(languageStats)) {
      languagePercentages[language] = {
        bytes,
        percentage: totalBytes > 0 ? ((bytes / totalBytes) * 100).toFixed(2) : 0
      }
    }

    return languagePercentages
  }

  async calculateStats(repositories, user) {
    const stats = {
      totalStars: 0,
      totalForks: 0,
      totalRepos: repositories.length,
      followers: user?.followers || 0,
      following: user?.following || 0
    }

    for (const repo of repositories) {
      stats.totalStars += repo.stargazers_count || 0
      stats.totalForks += repo.forks_count || 0
    }

    return stats
  }

  async getFeaturedRepositories(repositories, limit = 6) {
    // Filter out forks and sort by stars, then by recent activity
    const nonForks = repositories.filter(repo => !repo.fork)
    
    return nonForks
      .sort((a, b) => {
        // Primary sort: stars
        const starDiff = (b.stargazers_count || 0) - (a.stargazers_count || 0)
        if (starDiff !== 0) return starDiff
        
        // Secondary sort: recent activity
        return new Date(b.updated_at) - new Date(a.updated_at)
      })
      .slice(0, limit)
  }

  async processRecentActivity(events, limit = 10) {
    const relevantEvents = events
      .filter(event => {
        // Filter for relevant event types
        const relevantTypes = [
          'PushEvent',
          'CreateEvent',
          'ReleaseEvent',
          'PullRequestEvent',
          'IssuesEvent',
          'WatchEvent',
          'ForkEvent'
        ]
        return relevantTypes.includes(event.type)
      })
      .slice(0, limit)
      .map(event => ({
        id: event.id,
        type: event.type,
        repo: event.repo?.name,
        created_at: event.created_at,
        payload: this.simplifyPayload(event.payload, event.type)
      }))

    return relevantEvents
  }

  simplifyPayload(payload, eventType) {
    switch (eventType) {
      case 'PushEvent':
        return {
          commits: payload.commits?.length || 0,
          ref: payload.ref
        }
      case 'CreateEvent':
        return {
          ref_type: payload.ref_type,
          ref: payload.ref
        }
      case 'ReleaseEvent':
        return {
          action: payload.action,
          release: payload.release?.name || payload.release?.tag_name
        }
      case 'PullRequestEvent':
        return {
          action: payload.action,
          number: payload.pull_request?.number,
          title: payload.pull_request?.title
        }
      case 'IssuesEvent':
        return {
          action: payload.action,
          number: payload.issue?.number,
          title: payload.issue?.title
        }
      default:
        return {}
    }
  }
}

export default GitHubService