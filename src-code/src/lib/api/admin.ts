import { apiClient, handleApiError } from './client';
import { ApiResponse } from './types';

// Admin-specific types
export interface AdminAuthRequest {
  adminKey: string;
}

export interface AdminAuthResponse {
  success: boolean;
  message: string;
}

export interface DashboardData {
  repositories: Repository[];
  activity: Activity[];
  stats: Stats;
  user: User;
  lastUpdated: string;
}

export interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  type: string;
  repo: {
    name: string;
    url: string;
  };
  created_at: string;
}

export interface Stats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  followers: number;
}

export interface User {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  company: string;
  public_repos: number;
  followers: number;
}

export interface SystemHealth {
  status: string;
  uptime: number;
  timestamp: string;
  memory?: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu?: {
    usage: number;
  };
  database?: {
    status: string;
    responseTime: number;
  };
}

export interface AnalyticsData {
  summary: {
    totalVisits: number;
    uniqueVisitors: number;
    topPages: Array<{ page: string; visits: number }>;
    dailyStats: {
      today: number;
      todayUnique: number;
    };
  };
  dailyVisits: Array<{
    date: string;
    visits: number;
    uniqueVisitors: number;
  }>;
  popularPages: Array<{
    path: string;
    visits: number;
    uniqueVisitors: number;
  }>;
  recentVisitors: Array<{
    timestamp: string;
    ip: string;
    userAgent: string;
    path: string;
  }>;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  meta?: Record<string, unknown>;
  source?: string;
  stack?: string;
}

export interface LogsResponse {
  logs: LogEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SystemInfo {
  version: string;
  environment: string;
  nodeVersion: string;
  platform: string;
  architecture: string;
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
    cores: number;
  };
  database: {
    status: string;
    version?: string;
    size?: number;
  };
}

// Admin API Service Class
class AdminApiService {
  private adminKey: string | null = null;

  // Set admin key for authenticated requests
  setAdminKey(key: string): void {
    this.adminKey = key;
  }

  // Clear admin key (logout)
  clearAdminKey(): void {
    this.adminKey = null;
  }

  // Get headers with admin authentication
  private getAuthHeaders(): Record<string, string> {
    if (!this.adminKey) {
      throw new Error('Admin key not set. Please authenticate first.');
    }
    return {
      'x-admin-key': this.adminKey,
    };
  }

