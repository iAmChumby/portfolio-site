'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui'
import { Card, CardHeader, CardBody } from '@/components/ui'

interface DashboardData {
  analytics: {
    totalViews: number
    uniqueVisitors: number
    bounceRate: number
    avgSessionDuration: string
  }
  projects: Array<{
    id: string
    name: string
    status: string
    lastUpdated: string
  }>
  logs: Array<{
    id: string
    timestamp: string
    level: string
    message: string
  }>
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Check authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('admin-authenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
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
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      if (response.ok) {
        setIsAuthenticated(true)
        localStorage.setItem('admin-authenticated', 'true')
        await fetchDashboardData()
      } else {
        setError('Invalid password')
      }
    } catch (err) {
      setError('Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setLoading(true)
    await fetchDashboardData()
    setLoading(false)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin-authenticated')
    setDashboardData(null)
    setPassword('')
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
                  placeholder="Enter your admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Portfolio Admin</h1>
                <p className="text-sm text-gray-600">Management Dashboard</p>
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
                      <div className="text-2xl font-bold text-gray-900">{dashboardData?.analytics.totalViews || 0}</div>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <h3 className="text-sm font-medium text-gray-600">Unique Visitors</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="text-2xl font-bold text-gray-900">{dashboardData?.analytics.uniqueVisitors || 0}</div>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <h3 className="text-sm font-medium text-gray-600">Bounce Rate</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="text-2xl font-bold text-gray-900">{dashboardData?.analytics.bounceRate || 0}%</div>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <h3 className="text-sm font-medium text-gray-600">Avg Session</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="text-2xl font-bold text-gray-900">{dashboardData?.analytics.avgSessionDuration || '0m'}</div>
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
                          <p className="text-2xl font-bold text-gray-900">{dashboardData?.analytics.totalViews || 0}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                          <p className="text-2xl font-bold text-gray-900">{dashboardData?.analytics.uniqueVisitors || 0}</p>
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
                    <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
                    <p className="text-sm text-gray-600">Manage your portfolio projects</p>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-4">
                      {dashboardData?.projects?.map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900">{project.name}</h3>
                            <p className="text-sm text-gray-600">Last updated: {project.lastUpdated}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            project.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                      )) || (
                        <p className="text-gray-600">No projects found</p>
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
                    <h2 className="text-lg font-semibold text-gray-900">System Logs</h2>
                    <p className="text-sm text-gray-600">Recent system activity and logs</p>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {dashboardData?.logs?.map((log) => (
                        <div key={log.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            log.level === 'error' 
                              ? 'bg-red-100 text-red-800' 
                              : log.level === 'warning' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {log.level}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{log.message}</p>
                            <p className="text-xs text-gray-600">{log.timestamp}</p>
                          </div>
                        </div>
                      )) || (
                        <p className="text-gray-600">No logs available</p>
                      )}
                    </div>
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