import { apiClient, handleApiError } from './client';

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
  lastUpdated?: string;
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
    connected: boolean;
  };
}

export interface AnalyticsData {
  summary: {
    totalVisits: number;
    uniqueVisitors: number;
    bounceRate: number;
    avgSessionDuration: number;
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

export interface ConfigEntry {
  id: string;
  key: string;
  value: unknown;
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConfigRequest {
  key: string;
  value: unknown;
  description?: string;
  category?: string;
}

export interface UpdateConfigRequest {
  key?: string;
  value?: unknown;
  description?: string;
  category?: string;
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

  clearAuth(): void {
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
      
      console.log('Admin auth response:', response.data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Dashboard Data
  async getDashboardData(): Promise<DashboardData> {
    try {
      // Use apiClient with auth headers
      const response = await apiClient.get<DashboardData>('/admin/all', undefined, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // System Health
  async getSystemHealth(): Promise<SystemHealth> {
    try {
      interface SystemHealthResponse {
        success: boolean;
        data: {
          uptime?: number;
          memory?: {
            heapUsed?: string;
            rss?: string;
          };
        };
      }
      
      const response = await apiClient.get<SystemHealthResponse>('/admin/system', undefined, this.getAuthHeaders());
      
      if (response.data.success && response.data.data) {
        // Transform backend response to match SystemHealth interface
        return {
          status: 'healthy',
          uptime: response.data.data.uptime || 0,
          timestamp: new Date().toISOString(),
          memory: response.data.data.memory ? {
            used: parseInt(response.data.data.memory.heapUsed?.replace(' MB', '') || '0'),
            total: parseInt(response.data.data.memory.rss?.replace(' MB', '') || '0'),
            percentage: Math.round((parseInt(response.data.data.memory.heapUsed?.replace(' MB', '') || '0') / parseInt(response.data.data.memory.rss?.replace(' MB', '') || '1')) * 100)
          } : undefined
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Analytics Data
  async getAnalyticsData(): Promise<AnalyticsData> {
    try {
      interface AnalyticsResponse {
        success: boolean;
        data: AnalyticsData;
      }
      
      const response = await apiClient.get<AnalyticsResponse>('/admin/analytics', undefined, this.getAuthHeaders());
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Refresh Data
  async refreshData(): Promise<{ success: boolean; message: string }> {
    try {
      interface RefreshResponse {
        success: boolean;
        message: string;
      }
      
      const response = await apiClient.post<RefreshResponse>('/admin/refresh', undefined, {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get System Information
  async getSystemInfo(): Promise<SystemInfo> {
    try {
      interface SystemInfoResponse {
        success: boolean;
        data: SystemInfo;
      }
      
      const response = await apiClient.get<SystemInfoResponse>('/admin/system', undefined, this.getAuthHeaders());
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Create Log Entry
  async createLog(logData: Omit<LogEntry, 'id'>): Promise<LogEntry> {
    try {
      const response = await apiClient.post<LogEntry>('/admin/logs', logData, {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update Log Entry
  async updateLog(id: string, logData: Partial<LogEntry>): Promise<LogEntry> {
    try {
      const response = await apiClient.put<LogEntry>(`/admin/logs/${id}`, logData, {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Delete Log Entry
  async deleteLog(id: string): Promise<void> {
    try {
      await apiClient.delete(`/admin/logs/${id}`, this.getAuthHeaders());
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Create System Config
  async createConfig(configData: CreateConfigRequest): Promise<ConfigEntry> {
    try {
      const response = await apiClient.post<ConfigEntry>('/admin/config', configData, {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update System Config
  async updateConfig(id: string, configData: UpdateConfigRequest): Promise<ConfigEntry> {
    try {
      const response = await apiClient.put<ConfigEntry>(`/admin/config/${id}`, configData, {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      });
      
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Delete System Config
  async deleteConfig(id: string): Promise<void> {
    try {
      await apiClient.delete(`/admin/config/${id}`, this.getAuthHeaders());
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
      
      const url = `/admin/logs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const apiResponse = await apiClient.get<LogsResponse>(url, undefined, this.getAuthHeaders());
      
      const response = apiResponse;
      
      // Transform backend response to match expected LogsResponse format
      if (response.success && response.data) {
        interface RawLogEntry {
          id?: string;
          timestamp?: string;
          level?: 'error' | 'warn' | 'info' | 'debug';
          message?: string;
          source?: string;
          meta?: Record<string, unknown>;
          stack?: string;
        }
        
        const logs = Array.isArray(response.data.logs) 
          ? response.data.logs.map((log: RawLogEntry) => ({
              id: log.id || `log-${Math.random().toString(36).substring(2, 9)}`,
              timestamp: log.timestamp || new Date().toISOString(),
              level: log.level || 'info' as const,
              message: log.message || '',
              source: log.source || 'system',
              meta: log.meta,
              stack: log.stack
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