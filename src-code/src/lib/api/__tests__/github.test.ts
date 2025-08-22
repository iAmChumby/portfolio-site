import {
  GitHubApi,
  githubApi,
  processLanguageStats,
  getActivitySummary,
} from '../github';
import { githubApi as githubApi2 } from '../github';
import {
  GitHubUser,
  GitHubRepository,
  GitHubActivity,
  GitHubWorkflowRun,
  GitHubWorkflowRunsResponse,
  GitHubLanguages,
  GetRepositoriesParams,
} from '../types';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

// Mock Response type for testing
type MockResponse = {
  ok: boolean;
  status?: number;
  statusText?: string;
  json: jest.MockedFunction<() => Promise<unknown>>;
};

// Mock console methods
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();

// Mock setTimeout for rate limiting tests
jest.useFakeTimers();

// Mock data
const mockUser: GitHubUser = {
  id: 1,
  node_id: 'U_1',
  login: 'testuser',
  name: 'Test User',
  email: 'test@example.com',
  avatar_url: 'https://github.com/avatar.jpg',
  gravatar_id: '',
  url: 'https://api.github.com/users/testuser',
  html_url: 'https://github.com/testuser',
  followers_url: 'https://api.github.com/users/testuser/followers',
  following_url: 'https://api.github.com/users/testuser/following{/other_user}',
  gists_url: 'https://api.github.com/users/testuser/gists{/gist_id}',
  starred_url: 'https://api.github.com/users/testuser/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/testuser/subscriptions',
  organizations_url: 'https://api.github.com/users/testuser/orgs',
  repos_url: 'https://api.github.com/users/testuser/repos',
  events_url: 'https://api.github.com/users/testuser/events{/privacy}',
  received_events_url: 'https://api.github.com/users/testuser/received_events',
  type: 'User',
  site_admin: false,
  bio: 'Test bio',
  blog: 'https://testuser.dev',
  company: 'Test Company',
  location: 'Test City',
  hireable: true,
  twitter_username: 'testuser',
  public_repos: 10,
  public_gists: 5,
  followers: 100,
  following: 50,
  created_at: '2020-01-01T00:00:00Z',
  updated_at: '2023-06-01T00:00:00Z',
};

