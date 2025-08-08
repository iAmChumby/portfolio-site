// Mock implementations for GitHub hooks
export const useGitHubUser = () => ({
  data: {
    login: 'testuser',
    name: 'Test User',
    bio: 'Test bio',
    public_repos: 10,
    followers: 50,
    following: 25,
    avatar_url: 'https://github.com/testuser.png',
  },
  loading: false,
  error: null,
});

export const useGitHubRepositories = () => ({
  data: [
    {
      id: 1,
      name: 'test-repo',
      description: 'Test repository',
      language: 'TypeScript',
      stargazers_count: 5,
      forks_count: 2,
      topics: ['vue', 'typescript'],
      html_url: 'https://github.com/testuser/test-repo',
      homepage: 'https://test-repo.com',
    },
  ],
  loading: false,
  error: null,
});

export const useFeaturedRepositories = () => ({
  data: [
    {
      id: 1,
      name: 'featured-repo',
      description: 'Featured test repository',
      language: 'TypeScript',
      stargazers_count: 10,
      forks_count: 3,
      topics: ['vue', 'nuxt'],
      html_url: 'https://github.com/testuser/featured-repo',
      homepage: null,
    },
  ],
  loading: false,
  error: null,
});

export const useGitHubActivity = () => ({
  data: [
    {
      id: '1',
      type: 'PushEvent',
      repo: { name: 'testuser/test-repo' },
      created_at: '2024-01-01T00:00:00Z',
      payload: {
        commits: [{ message: 'Test commit' }],
      },
    },
  ],
  loading: false,
  error: null,
});

export const useGitHubLanguages = () => ({
  data: {
    TypeScript: 5000,
    JavaScript: 3000,
    Python: 2000,
  },
  loading: false,
  error: null,
});

export const useGitHubActivitySummary = () => ({
  data: {
    totalCommits: 100,
    totalPushes: 50,
    totalPRs: 25,
    recentActivity: [],
  },
  loading: false,
  error: null,
});

export const useGitHubDashboard = () => ({
  user: useGitHubUser(),
  repositories: useGitHubRepositories(),
  activity: useGitHubActivity(),
  languages: useGitHubLanguages(),
  loading: false,
  error: null,
});

export const useRepositoryStats = () => ({
  data: {
    totalStars: 50,
    totalForks: 20,
    totalRepos: 10,
    languageStats: {
      TypeScript: 50,
      JavaScript: 30,
      Python: 20,
    },
  },
  loading: false,
  error: null,
});