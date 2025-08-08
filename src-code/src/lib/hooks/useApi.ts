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

// Hook for fetching personal data
export const usePersonalData = (): UseApiState<PersonalData> => {
  const [state, setState] = useState<{
    data: PersonalData | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchPersonalData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // For now, use local site config
      const response = await fetch('/data/site-config.json');
      if (!response.ok) {
        throw new Error('Failed to fetch personal data');
      }
      const config = await response.json();
      
      const personalData: PersonalData = {
        name: config.name,
        title: config.title,
        bio: config.bio,
        location: config.location,
        email: config.email,
        phone: config.phone,
        website: config.website,
        avatar: config.avatar,
        resume: config.resume,
        social: config.social,
        story: {
          introduction: config.story?.introduction || 'Passionate developer with a love for creating innovative solutions.',
          journey: config.story?.journey || ['Started coding', 'Learned web development', 'Built amazing projects'],
          currentFocus: config.story?.currentFocus || 'Building modern web applications',
          goals: config.story?.goals || ['Master new technologies', 'Contribute to open source', 'Build impactful products']
        },
        experience: config.experience || [],
        education: config.education || []
      };

      setState({ data: personalData, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch personal data' 
      });
    }
  }, []);

  useEffect(() => {
    fetchPersonalData();
  }, [fetchPersonalData]);

  return {
    ...state,
    refetch: fetchPersonalData,
  };
};

// Hook for posting data
export const usePostData = <T, R = unknown>() => {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    success: boolean;
  }>({
    loading: false,
    error: null,
    success: false,
  });

  const postData = useCallback(async (endpoint: string, data: T): Promise<R | null> => {
    setState({ loading: true, error: null, success: false });

    try {
      const response = await apiClient.post<R>(endpoint, data);
      setState({ loading: false, error: null, success: true });
      return response.data;
    } catch (error) {
      setState({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to post data',
        success: false 
      });
      return null;
    }
  }, []);

  return {
    ...state,
    postData,
  };
};

// Hook for updating data
export const useUpdateData = <T, R = unknown>() => {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    success: boolean;
  }>({
    loading: false,
    error: null,
    success: false,
  });

  const updateData = useCallback(async (endpoint: string, data: T): Promise<R | null> => {
    setState({ loading: true, error: null, success: false });

    try {
      const response = await apiClient.put<R>(endpoint, data);
      setState({ loading: false, error: null, success: true });
      return response.data;
    } catch (error) {
      setState({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to update data',
        success: false 
      });
      return null;
    }
  }, []);

  return {
    ...state,
    updateData,
  };
};

// Hook for deleting data
export const useDeleteData = () => {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    success: boolean;
  }>({
    loading: false,
    error: null,
    success: false,
  });

  const deleteData = useCallback(async (endpoint: string): Promise<boolean> => {
    setState({ loading: true, error: null, success: false });

    try {
      await apiClient.delete(endpoint);
      setState({ loading: false, error: null, success: true });
      return true;
    } catch (error) {
      setState({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to delete data',
        success: false 
      });
      return false;
    }
  }, []);

  return {
    ...state,
    deleteData,
  };
};