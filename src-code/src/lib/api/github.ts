import { 
  GitHubRepository, 
  GitHubUser, 
  GitHubLanguages, 
  GitHubActivity,
  GitHubCommit,
  GitHubWorkflowRun,
  GitHubWorkflowRunsResponse,
  GetRepositoriesParams 
} from './types';

// GitHub API Configuration
const GITHUB_API_BASE = 'https://api.github.com';

interface GitHubApiOptions {
  headers?: Record<string, string>;
}

class GitHubApi {
  private async makeRequest<T>(
    endpoint: string, 
    options: GitHubApiOptions = {}
  ): Promise<T> {
    const url = `${GITHUB_API_BASE}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-Site/1.0',
      ...options.headers,
    };

    // Add authentication if token is available
    const githubToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }

    try {
      const response = await fetch(url, {
        headers,
        // Add cache control for better performance
        next: { revalidate: 300 }, // Cache for 5 minutes
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `GitHub API error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`GitHub API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get user profile
  async getUser(username: string): Promise<GitHubUser> {
    return this.makeRequest<GitHubUser>(`/users/${username}`);
  }

  // Get user repositories
  async getUserRepositories(
    username: string, 
    params: GetRepositoriesParams = {}
  ): Promise<GitHubRepository[]> {
    const queryParams = new URLSearchParams();
    
    if (params.type) queryParams.set('type', params.type);
    if (params.sort) queryParams.set('sort', params.sort);
    if (params.direction) queryParams.set('direction', params.direction);
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('per_page', Math.min(params.limit, 100).toString());

    const endpoint = `/users/${username}/repos${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<GitHubRepository[]>(endpoint);
  }

  // Get repository languages
  async getRepositoryLanguages(
    owner: string, 
    repo: string
  ): Promise<GitHubLanguages> {
    return this.makeRequest<GitHubLanguages>(`/repos/${owner}/${repo}/languages`);
  }

  // Get repository details
  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    return this.makeRequest<GitHubRepository>(`/repos/${owner}/${repo}`);
  }

  // Get user activity (public events)
  async getUserActivity(
    username: string, 
    page = 1, 
    perPage = 30
  ): Promise<GitHubActivity[]> {
    const endpoint = `/users/${username}/events/public?page=${page}&per_page=${Math.min(perPage, 100)}`;
    return this.makeRequest<GitHubActivity[]>(endpoint);
  }

  // Get repository commits
  async getRepositoryCommits(
    owner: string, 
    repo: string, 
    page = 1, 
    perPage = 30
  ): Promise<GitHubCommit[]> {
    const endpoint = `/repos/${owner}/${repo}/commits?page=${page}&per_page=${Math.min(perPage, 100)}`;
    return this.makeRequest<GitHubCommit[]>(endpoint);
  }

  // Get user's contribution activity (requires authentication)
  async getUserContributions(username: string): Promise<GitHubActivity[]> {
    // Note: This endpoint requires GraphQL API for detailed contribution data
    // For now, we'll use the events API as a proxy
    return this.getUserActivity(username, 1, 100);
  }