  // Authentication
  async authenticate(adminKey: string): Promise<AdminAuthResponse> {
    try {
      const response = await apiClient.post<AdminAuthResponse>('/admin/verify', {
        adminKey,
      });
      
      if (response.data.success) {
        this.setAdminKey(adminKey);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Dashboard Data
  async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await apiClient.get<DashboardData>('/admin/all', undefined);
      // Add auth headers manually since apiClient doesn't support custom headers in get method
      const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/all`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!authResponse.ok) {
        throw new Error(`HTTP ${authResponse.status}: ${authResponse.statusText}`);
      }
      
      const data = await authResponse.json();
      return data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // System Health
  async getSystemHealth(): Promise<SystemHealth> {
    try {
      const response = await apiClient.get<SystemHealth>('/health');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Analytics Data
  async getAnalyticsData(): Promise<AnalyticsData> {
    try {
      const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/analytics`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!authResponse.ok) {
        throw new Error(`HTTP ${authResponse.status}: ${authResponse.statusText}`);
      }
      
      const data = await authResponse.json();
      return data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Refresh Data
  async refreshData(): Promise<{ success: boolean; message: string }> {
    try {
      const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
      });
      
      if (!authResponse.ok) {
        throw new Error(`HTTP ${authResponse.status}: ${authResponse.statusText}`);
      }
      
      const data = await authResponse.json();
      return data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get System Information
  async getSystemInfo(): Promise<SystemInfo> {
    try {
      const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/system`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!authResponse.ok) {
        throw new Error(`HTTP ${authResponse.status}: ${authResponse.statusText}`);
      }
      
      const data = await authResponse.json();
      return data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Create Log Entry
  async createLog(logData: Omit<LogEntry, 'id'>): Promise<LogEntry> {
    try {
      const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/logs`, {
        method: 'POST',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
      });
      
      if (!authResponse.ok) {
        throw new Error(`HTTP ${authResponse.status}: ${authResponse.statusText}`);
      }
      
      const response = await authResponse.json();
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update Log Entry
  async updateLog(id: string, logData: Partial<LogEntry>): Promise<LogEntry> {
    try {
      const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/logs/${id}`, {
        method: 'PUT',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
      });
      
      if (!authResponse.ok) {
        throw new Error(`HTTP ${authResponse.status}: ${authResponse.statusText}`);
      }
      
      const response = await authResponse.json();
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Delete Log Entry
  async deleteLog(id: string): Promise<void> {
    try {
      const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/logs/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      
      if (!authResponse.ok) {
        throw new Error(`HTTP ${authResponse.status}: ${authResponse.statusText}`);
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Create System Config
  async createConfig(configData: any): Promise<any> {
    try {
      const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/config`, {
        method: 'POST',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configData),
      });
      
      if (!authResponse.ok) {
        throw new Error(`HTTP ${authResponse.status}: ${authResponse.statusText}`);
      }
      
      const response = await authResponse.json();
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update System Config
  async updateConfig(id: string, configData: any): Promise<any> {
    try {
      const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/config/${id}`, {
        method: 'PUT',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configData),
      });
      
      if (!authResponse.ok) {
        throw new Error(`HTTP ${authResponse.status}: ${authResponse.statusText}`);
      }
      
      const response = await authResponse.json();
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Delete System Config
  async deleteConfig(id: string): Promise<void> {
    try {
      const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/config/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      
      if (!authResponse.ok) {
        throw new Error(`HTTP ${authResponse.status}: ${authResponse.statusText}`);
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get Logs
  async getLogs(params?: {
    page?: number;
    limit?: number;
    level?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<LogsResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.level && params.level !== 'all') queryParams.append('level', params.level);
      if (params?.search) queryParams.append('search', params.search);
      
      const url = `/api/admin/logs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${url}`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!authResponse.ok) {
        throw new Error(`HTTP ${authResponse.status}: ${authResponse.statusText}`);
      }
      
      const response = await authResponse.json();
      
      // Transform backend response to match expected LogsResponse format
      if (response.success && response.data) {
        const logs = Array.isArray(response.data.logs) 
          ? response.data.logs.map((log: string, index: number) => ({
              id: `log-${index}`,
              timestamp: new Date().toISOString(),
              level: 'info' as const,
              message: log,
              source: response.data.file || 'system'
            }))
          : [];
        
        return {
          logs,
          pagination: {
            page: 1,
            limit: params?.limit || 100,
            total: logs.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          }
        };
      }
      
      // Fallback empty response
      return {
        logs: [],
        pagination: {
          page: 1,
          limit: params?.limit || 100,
          total: 0,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Load all dashboard data at once
  async loadAllDashboardData(): Promise<{
    dashboardData: DashboardData;
    systemHealth: SystemHealth;
    analyticsData: AnalyticsData;
  }> {
    try {
      const [dashboardData, systemHealth, analyticsData] = await Promise.all([
        this.getDashboardData(),
        this.getSystemHealth(),
        this.getAnalyticsData(),
      ]);

      return {
        dashboardData,
        systemHealth,
        analyticsData,
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Check if admin is authenticated
  isAuthenticated(): boolean {
    return this.adminKey !== null;
  }

  // Get current admin key (for debugging - should be used carefully)
  getCurrentAdminKey(): string | null {
    return this.adminKey;
  }
}

// Create singleton instance
export const adminApi = new AdminApiService();

// Export class for custom instances
export { AdminApiService };

// Utility functions for admin operations
export const adminUtils = {
  // Format log level for display
  formatLogLevel: (level: string): string => {
    const levels: Record<string, string> = {
      error: '🔴 Error',
      warn: '🟡 Warning',
      info: '🔵 Info',
      debug: '🟢 Debug',
    };
    return levels[level] || level;
  },

  // Format bytes to human readable
  formatBytes: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Format uptime to human readable
  formatUptime: (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  },

  // Format timestamp for display
  formatTimestamp: (timestamp: string): string => {
    return new Date(timestamp).toLocaleString();
  },

  // Get status color based on system health
  getStatusColor: (status: string): string => {
    const colors: Record<string, string> = {
      healthy: 'text-green-500',
      warning: 'text-yellow-500',
      error: 'text-red-500',
      unknown: 'text-gray-500',
    };
    return colors[status.toLowerCase()] || colors.unknown;
  },
};