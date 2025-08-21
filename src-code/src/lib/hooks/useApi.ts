'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';
import { ProjectData, SkillData, PersonalData } from '@/lib/api/types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Generic hook for API calls
export const useApi = <T>(
  endpoint: string,
  options?: {
    immediate?: boolean;
    dependencies?: unknown[];
  }
): UseApiState<T> => {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: options?.immediate !== false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiClient.get<T>(endpoint);
      setState({ 
        data: response.data, 
        loading: false, 
        error: null 
      });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch data' 
      });
    }
  }, [endpoint]);

  useEffect(() => {
    if (options?.immediate !== false) {
      fetchData();
    }
  }, [fetchData, options?.immediate, options?.dependencies]);

  return {
    ...state,
    refetch: fetchData,
  };
};

// Hook for fetching projects data
export const useProjects = (): UseApiState<ProjectData[]> => {
  const [state, setState] = useState<{
    data: ProjectData[] | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchProjects = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // For now, use local JSON data
      const response = await fetch('/data/projects.json');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const projects = await response.json();
      setState({ data: projects, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch projects' 
      });
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    ...state,
    refetch: fetchProjects,
  };
};

// Hook for fetching skills data
export const useSkills = (): UseApiState<SkillData[]> => {
  const [state, setState] = useState<{
    data: SkillData[] | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchSkills = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Mock skills data for now
      const mockSkills: SkillData[] = [
        {
          name: 'JavaScript',
          category: 'language',
          proficiency: 5,
          yearsOfExperience: 5,
          lastUsed: '2024-01-01',
          projectCount: 10,
          linesOfCode: 50000,
          repositories: ['portfolio-site', 'react-dashboard']
        },
        {
          name: 'TypeScript',
          category: 'language',
          proficiency: 4,
          yearsOfExperience: 3,
          lastUsed: '2024-01-01',
          projectCount: 8,
          linesOfCode: 30000,
          repositories: ['portfolio-site', 'api-server']
        },
        {
          name: 'React',
          category: 'framework',
          proficiency: 5,
          yearsOfExperience: 4,
          lastUsed: '2024-01-01',
          projectCount: 12,
          linesOfCode: 40000,
          repositories: ['portfolio-site', 'react-dashboard']
        },
        {
          name: 'Next.js',
          category: 'framework',
          proficiency: 4,
          yearsOfExperience: 2,
          lastUsed: '2024-01-01',
          projectCount: 5,
          linesOfCode: 20000,
          repositories: ['portfolio-site']
        },
        {
          name: 'Node.js',
          category: 'framework',
          proficiency: 4,
          yearsOfExperience: 4,
          lastUsed: '2024-01-01',
          projectCount: 8,
          linesOfCode: 25000,
          repositories: ['api-server', 'webhook-handler']
        },
        {
          name: 'Python',
          category: 'language',
          proficiency: 3,
          yearsOfExperience: 2,
          lastUsed: '2023-12-01',
          projectCount: 4,
          linesOfCode: 15000,
          repositories: ['data-analysis', 'automation-scripts']
        }
      ];

      setState({ data: mockSkills, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch skills' 
      });
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return {
    ...state,
    refetch: fetchSkills,
  };
};

// Hook for personal data
export const usePersonalData = () => {
  const [state, setState] = useState<{
    data: PersonalData | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (): Promise<void> => {
    setState({ data: null, loading: true, error: null });

    try {
      const response = await apiClient.get<PersonalData>('/api/personal');
      setState({ data: response.data, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null,
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch personal data'
      });
    }
  }, []);

  return {
    ...state,
    execute,
  };
};

// Hook for posting data
export const usePostData = <T, R = unknown>(endpoint: string) => {
  const [state, setState] = useState<{
    data: R | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (data: T): Promise<void> => {
    if (!endpoint) {
      setState(prev => ({ ...prev, error: 'Endpoint is required' }));
      return;
    }

    setState({ data: null, loading: true, error: null });

    try {
      const response = await apiClient.post<R>(endpoint, data);
      setState({ data: response.data, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null,
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to post data'
      });
    }
  }, [endpoint]);

  return {
    ...state,
    execute,
  };
};

// Hook for updating data
export const useUpdateData = <T, R = unknown>(endpoint: string) => {
  const [state, setState] = useState<{
    data: R | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (data: T): Promise<void> => {
    if (!endpoint) {
      setState(prev => ({ ...prev, error: 'Endpoint is required' }));
      return;
    }

    setState({ data: null, loading: true, error: null });

    try {
      const response = await apiClient.put<R>(endpoint, data);
      setState({ data: response.data, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null,
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to update data'
      });
    }
  }, [endpoint]);

  return {
    ...state,
    execute,
  };
};

// Hook for deleting data
export const useDeleteData = (endpoint: string) => {
  const [state, setState] = useState<{
    data: boolean | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (): Promise<void> => {
    if (!endpoint) {
      setState(prev => ({ ...prev, error: 'Endpoint is required' }));
      return;
    }

    setState({ data: null, loading: true, error: null });

    try {
      await apiClient.delete(endpoint);
      setState({ data: true, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null,
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to delete data'
      });
    }
  }, [endpoint]);

  return {
    ...state,
    execute,
  };
};