const mockRepository: GitHubRepository = {
  id: 1,
  node_id: 'R_1',
  name: 'test-repo',
  full_name: 'testuser/test-repo',
  owner: mockUser,
  private: false,
  html_url: 'https://github.com/testuser/test-repo',
  description: 'Test repository',
  fork: false,
  url: 'https://api.github.com/repos/testuser/test-repo',
  clone_url: 'https://github.com/testuser/test-repo.git',
  git_url: 'git://github.com/testuser/test-repo.git',
  ssh_url: 'git@github.com:testuser/test-repo.git',
  svn_url: 'https://github.com/testuser/test-repo',
  mirror_url: null,
  homepage: null,
  language: 'TypeScript',
  forks_count: 5,
  stargazers_count: 10,
  watchers_count: 8,
  size: 1000,
  default_branch: 'main',
  open_issues_count: 2,
  topics: ['test', 'typescript'],
  has_issues: true,
  has_projects: true,
  has_wiki: true,
  has_pages: false,
  has_downloads: true,
  archived: false,
  disabled: false,
  visibility: 'public',
  pushed_at: '2023-06-01T00:00:00Z',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-06-01T00:00:00Z',
  archive_url: 'https://api.github.com/repos/testuser/test-repo/{archive_format}{/ref}',
  assignees_url: 'https://api.github.com/repos/testuser/test-repo/assignees{/user}',
  blobs_url: 'https://api.github.com/repos/testuser/test-repo/git/blobs{/sha}',
  branches_url: 'https://api.github.com/repos/testuser/test-repo/branches{/branch}',
  collaborators_url: 'https://api.github.com/repos/testuser/test-repo/collaborators{/collaborator}',
  comments_url: 'https://api.github.com/repos/testuser/test-repo/comments{/number}',
  commits_url: 'https://api.github.com/repos/testuser/test-repo/commits{/sha}',
  compare_url: 'https://api.github.com/repos/testuser/test-repo/compare/{base}...{head}',
  contents_url: 'https://api.github.com/repos/testuser/test-repo/contents/{+path}',
  contributors_url: 'https://api.github.com/repos/testuser/test-repo/contributors',
  deployments_url: 'https://api.github.com/repos/testuser/test-repo/deployments',
  downloads_url: 'https://api.github.com/repos/testuser/test-repo/downloads',
  events_url: 'https://api.github.com/repos/testuser/test-repo/events',
  forks_url: 'https://api.github.com/repos/testuser/test-repo/forks',
  git_commits_url: 'https://api.github.com/repos/testuser/test-repo/git/commits{/sha}',
  git_refs_url: 'https://api.github.com/repos/testuser/test-repo/git/refs{/sha}',
  git_tags_url: 'https://api.github.com/repos/testuser/test-repo/git/tags{/sha}',
  hooks_url: 'https://api.github.com/repos/testuser/test-repo/hooks',
  issue_comment_url: 'https://api.github.com/repos/testuser/test-repo/issues/comments{/number}',
  issue_events_url: 'https://api.github.com/repos/testuser/test-repo/issues/events{/number}',
  issues_url: 'https://api.github.com/repos/testuser/test-repo/issues{/number}',
  keys_url: 'https://api.github.com/repos/testuser/test-repo/keys{/key_id}',
  labels_url: 'https://api.github.com/repos/testuser/test-repo/labels{/name}',
  languages_url: 'https://api.github.com/repos/testuser/test-repo/languages',
  merges_url: 'https://api.github.com/repos/testuser/test-repo/merges',
  milestones_url: 'https://api.github.com/repos/testuser/test-repo/milestones{/number}',
  notifications_url: 'https://api.github.com/repos/testuser/test-repo/notifications{?since,all,participating}',
  pulls_url: 'https://api.github.com/repos/testuser/test-repo/pulls{/number}',
  releases_url: 'https://api.github.com/repos/testuser/test-repo/releases{/id}',
  stargazers_url: 'https://api.github.com/repos/testuser/test-repo/stargazers',
  statuses_url: 'https://api.github.com/repos/testuser/test-repo/statuses/{sha}',
  subscribers_url: 'https://api.github.com/repos/testuser/test-repo/subscribers',
  subscription_url: 'https://api.github.com/repos/testuser/test-repo/subscription',
  tags_url: 'https://api.github.com/repos/testuser/test-repo/tags',
  teams_url: 'https://api.github.com/repos/testuser/test-repo/teams',
  trees_url: 'https://api.github.com/repos/testuser/test-repo/git/trees{/sha}',
};

const mockActivity: GitHubActivity = {
  id: '1',
  type: 'PushEvent',
  actor: {
    id: 1,
    login: 'testuser',
    display_login: 'testuser',
    gravatar_id: '',
    url: 'https://api.github.com/users/testuser',
    avatar_url: 'https://github.com/avatar.jpg',
  },
  repo: {
    id: 1,
    name: 'testuser/test-repo',
    url: 'https://api.github.com/repos/testuser/test-repo',
  },
  payload: {
    push_id: 123,
    size: 1,
    distinct_size: 1,
    ref: 'refs/heads/main',
    head: 'abc123',
    before: 'def456',
    commits: [{
      sha: 'abc123',
      author: {
        email: 'test@example.com',
        name: 'Test User',
      },
      message: 'Test commit',
      distinct: true,
      url: 'https://api.github.com/repos/testuser/test-repo/commits/abc123',
    }],
  },
  public: true,
  created_at: '2023-06-01T00:00:00Z',
};

