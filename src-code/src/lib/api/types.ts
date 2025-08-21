// API Response Types for Portfolio Backend

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  hireable: boolean | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  owner: GitHubUser;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  clone_url: string;
  git_url: string;
  ssh_url: string;
  svn_url: string;
  mirror_url: string | null;
  homepage: string | null;
  language: string | null;
  forks_count: number;
  stargazers_count: number;
  watchers_count: number;
  size: number;
  default_branch: string;
  open_issues_count: number;
  topics: string[];
  has_issues: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_downloads: boolean;
  archived: boolean;
  disabled: boolean;
  visibility: string;
  pushed_at: string | null;
  created_at: string;
  updated_at: string;
  permissions?: {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };
  allow_rebase_merge?: boolean;
  template_repository?: GitHubRepository | null;
  temp_clone_token?: string;
  allow_squash_merge?: boolean;
  allow_auto_merge?: boolean;
  delete_branch_on_merge?: boolean;
  allow_merge_commit?: boolean;
  subscribers_count?: number;
  network_count?: number;
  license?: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
    node_id: string;
  } | null;
  forks?: number;
  open_issues?: number;
  watchers?: number;
  gravatar_id?: string;
  type?: string;
  site_admin?: boolean;
  archive_url: string;
  assignees_url: string;
  blobs_url: string;
  branches_url: string;
  collaborators_url: string;
  comments_url: string;
  commits_url: string;
  compare_url: string;
  contents_url: string;
  contributors_url: string;
  deployments_url: string;
  downloads_url: string;
  events_url: string;
  forks_url: string;
  git_commits_url: string;
  git_refs_url: string;
  git_tags_url: string;
  hooks_url: string;
  issue_comment_url: string;
  issue_events_url: string;
  issues_url: string;
  keys_url: string;
  labels_url: string;
  languages_url: string;
  merges_url: string;
  milestones_url: string;
  notifications_url: string;
  pulls_url: string;
  releases_url: string;
  stargazers_url: string;
  statuses_url: string;
  subscribers_url: string;
  subscription_url: string;
  tags_url: string;
  teams_url: string;
  trees_url: string;
}

export interface GitHubLanguages {
  [language: string]: number;
}

export interface LanguageStats {
  language: string;
  bytes: number;
  percentage: number;
}

export interface ActivitySummary {
  totalEvents: number;
  pushEvents: number;
  issueEvents: number;
  pullRequestEvents: number;
  recentActivity: GitHubActivity[];
}

export interface RepositoryStats {
  stars: number;
  forks: number;
  issues: number;
  watchers: number;
  language: string;
  topics: string[];
  created: string;
  updated: string;
  pushed: string;
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
  commits?: {
    sha: string;
    message: string;
    author: {
      name: string;
      email: string;
    };
    distinct?: boolean;
    url?: string;
  }[];
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
    id: number;
    login: string;
    display_login?: string;
    gravatar_id?: string;
    url?: string;
    avatar_url: string;
  };
  repo: {
    id: number;
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
    node_id: string;
    name: string;
    full_name: string;
    owner: {
      login: string;
      id: number;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      type: string;
      site_admin: boolean;
    };
    private: boolean;
    html_url: string;
    description: string | null;
    fork: boolean;
    url: string;
    archive_url: string;
    assignees_url: string;
    blobs_url: string;
    branches_url: string;
    collaborators_url: string;
    comments_url: string;
    commits_url: string;
    compare_url: string;
    contents_url: string;
    contributors_url: string;
    deployments_url: string;
    downloads_url: string;
    events_url: string;
    forks_url: string;
    git_commits_url: string;
    git_refs_url: string;
    git_tags_url: string;
    hooks_url: string;
    issue_comment_url: string;
    issue_events_url: string;
    issues_url: string;
    keys_url: string;
    labels_url: string;
    languages_url: string;
    merges_url: string;
    milestones_url: string;
    notifications_url: string;
    pulls_url: string;
    releases_url: string;
    stargazers_url: string;
    statuses_url: string;
    subscribers_url: string;
    subscription_url: string;
    tags_url: string;
    teams_url: string;
    trees_url: string;
  };
  head_repository: {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    owner: {
      login: string;
      id: number;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      type: string;
      site_admin: boolean;
    };
    private: boolean;
    html_url: string;
    description: string | null;
    fork: boolean;
    url: string;
    archive_url: string;
    assignees_url: string;
    blobs_url: string;
    branches_url: string;
    collaborators_url: string;
    comments_url: string;
    commits_url: string;
    compare_url: string;
    contents_url: string;
    contributors_url: string;
    deployments_url: string;
    downloads_url: string;
    events_url: string;
    forks_url: string;
    git_commits_url: string;
    git_refs_url: string;
    git_tags_url: string;
    hooks_url: string;
    issue_comment_url: string;
    issue_events_url: string;
    issues_url: string;
    keys_url: string;
    labels_url: string;
    languages_url: string;
    merges_url: string;
    milestones_url: string;
    notifications_url: string;
    pulls_url: string;
    releases_url: string;
    stargazers_url: string;
    statuses_url: string;
    subscribers_url: string;
    subscription_url: string;
    tags_url: string;
    teams_url: string;
    trees_url: string;
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