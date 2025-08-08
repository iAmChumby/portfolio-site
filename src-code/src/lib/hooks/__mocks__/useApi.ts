// Mock implementations for API hooks
export const useApi = () => ({
  data: null,
  loading: false,
  error: null,
});

export const useProjects = () => ({
  data: [
    {
      id: 'test-project-1',
      title: 'Test Project 1',
      description: 'Test project description',
      technologies: ['React', 'TypeScript', 'Next.js'],
      githubUrl: 'https://github.com/test/project1',
      liveUrl: 'https://project1.example.com',
      featured: true,
    },
  ],
  loading: false,
  error: null,
});

export const useSkills = () => ({
  data: [
    {
      name: 'React',
      category: 'Frontend',
      level: 'Expert',
      yearsOfExperience: 5,
    },
    {
      name: 'TypeScript',
      category: 'Language',
      level: 'Advanced',
      yearsOfExperience: 3,
    },
  ],
  loading: false,
  error: null,
});

export const usePersonalData = () => ({
  data: {
    name: 'Test Author',
    title: 'Test Developer',
    bio: 'Test bio description',
    location: 'Test City, Test Country',
    email: 'test@example.com',
    avatar: '/images/avatar.jpg',
  },
  loading: false,
  error: null,
});

export const usePostData = () => ({
  mutate: jest.fn(),
  loading: false,
  error: null,
});

export const useUpdateData = () => ({
  mutate: jest.fn(),
  loading: false,
  error: null,
});

export const useDeleteData = () => ({
  mutate: jest.fn(),
  loading: false,
  error: null,
});