const mockWorkflowRun: GitHubWorkflowRun = {
  id: 1,
  name: 'CI',
  head_branch: 'main',
  head_sha: 'abc123',
  path: '.github/workflows/ci.yml',
  display_title: 'CI Workflow',
  run_number: 1,
  event: 'push',
  status: 'completed',
  conclusion: 'success',
  workflow_id: 1,
  check_suite_id: 1,
  check_suite_node_id: 'CS_1',
  url: 'https://api.github.com/repos/testuser/test-repo/actions/runs/1',
  html_url: 'https://github.com/testuser/test-repo/actions/runs/1',
  pull_requests: [],
  created_at: '2023-06-01T00:00:00Z',
  updated_at: '2023-06-01T00:00:00Z',
  actor: {
    login: 'testuser',
    id: 1,
    avatar_url: 'https://github.com/images/error/testuser_happy.gif',
    html_url: 'https://github.com/testuser',
  },
  run_attempt: 1,
  referenced_workflows: [],
  run_started_at: '2023-06-01T00:00:00Z',
  triggering_actor: {
    login: 'testuser',
    id: 1,
    avatar_url: 'https://github.com/images/error/testuser_happy.gif',
    html_url: 'https://github.com/testuser',
  },
  jobs_url: 'https://api.github.com/repos/testuser/test-repo/actions/runs/1/jobs',
  logs_url: 'https://api.github.com/repos/testuser/test-repo/actions/runs/1/logs',
  check_suite_url: 'https://api.github.com/repos/testuser/test-repo/check-suites/1',
  artifacts_url: 'https://api.github.com/repos/testuser/test-repo/actions/runs/1/artifacts',
  cancel_url: 'https://api.github.com/repos/testuser/test-repo/actions/runs/1/cancel',
  rerun_url: 'https://api.github.com/repos/testuser/test-repo/actions/runs/1/rerun',
  previous_attempt_url: null,
  workflow_url: 'https://api.github.com/repos/testuser/test-repo/actions/workflows/1',
  head_commit: {
    id: 'abc123',
    tree_id: 'tree123',
    message: 'Test commit',
    timestamp: '2023-06-01T00:00:00Z',
    author: {
      name: 'Test User',
      email: 'test@example.com',
    },
    committer: {
      name: 'Test User',
      email: 'test@example.com',
    },
  },
  repository: mockRepository,
  head_repository: mockRepository,
};

const mockLanguages: GitHubLanguages = {
  TypeScript: 5000,
  JavaScript: 3000,
  CSS: 2000,
};

