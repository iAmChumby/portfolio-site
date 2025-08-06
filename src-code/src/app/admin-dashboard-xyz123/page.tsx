'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'

interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
}

interface Activity {
  id: string;
  type: string;
  repo: {
    name: string;
    url: string;
  };
  created_at: string;
}

interface Stats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  followers: number;
}

interface User {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  company: string;
  public_repos: number;
  followers: number;
}

interface DashboardData {
  repositories: Repository[]
  activity: Activity[]
  stats: Stats
  user: User
  lastUpdated: string
}

interface SystemHealth {
  status: string
  uptime: number
  timestamp: string
}

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [secretKey, setSecretKey] = useState('')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAuth = async () => {
    if (!secretKey.trim()) {
      setError('Please enter the admin key')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Verify admin access with backend
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminKey: secretKey })
      })

      if (response.ok) {
        setIsAuthorized(true)
        await loadDashboardData()
      } else {
        setError('Invalid admin key')
      }
    } catch {
      setError('Failed to verify admin access')
    } finally {
      setLoading(false)
    }
  }

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load all dashboard data
      const [allDataRes, healthRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/all`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/health`)
      ])

      if (allDataRes.ok && healthRes.ok) {
        const allData = await allDataRes.json()
        const health = await healthRes.json()
        
        setDashboardData(allData.data)
        setSystemHealth(health)
      } else {
        setError('Failed to load dashboard data')
      }
    } catch {
      setError('Error loading dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const triggerRefresh = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/refresh`, {
        method: 'POST'
      })
      
      if (response.ok) {
        await loadDashboardData()
        alert('Data refreshed successfully!')
      } else {
        alert('Failed to refresh data')
      }
    } catch {
      alert('Error refreshing data')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-secondary p-8 rounded-lg shadow-lg w-full max-w-md border border-border">
          <h1 className="text-2xl font-bold mb-6 text-center text-foreground">Admin Access</h1>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="secretKey" className="block text-sm font-medium text-foreground mb-2">
                Admin Key
              </label>
              <input
                type="password"
                id="secretKey"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                placeholder="Enter admin key"
                onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}
            
            <Button
              onClick={handleAuth}
              disabled={loading}
              loading={loading}
              variant="primary"
              size="md"
              className="w-full"
            >
              {loading ? 'Verifying...' : 'Access Dashboard'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <h1 className="text-2xl font-bold text-foreground">Portfolio Admin Dashboard</h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
              <Button
                onClick={triggerRefresh}
                disabled={loading}
                loading={loading}
                variant="cta"
                size="sm"
                className="w-full sm:w-auto"
              >
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              <Button
                onClick={() => setIsAuthorized(false)}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent"></div>
            <p className="mt-2 text-foreground">Loading dashboard data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {systemHealth && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-secondary p-6 rounded-lg shadow border border-border">
              <h3 className="text-lg font-semibold mb-2 text-foreground">System Status</h3>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                systemHealth.status === 'ok' 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' 
                  : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
              }`}>
                {systemHealth.status.toUpperCase()}
              </div>
            </div>
            
            <div className="bg-secondary p-6 rounded-lg shadow border border-border">
              <h3 className="text-lg font-semibold mb-2 text-foreground">Uptime</h3>
              <p className="text-2xl font-bold text-accent">
                {Math.floor(systemHealth.uptime / 3600)}h {Math.floor((systemHealth.uptime % 3600) / 60)}m
              </p>
            </div>
            
            <div className="bg-secondary p-6 rounded-lg shadow border border-border">
              <h3 className="text-lg font-semibold mb-2 text-foreground">Last Updated</h3>
              <p className="text-sm text-foreground/70">
                {new Date(systemHealth.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {dashboardData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Info */}
            <div className="bg-secondary p-6 rounded-lg shadow border border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground">User Profile</h2>
              {dashboardData.user ? (
                <div className="space-y-2">
                  <p className="text-foreground"><strong>Name:</strong> {dashboardData.user.name}</p>
                  <p className="text-foreground"><strong>Bio:</strong> {dashboardData.user.bio}</p>
                  <p className="text-foreground"><strong>Location:</strong> {dashboardData.user.location}</p>
                  <p className="text-foreground"><strong>Public Repos:</strong> {dashboardData.user.public_repos}</p>
                  <p className="text-foreground"><strong>Followers:</strong> {dashboardData.user.followers}</p>
                </div>
              ) : (
                <p className="text-foreground/70">No user data available</p>
              )}
            </div>

            {/* Stats */}
            <div className="bg-secondary p-6 rounded-lg shadow border border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Statistics</h2>
              {dashboardData.stats ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-accent">{dashboardData.stats.totalRepos}</p>
                    <p className="text-sm text-foreground/70">Total Repositories</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent-light">{dashboardData.stats.totalStars}</p>
                    <p className="text-sm text-foreground/70">Total Stars</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent">{dashboardData.stats.totalForks}</p>
                    <p className="text-sm text-foreground/70">Total Forks</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent-light">{dashboardData.stats.followers}</p>
                    <p className="text-sm text-foreground/70">Followers</p>
                  </div>
                </div>
              ) : (
                <p className="text-foreground/70">No stats available</p>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-secondary p-6 rounded-lg shadow border border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Activity</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {dashboardData.activity && dashboardData.activity.length > 0 ? (
                  dashboardData.activity.slice(0, 10).map((activity: Activity, index: number) => (
                    <div key={index} className="border-l-4 border-accent pl-4 py-2">
                      <p className="font-medium text-foreground">{activity.type}</p>
                      <p className="text-sm text-foreground/70">{activity.repo?.name}</p>
                      <p className="text-xs text-foreground/50">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-foreground/70">No recent activity</p>
                )}
              </div>
            </div>

            {/* Repositories */}
            <div className="bg-secondary p-6 rounded-lg shadow border border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Repositories</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {dashboardData.repositories && dashboardData.repositories.length > 0 ? (
                  dashboardData.repositories.slice(0, 10).map((repo: Repository, index: number) => (
                    <div key={index} className="border border-border rounded p-3 bg-background/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-foreground">{repo.name}</h3>
                          <p className="text-sm text-foreground/70">{repo.description}</p>
                        </div>
                        <div className="text-right text-sm text-foreground/70">
                          <p>⭐ {repo.stargazers_count}</p>
                          <p>🍴 {repo.forks_count}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-foreground/70">No repositories found</p>
                )}
              </div>
            </div>
          </div>
        )}

        {dashboardData && (
          <div className="mt-8 text-center text-sm text-foreground/50">
            Last updated: {dashboardData.lastUpdated ? new Date(dashboardData.lastUpdated).toLocaleString() : 'Never'}
          </div>
        )}
      </div>
    </div>
  )
}