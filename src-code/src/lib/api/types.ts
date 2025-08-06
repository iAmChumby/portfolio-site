// API Response Types for Portfolio Backend

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  languages_url: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  visibility: 'public' | 'private';
  archived: boolean;
  disabled: boolean;
  fork: boolean;
}

export interface GitHubLanguages {
  [language: string]: number;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
  repository?: {
    name: string;
    full_name: string;
  };
}

export interface GitHubActivityPayload {
  commits?: Array<{
    sha: string;
    message: string;
    author: {
      name: string;
      email: string;
    };
  }>;
  ref?: string;
  ref_type?: string;
  master_branch?: string;
  description?: string;
  pusher_type?: string;
  size?: number;
  distinct_size?: number;
  head?: string;
  before?: string;
  [key: string]: unknown;
}

export interface GitHubActivity {
  id: string;
  type: 'PushEvent' | 'CreateEvent' | 'WatchEvent' | 'ForkEvent' | 'IssuesEvent' | 'PullRequestEvent';
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    name: string;
    url: string;
  };
  payload: GitHubActivityPayload;
  public: boolean;
  created_at: string;
}

export interface ProjectData {
  id: string;
  name: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  category: 'web' | 'mobile' | 'desktop' | 'library' | 'tool' | 'other';
  status: 'active' | 'completed' | 'archived' | 'in-progress';
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  screenshots?: string[];
  startDate: string;
  endDate?: string;
  repository?: GitHubRepository;
  stats?: {
    stars: number;
    forks: number;
    issues: number;
    commits: number;
    contributors: number;
  };
}

export interface SkillData {
  name: string;
  category: 'language' | 'framework' | 'tool' | 'database' | 'cloud' | 'other';
  proficiency: 1 | 2 | 3 | 4 | 5; // 1 = Beginner, 5 = Expert
  yearsOfExperience: number;
  lastUsed: string;
  projectCount: number;
  linesOfCode?: number;
  repositories: string[];
}

export interface ActivityData {
  date: string;
  type: 'commit' | 'repository' | 'release' | 'issue' | 'pull_request';
  title: string;
  description: string;
  url: string;
  repository: string;
  impact: 'low' | 'medium' | 'high';
}

export interface PersonalData {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  phone?: string;
  website: string;
  avatar: string;
  resume?: string;
  social: {
    github: string;
    linkedin: string;
    twitter?: string;
    instagram?: string;
  };
  story: {
    introduction: string;
    journey: string[];
    currentFocus: string;
    goals: string[];
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description: string;
    technologies: string[];
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: number;
    achievements?: string[];
  }>;
}

export interface GitHubWorkflowRun {
  id: number;
  name: string;
  head_branch: string;
  head_sha: string;
  path: string;
  display_title: string;
  run_number: number;
  event: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  workflow_id: number;
  check_suite_id: number;
  check_suite_node_id: string;
  url: string;
  html_url: string;
  pull_requests: Array<{
    url: string;
    id: number;
    number: number;
    head: {
      ref: string;
      sha: string;
      repo: {
        id: number;
        name: string;
        url: string;
      };
    };
    base: {
      ref: string;
      sha: string;
      repo: {
        id: number;
        name: string;
        url: string;
      };
    };
  }>;
  created_at: string;
  updated_at: string;
  actor: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  };
  run_attempt: number;
  referenced_workflows: Array<{
    path: string;
    sha: string;
    ref?: string;
  }>;
  run_started_at: string;
  triggering_actor: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  };
  jobs_url: string;
  logs_url: string;
  check_suite_url: string;
  artifacts_url: string;
  cancel_url: string;
  rerun_url: string;
  previous_attempt_url: string | null;
  workflow_url: string;
  head_commit: {
    id: string;
    tree_id: string;
    message: string;
    timestamp: string;
    author: {
      name: string;
      email: string;
    };
    committer: {
      name: string;
      email: string;
    };
  };
  repository: {
    id: number;
    name: string;
    full_name: string;
    owner: {
      login: string;
      id: number;
      avatar_url: string;
      html_url: string;
    };
    private: boolean;
    html_url: string;
    description: string | null;
    fork: boolean;
    url: string;
  };
  head_repository: {
    id: number;
    name: string;
    full_name: string;
    owner: {
      login: string;
      id: number;
      avatar_url: string;
      html_url: string;
    };
    private: boolean;
    html_url: string;
    description: string | null;
    fork: boolean;
    url: string;
  };
}

export interface GitHubWorkflowRunsResponse {
  total_count: number;
  workflow_runs: GitHubWorkflowRun[];
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Request types
export interface GetRepositoriesParams {
  page?: number;
  limit?: number;
  sort?: 'created' | 'updated' | 'pushed' | 'full_name';
  direction?: 'asc' | 'desc';
  type?: 'all' | 'owner' | 'member';
  visibility?: 'all' | 'public' | 'private';
}

export interface GetActivityParams {
  page?: number;
  limit?: number;
  type?: string[];
  dateFrom?: string;
  dateTo?: string;
}