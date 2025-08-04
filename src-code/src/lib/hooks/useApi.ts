'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';
import { ApiResponse, ProjectData, SkillData, PersonalData } from '../api/types';

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
    dependencies?: any[];
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
      const response = await apiClient.get<ApiResponse<T>>(endpoint);
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
  }, [fetchData, ...(options?.dependencies || [])]);

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
          id: '1',
          name: 'JavaScript',
          category: 'Programming Languages',
          level: 'Expert',
          yearsOfExperience: 5,
          projects: ['portfolio-site', 'react-dashboard'],
          description: 'Modern JavaScript ES6+ development',
          icon: 'javascript',
          color: '#F7DF1E'
        },
        {
          id: '2',
          name: 'TypeScript',
          category: 'Programming Languages',
          level: 'Advanced',
          yearsOfExperience: 3,
          projects: ['portfolio-site', 'api-server'],
          description: 'Type-safe JavaScript development',
          icon: 'typescript',
          color: '#3178C6'
        },
        {
          id: '3',
          name: 'React',
          category: 'Frontend Frameworks',
          level: 'Expert',
          yearsOfExperience: 4,
          projects: ['portfolio-site', 'react-dashboard'],
          description: 'Modern React with hooks and context',
          icon: 'react',
          color: '#61DAFB'
        },
        {
          id: '4',
          name: 'Next.js',
          category: 'Frontend Frameworks',
          level: 'Advanced',
          yearsOfExperience: 2,
          projects: ['portfolio-site'],
          description: 'Full-stack React framework',
          icon: 'nextjs',
          color: '#000000'
        },
        {
          id: '5',
          name: 'Node.js',
          category: 'Backend Technologies',
          level: 'Advanced',
          yearsOfExperience: 4,
          projects: ['api-server', 'webhook-handler'],
          description: 'Server-side JavaScript runtime',
          icon: 'nodejs',
          color: '#339933'
        },
        {
          id: '6',
          name: 'Python',
          category: 'Programming Languages',
          level: 'Intermediate',
          yearsOfExperience: 2,
          projects: ['data-analysis', 'automation-scripts'],
          description: 'Data analysis and automation',
          icon: 'python',
          color: '#3776AB'
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
        id: '1',
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
        story: config.story || 'Passionate developer with a love for creating innovative solutions.',
        interests: config.interests || ['Web Development', 'Open Source', 'Technology'],
        education: config.education || [],
        experience: config.experience || [],
        achievements: config.achievements || [],
        testimonials: config.testimonials || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
export const usePostData = <T, R = any>() => {
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
      const response = await apiClient.post<ApiResponse<R>>(endpoint, data);
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
export const useUpdateData = <T, R = any>() => {
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
      const response = await apiClient.put<ApiResponse<R>>(endpoint, data);
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