describe('GitHubApi', () => {
  let api: GitHubApi;

  beforeEach(() => {
    api = new GitHubApi();
    jest.clearAllMocks();
    jest.clearAllTimers();
    mockConsoleError.mockClear();
    mockConsoleWarn.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.clearAllMocks();
    // Don't clear console mocks as tests need to check them
    // mockConsoleError.mockClear();
    // mockConsoleWarn.mockClear();
  });

  describe('makeRequest', () => {
    it('should make successful API request', async () => {
      const mockResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockUser),
      };
      mockFetch.mockResolvedValue(mockResponse as unknown as Response);

      const result = await api.getUser('testuser');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Portfolio-Site/1.0',
          }),
        })
      );
      expect(result).toEqual(mockUser);
    });

    it('should include authorization header when token is available', async () => {
      const originalToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
      process.env.NEXT_PUBLIC_GITHUB_TOKEN = 'test-token';
      
      // Create a new instance after setting the environment variable
      const apiWithToken = new GitHubApi();
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUser),
      } as unknown as Response);

      await apiWithToken.getUser('testuser');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'token test-token',
          }),
        })
      );
      
      // Restore original token
      process.env.NEXT_PUBLIC_GITHUB_TOKEN = originalToken;
    });

    it('should handle API errors with JSON response', async () => {
      const errorData = {
        message: 'Not Found',
        documentation_url: 'https://docs.github.com/rest',
      };
      const mockResponse: MockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: jest.fn().mockResolvedValue(errorData),
      };
      mockFetch.mockResolvedValue(mockResponse as unknown as Response);

      await expect(api.getUser('nonexistent')).rejects.toThrow('Not Found');
      expect(mockConsoleError).toHaveBeenCalled();
    });

    it('should handle API errors without JSON response', async () => {
      const mockResponse: MockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      };
      mockFetch.mockResolvedValue(mockResponse as unknown as Response);

      await expect(api.getUser('testuser')).rejects.toThrow(
        'GitHub API error: 500 Internal Server Error'
      );
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(api.getUser('testuser')).rejects.toThrow('Network error');
      expect(mockConsoleError).toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('should fetch user data', async () => {
      const mockResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockUser),
      };
      mockFetch.mockResolvedValue(mockResponse as unknown as Response);

      const result = await api.getUser('testuser');

      expect(result).toEqual(mockUser);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser',
        expect.any(Object)
      );
    });
  });

  describe('getUserRepositories', () => {
    it('should fetch user repositories without parameters', async () => {
      const repositories = [mockRepository];
      const mockResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(repositories),
      };
      mockFetch.mockResolvedValue(mockResponse as unknown as Response);

      const result = await api.getUserRepositories('testuser');

      expect(result).toEqual(repositories);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser/repos',
        expect.any(Object)
      );
    });

    it('should fetch user repositories with parameters', async () => {
      const repositories = [mockRepository];
      const params: GetRepositoriesParams = {
        type: 'owner',
        sort: 'updated',
        direction: 'desc',
        page: 2,
        limit: 50,
      };
      const mockResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(repositories),
      };
      mockFetch.mockResolvedValue(mockResponse as unknown as Response);

      const result = await api.getUserRepositories('testuser', params);

      expect(result).toEqual(repositories);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('type=owner&sort=updated&direction=desc&page=2&per_page=50'),
        expect.any(Object)
      );
    });

    it('should limit per_page to 100', async () => {
      const repositories = [mockRepository];
      const params: GetRepositoriesParams = { limit: 200 };
      const mockResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(repositories),
      };
      mockFetch.mockResolvedValue(mockResponse as unknown as Response);

      await api.getUserRepositories('testuser', params);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('per_page=100'),
        expect.any(Object)
      );
    });
  });

  describe('getRepositoryLanguages', () => {
    it('should fetch repository languages', async () => {
      const mockResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockLanguages),
      };
      mockFetch.mockResolvedValue(mockResponse as unknown as Response);

      const result = await api.getRepositoryLanguages('testuser', 'test-repo');

      expect(result).toEqual(mockLanguages);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/testuser/test-repo/languages',
        expect.any(Object)
      );
    });
  });

  describe('getRepository', () => {
    it('should fetch repository details', async () => {
      const mockResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockRepository),
      };
      mockFetch.mockResolvedValue(mockResponse as unknown as Response);

      const result = await api.getRepository('testuser', 'test-repo');

      expect(result).toEqual(mockRepository);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/testuser/test-repo',
        expect.any(Object)
      );
    });
  });

  describe('getUserActivity', () => {
    it('should fetch user activity with default parameters', async () => {
      const activity = [mockActivity];
      const mockResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(activity),
      };
      mockFetch.mockResolvedValue(mockResponse as unknown as Response);

      const result = await api.getUserActivity('testuser');

      expect(result).toEqual(activity);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser/events/public?page=1&per_page=30',
        expect.any(Object)
      );
    });

    it('should fetch user activity with custom parameters', async () => {
      const activity = [mockActivity];
      const mockResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(activity),
      };
      mockFetch.mockResolvedValue(mockResponse as unknown as Response);

      const result = await api.getUserActivity('testuser', 2, 50);

      expect(result).toEqual(activity);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser/events/public?page=2&per_page=50',
        expect.any(Object)
      );
    });

    it('should limit per_page to 100', async () => {
      const activity = [mockActivity];
      const mockResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(activity),
      };
      mockFetch.mockResolvedValue(mockResponse as unknown as Response);

      await api.getUserActivity('testuser', 1, 200);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('per_page=100'),
        expect.any(Object)
      );
    });
  });

  describe('getUserLanguages', () => {
    it('should aggregate languages from user repositories', async () => {
      const repositories = [
        { ...mockRepository, name: 'repo1', language: 'TypeScript' },
        { ...mockRepository, name: 'repo2', language: 'JavaScript' },
      ];
      const languages1 = { TypeScript: 5000, CSS: 1000 };
      const languages2 = { JavaScript: 3000, CSS: 500 };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue(repositories),
        } as unknown as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue(languages1),
        } as unknown as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue(languages2),
        } as unknown as Response);

      const result = await api.getUserLanguages('testuser');

      expect(result).toEqual({
        TypeScript: 5000,
        JavaScript: 3000,
        CSS: 1500,
      });
    });

    it('should handle repositories without languages', async () => {
      const repositories = [
        { ...mockRepository, name: 'repo1', language: 'TypeScript' },
        { ...mockRepository, name: 'repo2', language: null },
      ];
      const languages1 = { TypeScript: 5000 };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue(repositories),
        } as unknown as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue(languages1),
        } as unknown as Response);

      const result = await api.getUserLanguages('testuser');

      expect(result).toEqual({ TypeScript: 5000 });
      expect(mockFetch).toHaveBeenCalledTimes(2); // Only called for repo with language
    });

    it('should handle errors when fetching individual repository languages', async () => {
      const repositories = [
        { ...mockRepository, name: 'repo1', language: 'TypeScript' },
        { ...mockRepository, name: 'repo2', language: 'JavaScript' },
      ];
      const languages1 = { TypeScript: 5000 };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue(repositories),
        } as unknown as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue(languages1),
        } as unknown as Response)
        .mockRejectedValueOnce(new Error('Repo not found'));

      const result = await api.getUserLanguages('testuser');

      expect(result).toEqual({ TypeScript: 5000 });
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('Failed to get languages for repo2'),
        expect.any(Error)
      );
    });

    it('should handle errors when fetching repositories', async () => {
      mockFetch.mockRejectedValue(new Error('User not found'));

      const result = await api.getUserLanguages('testuser');

      expect(result).toEqual({});
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Failed to get user languages:',
        expect.any(Error)
      );
    });

    it('should process repositories in batches with delays', async () => {
      // Create 15 repositories to test batching (batch size is 10)
      const repositories = Array.from({ length: 15 }, (_, i) => ({
        ...mockRepository,
        name: `repo${i + 1}`,
        language: 'TypeScript',
      }));

      // Mock repository list response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(repositories),
      } as unknown as Response);

      // Mock language responses for each repository
      repositories.forEach(() => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ TypeScript: 1000 }),
        } as unknown as Response);
      });

      // Start the async operation
      const resultPromise = api.getUserLanguages('testuser');

      // Use real timers for this test to avoid timing issues
      jest.useRealTimers();
      
      const result = await resultPromise;
      
      // Restore fake timers
      jest.useFakeTimers();

      expect(result).toEqual({ TypeScript: 15000 });
      expect(mockFetch).toHaveBeenCalledTimes(16); // 1 for repos + 15 for languages
    }, 10000);
  });

  describe('getFeaturedRepositories', () => {
    it('should return featured repositories sorted by stars and updates', async () => {
      const repositories = [
        { ...mockRepository, name: 'repo1', stargazers_count: 5, fork: false, archived: false },
        { ...mockRepository, name: 'repo2', stargazers_count: 10, fork: false, archived: false },
        { ...mockRepository, name: 'repo3', stargazers_count: 3, fork: true, archived: false }, // Fork - should be filtered
        { ...mockRepository, name: 'repo4', stargazers_count: 8, fork: false, archived: true }, // Archived - should be filtered
        { ...mockRepository, name: 'repo5', stargazers_count: 7, fork: false, archived: false },
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(repositories),
      } as unknown as Response);

      const result = await api.getFeaturedRepositories('testuser', 3);

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('repo2'); // Highest stars
      expect(result[1].name).toBe('repo5'); // Second highest stars
      expect(result[2].name).toBe('repo1'); // Third highest stars
    });

    it('should handle errors gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('API error'));

      const result = await api.getFeaturedRepositories('testuser');

      expect(result).toEqual([]);
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Failed to get featured repositories:',
        expect.any(Error)
      );
    });
  });

  describe('getUserWorkflowRuns', () => {
    it('should fetch workflow runs from user repositories', async () => {
      const repositories = [
        { ...mockRepository, name: 'repo1' },
        { ...mockRepository, name: 'repo2' },
      ];
      const workflowResponse: GitHubWorkflowRunsResponse = {
        total_count: 1,
        workflow_runs: [mockWorkflowRun],
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue(repositories),
        } as unknown as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue(workflowResponse),
        } as unknown as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ total_count: 0, workflow_runs: [] }),
        } as unknown as Response);

      const result = await api.getUserWorkflowRuns('testuser', 10);

      expect(result).toEqual([mockWorkflowRun]);
    });

    it('should handle repositories without workflow access', async () => {
      const repositories = [{ ...mockRepository, name: 'repo1' }];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue(repositories),
        } as unknown as Response)
        .mockRejectedValueOnce(new Error('No access'));

      const result = await api.getUserWorkflowRuns('testuser');

      expect(result).toEqual([]);
    });

    it('should handle errors when fetching repositories', async () => {
      mockFetch.mockRejectedValue(new Error('User not found'));

      const result = await api.getUserWorkflowRuns('testuser');

      expect(result).toEqual([]);
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Failed to get user workflow runs:',
        expect.any(Error)
      );
    });

    it('should process repositories in batches with delays', async () => {
      // Create 10 repositories to test batching (batch size is 5)
      const repositories = Array.from({ length: 10 }, (_, i) => ({
        ...mockRepository,
        name: `repo${i + 1}`,
      }));

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(repositories),
      } as unknown as Response);

      // Mock workflow responses for each repository
      repositories.forEach(() => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ total_count: 0, workflow_runs: [] }),
        } as unknown as Response);
      });

      // Use real timers for this test to avoid timing issues
      jest.useRealTimers();
      
      const result = await api.getUserWorkflowRuns('testuser');

      expect(result).toEqual([]);
      expect(mockFetch).toHaveBeenCalledTimes(11); // 1 for repos + 10 for workflows
      
      // Restore fake timers
      jest.useFakeTimers();
    });
  });

  describe('getRepositoryStats', () => {
    it('should return repository statistics', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockRepository),
      } as unknown as Response);

      const result = await api.getRepositoryStats('testuser', 'test-repo');

      expect(result).toEqual({
        stars: mockRepository.stargazers_count,
        forks: mockRepository.forks_count,
        issues: mockRepository.open_issues_count,
        watchers: mockRepository.watchers_count,
        language: mockRepository.language,
        topics: mockRepository.topics,
        created: mockRepository.created_at,
        updated: mockRepository.updated_at,
        pushed: mockRepository.pushed_at,
      });
    });

    it('should handle errors gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Repository not found'));

      const result = await api.getRepositoryStats('testuser', 'test-repo');

      expect(result).toBe(null);
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Failed to get stats for testuser/test-repo:',
        expect.any(Error)
      );
    });
  });
});