  // Utility: Get all languages across user's repositories
  async getUserLanguages(username: string): Promise<Record<string, number>> {
    try {
      const repositories = await this.getUserRepositories(username, { 
        type: 'owner',
        sort: 'updated',
        limit: 100 
      });

      const languageStats: Record<string, number> = {};

      // Process repositories in batches to avoid rate limiting
      const batchSize = 10;
      for (let i = 0; i < repositories.length; i += batchSize) {
        const batch = repositories.slice(i, i + batchSize);
        
        const languagePromises = batch.map(async (repo) => {
          if (!repo.language) return {};
          
          try {
            return await this.getRepositoryLanguages(username, repo.name);
          } catch (error) {
            console.warn(`Failed to get languages for ${repo.name}:`, error);
            return {};
          }
        });

        const batchResults = await Promise.all(languagePromises);
        
        batchResults.forEach((repoLanguages) => {
          Object.entries(repoLanguages).forEach(([language, bytes]) => {
            languageStats[language] = (languageStats[language] || 0) + bytes;
          });
        });

        // Add delay between batches to respect rate limits
        if (i + batchSize < repositories.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      return languageStats;
    } catch (error) {
      console.error('Failed to get user languages:', error);
      return {};
    }
  }

  // Utility: Get featured repositories (most starred, recently updated)
  async getFeaturedRepositories(
    username: string, 
    limit = 6
  ): Promise<GitHubRepository[]> {
    try {
      const repositories = await this.getUserRepositories(username, {
        type: 'owner',
        sort: 'updated',
        limit: 100
      });

      // Filter out forks and sort by stars, then by recent activity
      const filtered = repositories
        .filter(repo => !repo.fork && !repo.archived)
        .sort((a, b) => {
          // Primary sort: stars
          const starDiff = b.stargazers_count - a.stargazers_count;
          if (starDiff !== 0) return starDiff;
          
          // Secondary sort: recent updates
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });

      return filtered.slice(0, limit);
    } catch (error) {
      console.error('Failed to get featured repositories:', error);
      return [];
    }
  }

  // Get user's workflow runs across all repositories
  async getUserWorkflowRuns(
    username: string,
    perPage = 30
  ): Promise<GitHubWorkflowRun[]> {
    try {
      // First, get user's repositories
      const repositories = await this.getUserRepositories(username, {
        type: 'owner',
        sort: 'updated',
        limit: 100
      });

      const allWorkflowRuns: GitHubWorkflowRun[] = [];

      // Process repositories in batches to avoid rate limiting
      const batchSize = 5;
      for (let i = 0; i < repositories.length; i += batchSize) {
        const batch = repositories.slice(i, i + batchSize);
        
        const workflowPromises = batch.map(async (repo) => {
          try {
            // Fetch workflow runs from all branches (no branch parameter = all branches)
            const response = await this.makeRequest<GitHubWorkflowRunsResponse>(
              `/repos/${username}/${repo.name}/actions/runs?per_page=10&page=1`
            );
            return response.workflow_runs;
          } catch {
            // Silently handle repos without workflows or access issues
            return [];
          }
        });

        const batchResults = await Promise.all(workflowPromises);
        batchResults.forEach(runs => allWorkflowRuns.push(...runs));

        // Add delay between batches to respect rate limits
        if (i + batchSize < repositories.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      // Sort by created date (most recent first) and limit results
      return allWorkflowRuns
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, perPage);
    } catch (error) {
      console.error('Failed to get user workflow runs:', error);
      return [];
    }
  }

  // Get workflow runs for a specific repository
  async getRepositoryWorkflowRuns(
    owner: string,
    repo: string,
    page = 1,
    perPage = 30
  ): Promise<GitHubWorkflowRunsResponse> {
    const endpoint = `/repos/${owner}/${repo}/actions/runs?page=${page}&per_page=${Math.min(perPage, 100)}`;
    return this.makeRequest<GitHubWorkflowRunsResponse>(endpoint);
  }

  // Utility: Get repository statistics
  async getRepositoryStats(owner: string, repo: string): Promise<{
    stars: number;
    forks: number;
    issues: number;
    watchers: number;
    language: string | null;
    topics: string[];
    created: string;
    updated: string;
    pushed: string | null;
  } | null> {
    try {
      const repoData = await this.getRepository(owner, repo);

      return {
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        issues: repoData.open_issues_count,
        watchers: repoData.watchers_count,
        language: repoData.language,
        topics: repoData.topics,
        created: repoData.created_at,
        updated: repoData.updated_at,
        pushed: repoData.pushed_at,
      };
    } catch (error) {
      console.error(`Failed to get stats for ${owner}/${repo}:`, error);
      return null;
    }
  }
}

// Create singleton instance
export const githubApi = new GitHubApi();

// Export class for custom instances
export { GitHubApi };

// Utility functions for processing GitHub data
export const processLanguageStats = (languages: Record<string, number>) => {
  const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
  
  return Object.entries(languages)
    .map(([language, bytes]) => ({
      language,
      bytes,
      percentage: total > 0 ? (bytes / total) * 100 : 0,
    }))
    .sort((a, b) => b.bytes - a.bytes);
};

export const getActivitySummary = (activities: GitHubActivity[]) => {
  const summary = {
    totalEvents: activities.length,
    commits: 0,
    repositories: new Set<string>(),
    types: {} as Record<string, number>,
  };

  activities.forEach(activity => {
    summary.types[activity.type] = (summary.types[activity.type] || 0) + 1;
    summary.repositories.add(activity.repo.name);
    
    if (activity.type === 'PushEvent') {
      summary.commits += activity.payload?.commits?.length || 0;
    }
  });

  return {
    ...summary,
    uniqueRepositories: summary.repositories.size,
    repositories: Array.from(summary.repositories),
  };
};