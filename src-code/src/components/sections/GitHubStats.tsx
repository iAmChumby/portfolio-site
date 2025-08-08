'use client';

import React, { useState } from 'react';
import { LoadingSpinner, ErrorMessage } from '../ui';
import { useGitHubUser, useGitHubRepositories, useGitHubLanguages, useGitHubWorkflowRuns } from '../../lib/hooks';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import siteConfig from '@/data/site-config.json';

const GitHubStats: React.FC = () => {
  const username = siteConfig.github?.username || 'iAmChumby';
  const [showAllWorkflows, setShowAllWorkflows] = useState(false);
  
  const { data: user, loading: userLoading, error: userError } = useGitHubUser(username);
  const { data: repositories, loading: reposLoading, error: reposError } = useGitHubRepositories(username);
  const { data: languages, loading: languagesLoading, error: languagesError } = useGitHubLanguages(username);
  const { data: workflowRuns, loading: workflowLoading, error: workflowError } = useGitHubWorkflowRuns(username, 10);

  const loading = userLoading || reposLoading || languagesLoading || workflowLoading;
  const error = userError || reposError || languagesError || workflowError;

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="max-w-md mx-auto">
          <ErrorMessage 
            message={error} 
            variant="minimal"
          />
        </div>
      </div>
    );
  }

  // Get top 5 languages
  const topLanguages = languages ? languages.slice(0, 5) : [];

  // Get workflow runs to display (5 or 10 based on expanded state)
  const displayedWorkflows = workflowRuns ? workflowRuns.slice(0, showAllWorkflows ? 10 : 5) : [];

  const getStatusColor = (status: string, conclusion?: string | null) => {
    if (status === 'completed') {
      switch (conclusion) {
        case 'success':
          return 'bg-green-500';
        case 'failure':
          return 'bg-red-500';
        case 'cancelled':
          return 'bg-gray-500';
        case 'skipped':
          return 'bg-yellow-500';
        default:
          return 'bg-blue-500';
      }
    }
    if (status === 'in_progress') return 'bg-blue-500';
    if (status === 'queued') return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getStatusText = (status: string, conclusion: string | null) => {
    if (status === 'in_progress') return 'Running';
    if (status === 'queued') return 'Queued';
    if (status === 'completed') {
      switch (conclusion) {
        case 'success': return 'Success';
        case 'failure': return 'Failed';
        case 'cancelled': return 'Cancelled';
        case 'skipped': return 'Skipped';
        case 'timed_out': return 'Timeout';
        default: return 'Completed';
      }
    }
    return 'Unknown';
  };

  return (
    <div className="relative">
      {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/20 rounded-2xl" />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-md rounded-2xl border border-white/20" />
      
      <div className="relative p-4 md:p-6">
        <div className="space-y-4">

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
              <div className="text-lg md:text-xl font-bold text-white">{user?.public_repos || 0}</div>
              <div className="text-xs text-gray-400">Repositories</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
              <div className="text-lg md:text-xl font-bold text-white">{user?.followers || 0}</div>
              <div className="text-xs text-gray-400">Followers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
              <div className="text-lg md:text-xl font-bold text-white">{user?.following || 0}</div>
              <div className="text-xs text-gray-400">Following</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
              <div className="text-lg md:text-xl font-bold text-white">
                {repositories?.reduce((sum, repo) => sum + repo.stargazers_count, 0) || 0}
              </div>
              <div className="text-xs text-gray-400">Total Stars</div>
            </div>
          </div>

          {/* Top Languages */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-3">Top 5 Languages</h3>
            {languagesLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-3 bg-gray-700 rounded mb-1"></div>
                    <div className="h-2 bg-gray-800 rounded"></div>
                  </div>
                ))}
              </div>
            ) : languagesError ? (
              <p className="text-red-400 text-sm">Failed to load languages</p>
            ) : (
              <div className="space-y-2">
                {topLanguages.map((lang, index) => (
                  <div key={lang.language} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">{lang.language}</span>
                      <span className="text-gray-400">{lang.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${
                          index === 0 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                          index === 1 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                          index === 2 ? 'bg-gradient-to-r from-teal-500 to-cyan-400' :
                          index === 3 ? 'bg-gradient-to-r from-green-600 to-green-400' :
                          'bg-gradient-to-r from-emerald-600 to-emerald-400'
                        }`}
                        style={{ width: `${lang.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Workflow Runs */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-white">Recent Workflows</h3>
              <button
                onClick={() => setShowAllWorkflows(!showAllWorkflows)}
                className="flex items-center space-x-1 text-sm text-green-400 hover:text-green-300 transition-colors"
              >
                <span>{showAllWorkflows ? 'Show Less' : 'Show More'}</span>
                {showAllWorkflows ? (
                  <ChevronUpIcon className="w-4 h-4" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4" />
                )}
              </button>
            </div>
            
            {workflowLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-700 rounded mb-1"></div>
                    <div className="h-3 bg-gray-800 rounded"></div>
                  </div>
                ))}
              </div>
            ) : workflowError ? (
              <p className="text-red-400 text-sm">Failed to load workflows</p>
            ) : workflowRuns && workflowRuns.length > 0 ? (
              <div className="space-y-2 overflow-hidden">
                <div 
                  className={`transition-all duration-500 ease-in-out ${
                    showAllWorkflows ? 'max-h-[600px] opacity-100' : 'max-h-[300px] opacity-100'
                  }`}
                >
                  {displayedWorkflows.map((workflow, index) => (
                    <div 
                      key={workflow.id} 
                      className={`flex items-center justify-between p-2 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-all duration-300 transform ${
                        showAllWorkflows && index >= 5 
                          ? 'animate-fade-in-up opacity-0 animate-delay-' + ((index - 5) * 100)
                          : ''
                      }`}
                      style={{
                        animationDelay: showAllWorkflows && index >= 5 ? `${(index - 5) * 100}ms` : '0ms',
                        animationFillMode: 'forwards'
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(workflow.status, workflow.conclusion)}`} />
                          <span className="text-sm font-medium text-white truncate">
                            {workflow.name || workflow.head_commit?.message?.split('\n')[0] || 'Workflow'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1 text-xs text-gray-400">
                          <span>{workflow.head_repository?.name}</span>
                          <span>•</span>
                          <span>{workflow.head_branch}</span>
                          <span>•</span>
                          <span>{getStatusText(workflow.status, workflow.conclusion)}</span>
                          <span>•</span>
                          <span>{new Date(workflow.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <a
                        href={workflow.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-green-400 hover:text-green-300 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No recent workflow runs found</p>
            )}
          </div>

          {/* GitHub Profile Link */}
          <div className="text-center">
            <a
              href={`https://github.com/${user?.login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="text-sm">View GitHub Profile</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubStats;