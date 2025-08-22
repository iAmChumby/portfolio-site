'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui'
import { Card, CardHeader, CardBody } from '@/components/ui'
import { adminApi } from '@/lib/api/admin'
import type { DashboardData, SystemHealth, AnalyticsData } from '@/lib/api/admin'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminKey, setAdminKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Check authentication on mount
  useEffect(() => {
    const savedAdminKey = localStorage.getItem('admin-key')
    if (savedAdminKey && adminApi.isAuthenticated()) {
      setIsAuthenticated(true)
      setAdminKey(savedAdminKey)
      fetchDashboardData()
    }
  }, [])

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        setIsRefreshing(true)
        fetchDashboardData()
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Use the proper authentication method
      const authResponse = await adminApi.authenticate(adminKey)
      
      if (authResponse.success) {
        localStorage.setItem('admin-key', adminKey)
        setIsAuthenticated(true)
        await fetchDashboardData()
      } else {
        setError(authResponse.message || 'Invalid admin key')
      }
    } catch (error) {
      console.error('Authentication error:', error)
      setError('Authentication failed. Please check your admin key.')
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboardData = async () => {
    try {
      setIsRefreshing(true)
      
      // Fetch all data from backend API
      const [dashData, healthData, analyticsData] = await Promise.all([
        adminApi.getDashboardData(),
        adminApi.getSystemHealth(),
        adminApi.getAnalyticsData()
      ])
      
      setDashboardData(dashData)
      setSystemHealth(healthData)
      setAnalyticsData(analyticsData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to fetch dashboard data')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setLoading(true)
    try {
      // Trigger backend data refresh first
      await adminApi.refreshData()
      // Then fetch the updated data
      await fetchDashboardData()
    } catch (error) {
      console.error('Error refreshing data:', error)
      setError('Failed to refresh data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin-key')
    adminApi.clearAuth()
    setIsAuthenticated(false)
    setDashboardData(null)
    setSystemHealth(null)
    setAnalyticsData(null)
    setAdminKey('')
    setError('')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl bg-gray-900 border border-green-500/30">
          <CardHeader>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-green-400 mb-2">Admin Access</h1>
              <p className="text-gray-400">Secure dashboard authentication</p>
            </div>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your admin key"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-green-500/30 bg-gray-800 text-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-gray-500"
                />
              </div>
              {error && (
                <div className="bg-red-900/50 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-black font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Access Dashboard
                  </div>
                )}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-black/20 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Portfolio Admin</h1>
                <p className="text-sm text-gray-300">Management Dashboard</p>
                {isRefreshing && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600">Auto-refreshing...</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleRefresh} disabled={loading || isRefreshing}>
                {loading || isRefreshing ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        )}

        {!loading && (
          <div className="space-y-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'analytics'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Analytics
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'projects'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Projects
                </button>
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'logs'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Logs
                </button>
              </nav>
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <h3 className="text-sm font-medium text-gray-600">Total Views</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="text-2xl font-bold text-gray-900">{analyticsData?.summary?.totalVisits?.toLocaleString() || '0'}</div>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <h3 className="text-sm font-medium text-gray-600">Unique Visitors</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="text-2xl font-bold text-gray-900">{analyticsData?.summary?.uniqueVisitors?.toLocaleString() || '0'}</div>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <h3 className="text-sm font-medium text-gray-600">Bounce Rate</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="text-2xl font-bold text-gray-900">{analyticsData?.summary?.bounceRate || '0'}%</div>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <h3 className="text-sm font-medium text-gray-600">Avg Session</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="text-2xl font-bold text-gray-900">{analyticsData?.summary?.avgSessionDuration || '0m'}</div>
                    </CardBody>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-gray-900">Analytics Overview</h2>
                    <p className="text-sm text-gray-600">Detailed analytics and performance metrics</p>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">Total Page Views</p>
                          <p className="text-2xl font-bold text-gray-900">{analyticsData?.summary?.totalVisits?.toLocaleString() || '0'}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                          <p className="text-2xl font-bold text-gray-900">{analyticsData?.summary?.uniqueVisitors?.toLocaleString() || '0'}</p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-gray-900">GitHub Repositories</h2>
                    <p className="text-sm text-gray-600">Recent repositories from GitHub</p>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-4">
                      {dashboardData?.repositories && dashboardData.repositories.length > 0 ? (
                        dashboardData.repositories.slice(0, 5).map((repo) => (
                          <div key={repo.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                              <h3 className="font-medium text-gray-900">{repo.name}</h3>
                              <p className="text-sm text-gray-600">{repo.description || 'No description'}</p>
                              <p className="text-xs text-gray-500">Updated: {new Date(repo.updated_at).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                {repo.language || 'Unknown'}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">⭐ {repo.stargazers_count}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">No repositories found</p>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
                    <p className="text-sm text-gray-600">Current system status and health metrics</p>
                  </CardHeader>
                  <CardBody>
                    {systemHealth ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-600 mb-2">System Status</p>
                            <p className={`text-xl font-semibold ${
                              systemHealth.status === 'healthy' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {systemHealth.status?.toUpperCase() || 'UNKNOWN'}
                            </p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-600 mb-2">Uptime</p>
                            <p className="text-xl font-semibold text-gray-900">{systemHealth.uptime || 'N/A'}</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-600 mb-2">Memory Usage</p>
                            <p className="text-xl font-semibold text-gray-900">
                              {systemHealth.memory ? 
                                `${Math.round(systemHealth.memory.used / 1024 / 1024)} MB / ${Math.round(systemHealth.memory.total / 1024 / 1024)} MB` 
                                : 'N/A'
                              }
                            </p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-600 mb-2">Database Status</p>
                            <p className={`text-xl font-semibold ${
                              systemHealth.database?.connected ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {systemHealth.database?.connected ? 'CONNECTED' : 'DISCONNECTED'}
                            </p>
                          </div>
                        </div>
                        {systemHealth.lastUpdated && (
                          <div className="text-center text-sm text-gray-500">
                            Last updated: {new Date(systemHealth.lastUpdated).toLocaleString()}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Loading system health data...</p>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}