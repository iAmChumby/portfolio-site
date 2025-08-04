// API Hooks
export {
  useApi,
  useProjects,
  useSkills,
  usePersonalData,
  usePostData,
  useUpdateData,
  useDeleteData,
} from './useApi';

// GitHub Hooks
export {
  useGitHubUser,
  useGitHubRepositories,
  useFeaturedRepositories,
  useGitHubActivity,
  useGitHubLanguages,
  useGitHubActivitySummary,
  useGitHubDashboard,
  useRepositoryStats,
} from './useGitHub';

// Re-export types for convenience
export type {
  GitHubRepository,
  GitHubUser,
  GitHubActivity,
  ProjectData,
  SkillData,
  PersonalData,
  ApiResponse,
} from '../api/types';