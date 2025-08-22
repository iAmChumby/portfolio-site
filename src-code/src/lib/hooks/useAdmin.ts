'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  adminApi,
  DashboardData,
  SystemHealth,
  AnalyticsData,
  LogsResponse,
  SystemInfo,
} from '../api/admin';

// Admin authentication hook
export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticate = useCallback(async (adminKey: string): Promise<boolean> => {
    if (!adminKey.trim()) {
      setError('Please enter the admin key');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await adminApi.authenticate(adminKey);
      if (response.success) {
        setIsAuthenticated(true);
        return true;
      } else {
        setError(response.message || 'Authentication failed');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    adminApi.clearAdminKey();
    setIsAuthenticated(false);
    setError(null);
  }, []);

  // Check if already authenticated on mount
  useEffect(() => {
    setIsAuthenticated(adminApi.isAuthenticated());
  }, []);

  return {
    isAuthenticated,
    loading,
    error,
    authenticate,
    logout,
  };
};

// Dashboard data hook
export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const dashboardData = await adminApi.getDashboardData();
      setData(dashboardData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      await adminApi.refreshData();
      await fetchData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    fetchData,
    refresh,
  };
};

// System health hook
export const useSystemHealth = () => {
  const [data, setData] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const healthData = await adminApi.getSystemHealth();
      setData(healthData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load system health';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchData,
  };
};

// Analytics data hook
export const useAnalyticsData = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const analyticsData = await adminApi.getAnalyticsData();
      setData(analyticsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchData,
  };
};

// System info hook
export const useSystemInfo = () => {
  const [data, setData] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const systemInfo = await adminApi.getSystemInfo();
      setData(systemInfo);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load system info';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchData,
  };
};

// Logs hook with pagination and filtering
export const useLogs = (options?: {
  page?: number;
  limit?: number;
  level?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}) => {
  const [data, setData] = useState<LogsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentPage = options?.page || 1;

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        limit: options?.limit || 50,
        level: options?.level,
        search: options?.search,
        dateFrom: options?.startDate,
        dateTo: options?.endDate,
      };
      
      const logsData = await adminApi.getLogs(params);
      setData(logsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load logs';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [options]);

  const refreshLogs = useCallback(async () => {
    await loadLogs();
  }, [loadLogs]);

  // Extract logs array and pagination info from data
  const logs = data?.logs || [];
  const totalPages = data?.pagination?.totalPages || 1;

  return {
    logs,
    loading,
    error,
    totalPages,
    currentPage,
    loadLogs,
    refreshLogs,
  };
};

// Combined admin dashboard hook that loads all data
export const useAdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const allData = await adminApi.loadAllDashboardData();
      setDashboardData(allData.dashboardData);
      setSystemHealth(allData.systemHealth);
      setAnalyticsData(allData.analyticsData);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      await adminApi.refreshData();
      await loadAllData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadAllData]);

  return {
    dashboardData,
    systemHealth,
    analyticsData,
    loading,
    error,
    lastUpdated,
    loadAllData,
    refreshData,
  };
};

// Auto-refresh hook for real-time updates
export const useAutoRefresh = (
  callback: () => Promise<void>,
  interval: number = 30000, // 30 seconds default
  enabled: boolean = true
) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await callback();
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Auto-refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [callback, isRefreshing]);

  useEffect(() => {
    if (!enabled) return;

    const intervalId = setInterval(refresh, interval);
    return () => clearInterval(intervalId);
  }, [refresh, interval, enabled]);

  return {
    isRefreshing,
    lastRefresh,
    refresh,
  };
};

// Error boundary hook for admin components
export const useAdminErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: unknown) => {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    setError(errorMessage);
    console.error('Admin error:', err);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
};