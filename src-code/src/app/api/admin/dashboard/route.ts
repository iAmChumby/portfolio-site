import { NextRequest, NextResponse } from 'next/server'

// Mock dashboard data - in production, this would come from a database
const mockDashboardData = {
  analytics: {
    totalViews: 12543,
    uniqueVisitors: 8921,
    bounceRate: 34,
    avgSessionDuration: '3m 42s'
  },
  projects: [
    {
      id: '1',
      name: 'Portfolio Website',
      status: 'active',
      lastUpdated: '2024-01-15'
    },
    {
      id: '2', 
      name: 'E-commerce Platform',
      status: 'active',
      lastUpdated: '2024-01-10'
    },
    {
      id: '3',
      name: 'Mobile App',
      status: 'inactive',
      lastUpdated: '2023-12-20'
    }
  ],
  logs: [
    {
      id: '1',
      level: 'info',
      message: 'User visited homepage',
      timestamp: '2024-01-15 14:30:25'
    },
    {
      id: '2',
      level: 'warning',
      message: 'Slow API response detected',
      timestamp: '2024-01-15 14:25:10'
    },
    {
      id: '3',
      level: 'error',
      message: 'Failed to load external resource',
      timestamp: '2024-01-15 14:20:05'
    },
    {
      id: '4',
      level: 'info',
      message: 'Database backup completed',
      timestamp: '2024-01-15 14:15:00'
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    // In production, you would verify authentication here
    // For now, we'll just return the mock data
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return NextResponse.json(mockDashboardData, { status: 200 })
  } catch (error) {
    console.error('Dashboard data error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}