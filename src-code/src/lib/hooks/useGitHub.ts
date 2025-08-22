'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  GitHubRepository, 
  GitHubUser, 
  GitHubActivity,
  GitHubWorkflowRun,
  GetRepositoriesParams 
} from '../api/types';
import { githubApi, processLanguageStats, getActivitySummary } from '../api/github';

interface UseGitHubState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Hook for fetching GitHub user data
export const useGitHubUser = (username: string): UseGitHubState<GitHubUser> => {
  const [state, setState] = useState<{
    data: GitHubUser | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchUser = useCallback(async () => {
    if (!username) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const userData = await githubApi.getUser(username);
      setState({ data: userData, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch user data' 
      });
    }
  }, [username]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    ...state,
    refetch: fetchUser,
  };
};

// Hook for fetching user repositories
export const useGitHubRepositories = (
  username: string,
  params?: GetRepositoriesParams
): UseGitHubState<GitHubRepository[]> => {
  const [state, setState] = useState<{
    data: GitHubRepository[] | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRepositories = useCallback(async () => {
    if (!username) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const repositories = await githubApi.getUserRepositories(username, params);
      setState({ data: repositories, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch repositories' 
      });
    }
  }, [username, params]);

  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);

  return {
    ...state,
    refetch: fetchRepositories,
  };
};

// Hook for fetching featured repositories
export const useFeaturedRepositories = (
  username: string,
  limit = 6
): UseGitHubState<GitHubRepository[]> => {
  const [state, setState] = useState<{
    data: GitHubRepository[] | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchFeatured = useCallback(async () => {
    if (!username) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const featured = await githubApi.getFeaturedRepositories(username, limit);
      setState({ data: featured, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch featured repositories' 
      });
    }
  }, [username, limit]);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return {
    ...state,
    refetch: fetchFeatured,
  };
};

// Hook for fetching user activity
export const useGitHubActivity = (
  username: string,
  limit = 30
): UseGitHubState<GitHubActivity[]> => {
  const [state, setState] = useState<{
    data: GitHubActivity[] | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchActivity = useCallback(async () => {
    if (!username) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const activity = await githubApi.getUserActivity(username, 1, limit);
      setState({ data: activity, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch activity' 
      });
    }
  }, [username, limit]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  return {
    ...state,
    refetch: fetchActivity,
  };
};

// Hook for fetching user languages
export const useGitHubLanguages = (username: string) => {
  const [state, setState] = useState<{
    data: Array<{ language: string; bytes: number; percentage: number }> | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchLanguages = useCallback(async () => {
    if (!username) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const languages = await githubApi.getUserLanguages(username);
      const processed = processLanguageStats(languages);
      setState({ data: processed, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch languages' 
      });
    }
  }, [username]);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  return {
    ...state,
    refetch: fetchLanguages,
  };
};

// Hook for fetching user workflow runs
export const useGitHubWorkflowRuns = (
  username: string,
  limit = 10
): UseGitHubState<GitHubWorkflowRun[]> => {
  const [state, setState] = useState<{
    data: GitHubWorkflowRun[] | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchWorkflowRuns = useCallback(async () => {
    if (!username) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const workflowRuns = await githubApi.getUserWorkflowRuns(username, limit);
      setState({ data: workflowRuns, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch workflow runs' 
      });
    }
  }, [username, limit]);

  useEffect(() => {
    fetchWorkflowRuns();
  }, [fetchWorkflowRuns]);

  return {
    ...state,
    refetch: fetchWorkflowRuns,
  };
};

// Hook for activity summary
export const useGitHubActivitySummary = (username: string) => {
  const { data: activity, loading, error, refetch } = useGitHubActivity(username, 100);
  
  const summary = activity ? getActivitySummary(activity) : null;

  return {
    data: summary,
    loading,
    error,
    refetch,
  };
};

// Combined hook for dashboard data
export const useGitHubDashboard = (username: string) => {
  const user = useGitHubUser(username);
  const repositories = useGitHubRepositories(username, { 
    type: 'owner', 
    sort: 'updated',
    limit: 100 
  });
  const featured = useFeaturedRepositories(username, 6);
  const activity = useGitHubActivity(username, 50);
  const languages = useGitHubLanguages(username);
  const workflowRuns = useGitHubWorkflowRuns(username, 10);

  const loading = user.loading || repositories.loading || featured.loading || 
                  activity.loading || languages.loading || workflowRuns.loading;
  
  const error = user.error || repositories.error || featured.error || 
                activity.error || languages.error || workflowRuns.error;

  const refetchAll = useCallback(async () => {
    await Promise.all([
      user.refetch(),
      repositories.refetch(),
      featured.refetch(),
      activity.refetch(),
      languages.refetch(),
      workflowRuns.refetch(),
    ]);
  }, [user, repositories, featured, activity, languages, workflowRuns]);

  return {
    user: user.data,
    repositories: repositories.data,
    featured: featured.data,
    activity: activity.data,
    languages: languages.data,
    workflowRuns: workflowRuns.data,
    loading,
    error,
    refetch: refetchAll,
  };
};

// Utility hook for repository statistics
export const useRepositoryStats = (owner: string, repo: string) => {
  const [state, setState] = useState<{
    data: {
      stars: number;
      forks: number;
      issues: number;
      watchers: number;
      language: string | null;
      topics: string[];
      created: string;
      updated: string;
      pushed: string | null;
    } | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchStats = useCallback(async () => {
    if (!owner || !repo) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const stats = await githubApi.getRepositoryStats(owner, repo);
      setState({ data: stats, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch repository stats' 
      });
    }
  }, [owner, repo]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    ...state,
    refetch: fetchStats,
  };
};