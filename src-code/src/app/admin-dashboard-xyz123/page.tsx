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
      <div className="min-h-screen bg-transparent flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-20"></div>
        
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-md border border-white/20 relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-accent to-accent-light rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Access</h1>
            <p className="text-foreground/70">Enter your admin key to access the dashboard</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="secretKey" className="block text-sm font-semibold text-foreground mb-3">
                Admin Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="secretKey"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background/50 backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300 hover:border-accent/50"
                  placeholder="Enter your admin key"
                  onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 animate-fade-in">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}
            
            <Button
              onClick={handleAuth}
              disabled={loading}
              loading={loading}
              variant="cta"
              size="lg"
              className="w-full transform transition-all duration-300 hover:shadow-xl hover:shadow-accent/25"
            >
              {loading ? 'Verifying Access...' : 'Access Dashboard'}
            </Button>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-foreground/50">
                Secure admin portal • Portfolio Management System
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-20"></div>
      
      {/* Enhanced Header */}
      <div className="bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-accent-light rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Portfolio Admin</h1>
                <p className="text-sm text-foreground/60">Management Dashboard</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                onClick={triggerRefresh}
                disabled={loading}
                loading={loading}
                variant="cta"
                size="md"
                className="w-full sm:w-auto transform transition-all duration-300 hover:shadow-lg hover:shadow-accent/25"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                }
              >
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              <Button
                onClick={() => setIsAuthorized(false)}
                variant="outline"
                size="md"
                className="w-full sm:w-auto hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-800 dark:hover:text-red-400"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                }
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {loading && (
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-lg inline-block">
              <div className="relative">
                <div className="w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-accent/20"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-2 border-accent-light/40 border-b-transparent animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Loading Dashboard</h3>
                <p className="text-foreground/70">Fetching your latest data...</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">Dashboard Error</h3>
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {systemHealth && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">System Status</h3>
                <svg className="w-5 h-5 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                systemHealth.status === 'ok' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' 
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  systemHealth.status === 'ok' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                {systemHealth.status.toUpperCase()}
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">System Uptime</h3>
                <svg className="w-5 h-5 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold text-accent">
                  {Math.floor(systemHealth.uptime / 3600)}
                </p>
                <span className="text-sm text-foreground/60 font-medium">hours</span>
                <p className="text-xl font-semibold text-accent-light">
                  {Math.floor((systemHealth.uptime % 3600) / 60)}
                </p>
                <span className="text-sm text-foreground/60 font-medium">min</span>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Last Updated</h3>
                <svg className="w-5 h-5 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <p className="text-sm text-foreground/70 font-medium">
                {new Date(systemHealth.timestamp).toLocaleString()}
              </p>
              <p className="text-xs text-foreground/50 mt-1">
                {new Date(systemHealth.timestamp).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        )}

        {dashboardData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Info */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">User Profile</h2>
                <svg className="w-6 h-6 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              {dashboardData.user ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <div>
                      <span className="text-sm font-medium text-foreground/60">Name</span>
                      <p className="text-foreground font-semibold">{dashboardData.user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-2 h-2 bg-accent-light rounded-full mt-2"></div>
                    <div>
                      <span className="text-sm font-medium text-foreground/60">Bio</span>
                      <p className="text-foreground">{dashboardData.user.bio}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-white/5 rounded-lg text-center">
                      <p className="text-2xl font-bold text-accent">{dashboardData.user.public_repos}</p>
                      <p className="text-xs text-foreground/60 font-medium">Public Repos</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg text-center">
                      <p className="text-2xl font-bold text-accent-light">{dashboardData.user.followers}</p>
                      <p className="text-xs text-foreground/60 font-medium">Followers</p>
                    </div>
                    <div className="p-3 bg-background/50 rounded-lg text-center">
                      <svg className="w-6 h-6 mx-auto mb-1 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-xs text-foreground/60 font-medium">{dashboardData.user.location}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 mx-auto text-foreground/20 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-foreground/70">No user data available</p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Statistics</h2>
                <svg className="w-6 h-6 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              {dashboardData.stats ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg border border-accent/20">
                    <div className="flex items-center justify-between mb-2">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
                      </svg>
                      <span className="text-xs font-medium text-foreground/60">REPOS</span>
                    </div>
                    <p className="text-2xl font-bold text-accent">{dashboardData.stats.totalRepos}</p>
                    <p className="text-xs text-foreground/50 mt-1">Total Repositories</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-lg border border-yellow-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      <span className="text-xs font-medium text-foreground/60">STARS</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-500">{dashboardData.stats.totalStars}</p>
                    <p className="text-xs text-foreground/50 mt-1">Total Stars</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg border border-blue-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span className="text-xs font-medium text-foreground/60">FORKS</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-500">{dashboardData.stats.totalForks}</p>
                    <p className="text-xs text-foreground/50 mt-1">Total Forks</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg border border-green-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-xs font-medium text-foreground/60">FOLLOWERS</span>
                    </div>
                    <p className="text-2xl font-bold text-green-500">{dashboardData.stats.followers}</p>
                    <p className="text-xs text-foreground/50 mt-1">Followers</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 mx-auto text-foreground/20 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-foreground/70">No stats available</p>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
                <svg className="w-6 h-6 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {dashboardData.activity && dashboardData.activity.length > 0 ? (
                  dashboardData.activity.slice(0, 10).map((activity: Activity, index: number) => (
                    <div key={index} className="group relative">
                      <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-accent/30 transition-all duration-200">
                        <div className="flex-shrink-0">
                          <div className="w-3 h-3 bg-accent rounded-full ring-4 ring-accent/20"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-foreground">{activity.type}</p>
                            <span className="text-xs text-foreground/50 font-medium">
                              {new Date(activity.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/70 flex items-center">
                            <svg className="w-4 h-4 mr-1.5 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
                            </svg>
                            {activity.repo?.name}
                          </p>
                        </div>
                      </div>
                      {index < dashboardData.activity.slice(0, 10).length - 1 && (
                        <div className="absolute left-6 top-16 w-px h-4 bg-border/50"></div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 mx-auto text-foreground/20 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="text-foreground/70">No recent activity</p>
                  </div>
                )}
              </div>
            </div>

            {/* Repositories */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Repositories</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-foreground/60 font-medium">
                    {dashboardData.repositories?.length || 0} repos
                  </span>
                  <svg className="w-6 h-6 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
                  </svg>
                </div>
              </div>
              {dashboardData.repositories && dashboardData.repositories.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {dashboardData.repositories.slice(0, 10).map((repo: Repository, index: number) => (
                    <div key={index} className="group p-5 bg-white/5 rounded-lg border border-white/10 hover:border-accent/30 hover:bg-white/10 transition-all duration-200">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors duration-200">
                          {repo.name}
                        </h3>
                        <div className="flex items-center space-x-3 text-sm">
                          <span className="flex items-center text-yellow-500">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            {repo.stargazers_count}
                          </span>
                          <span className="flex items-center text-blue-500">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                            {repo.forks_count}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                        {repo.description || 'No description available'}
                      </p>
                      <div className="flex items-center justify-between">
                        {repo.language && (
                          <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-accent/20 to-accent/10 text-accent rounded-full text-xs font-medium border border-accent/20">
                            <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                            {repo.language}
                          </span>
                        )}
                        <div className="flex items-center text-xs text-foreground/50">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Updated {new Date(repo.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-foreground/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
                  </svg>
                  <p className="text-foreground/70 text-lg font-medium mb-2">No repositories found</p>
                  <p className="text-foreground/50 text-sm">Your repositories will appear here once loaded</p>
                </div>
              )}
            </div>
          </div>
        )}

        {dashboardData && (
          <div className="mt-8">
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10 text-center">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <svg className="w-4 h-4 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Last Updated</span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {dashboardData.lastUpdated ? new Date(dashboardData.lastUpdated).toLocaleString() : 'Never'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}