describe('githubApi singleton', () => {
  it('should be an instance of GitHubApi', () => {
    expect(githubApi).toBeInstanceOf(GitHubApi);
  });

  it('should be the same instance when imported multiple times', () => {
    expect(githubApi).toBe(githubApi2);
  });
});

describe('processLanguageStats', () => {
  it('should process language statistics correctly', () => {
    const languages = {
      TypeScript: 5000,
      JavaScript: 3000,
      CSS: 2000,
    };

    const result = processLanguageStats(languages);

    expect(result).toEqual([
      { language: 'TypeScript', bytes: 5000, percentage: 50 },
      { language: 'JavaScript', bytes: 3000, percentage: 30 },
      { language: 'CSS', bytes: 2000, percentage: 20 },
    ]);
  });

  it('should handle empty languages object', () => {
    const result = processLanguageStats({});
    expect(result).toEqual([]);
  });

  it('should handle single language', () => {
    const languages = { TypeScript: 1000 };
    const result = processLanguageStats(languages);

    expect(result).toEqual([
      { language: 'TypeScript', bytes: 1000, percentage: 100 },
    ]);
  });

  it('should sort languages by bytes in descending order', () => {
    const languages = {
      CSS: 1000,
      TypeScript: 5000,
      JavaScript: 3000,
    };

    const result = processLanguageStats(languages);

    expect(result[0].language).toBe('TypeScript');
    expect(result[1].language).toBe('JavaScript');
    expect(result[2].language).toBe('CSS');
  });
});

describe('getActivitySummary', () => {
  it('should summarize activity correctly', () => {
    const activities: GitHubActivity[] = [
      { ...mockActivity, type: 'PushEvent', repo: { ...mockActivity.repo, name: 'repo1' } },
      { ...mockActivity, type: 'IssuesEvent', repo: { ...mockActivity.repo, name: 'repo2' } },
      { ...mockActivity, type: 'PushEvent', repo: { ...mockActivity.repo, name: 'repo1' } },
      { ...mockActivity, type: 'PullRequestEvent', repo: { ...mockActivity.repo, name: 'repo3' } },
    ];

    const result = getActivitySummary(activities);

    expect(result).toEqual({
      totalEvents: 4,
      commits: 2, // 2 PushEvents with 1 commit each
      types: {
        PushEvent: 2,
        IssuesEvent: 1,
        PullRequestEvent: 1,
      },
      uniqueRepositories: 3,
      repositories: expect.arrayContaining(['repo1', 'repo2', 'repo3']),
    });
  });

  it('should handle empty activity array', () => {
    const result = getActivitySummary([]);

    expect(result).toEqual({
      totalEvents: 0,
      commits: 0,
      types: {},
      uniqueRepositories: 0,
      repositories: [],
    });
  });

  it('should handle activities without commits', () => {
    const activities: GitHubActivity[] = [
      { ...mockActivity, type: 'IssuesEvent', payload: {} },
      { ...mockActivity, type: 'WatchEvent', payload: {} },
    ];

    const result = getActivitySummary(activities);

    expect(result.commits).toBe(0);
    expect(result.totalEvents).toBe(2);
  });

  it('should handle PushEvent without commits array', () => {
    const activities: GitHubActivity[] = [
      { ...mockActivity, type: 'PushEvent', payload: { commits: undefined } },
    ];

    const result = getActivitySummary(activities);

    expect(result.commits).toBe(0);
  });
});
