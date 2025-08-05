'use client';

import React from 'react';
import { LoadingSpinner, ErrorMessage } from '../ui';
import { useGitHubUser, useGitHubRepositories, useGitHubLanguages } from '../../lib/hooks';
import { FolderIcon, UsersIcon, UserIcon, StarIcon } from '../ui/icons';
import siteConfig from '@/data/site-config.json';

const GitHubStats: React.FC = () => {
  const username = siteConfig.github?.username || 'iAmChumby';
  const { data: user, loading: userLoading, error: userError } = useGitHubUser(username);
  const { data: repositories, loading: reposLoading, error: reposError } = useGitHubRepositories(username);
  const { data: languages, loading: languagesLoading, error: languagesError } = useGitHubLanguages(username);

  const loading = userLoading || reposLoading || languagesLoading;
  const error = userError || reposError || languagesError;

  if (loading) {
    return (
      <div className="w-full">
        <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-black mb-4">GitHub Statistics</h2>
        <p className="text-accent">Overview of my GitHub activity</p>
      </div>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-black mb-4">GitHub Statistics</h2>
        <p className="text-accent">Overview of my GitHub activity</p>
      </div>
        <div className="max-w-md mx-auto">
          <ErrorMessage 
            message={error} 
            variant="minimal"
          />
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Public Repos',
      value: user?.public_repos || 0,
      icon: FolderIcon
    },
    {
      label: 'Followers',
      value: user?.followers || 0,
      icon: UsersIcon
    },
    {
      label: 'Following',
      value: user?.following || 0,
      icon: UserIcon
    },
    {
      label: 'Total Stars',
      value: repositories?.reduce((acc, repo) => acc + repo.stargazers_count, 0) || 0,
      icon: StarIcon
    }
  ];

  const topLanguages = languages ? Object.entries(languages)
    .map(([language, bytes]) => ({
      language,
      bytes: bytes as unknown as number,
      percentage: 0
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 5)
    .map((lang, index, arr) => {
      const totalBytes = arr.reduce((sum, l) => sum + l.bytes, 0);
      return {
        ...lang,
        percentage: totalBytes > 0 ? (lang.bytes / totalBytes) * 100 : 0
      };
    }) : [];

  return (
    <div className="w-full">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="text-center p-6 bg-card rounded-lg border border-border">
              <div className="text-black mb-3 flex justify-center">
                <IconComponent size={32} />
              </div>
              <div className="text-3xl font-bold text-black mb-2">{stat.value.toLocaleString()}</div>
              <div className="text-sm text-accent">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Top Languages */}
      {topLanguages.length > 0 && (
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-black mb-6 text-center">Top Languages</h3>
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="space-y-4">
              {topLanguages.map((lang, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-base font-medium text-black">{lang.language}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-muted rounded-full h-3">
                      <div
                        className="bg-black h-3 rounded-full transition-all duration-300"
                        style={{ width: `${lang.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-accent w-10 text-right">
                      {lang.percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="text-center mt-8">
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-background text-foreground font-medium rounded-lg hover:bg-muted transition-colors"
          >
            View GitHub Profile
          </a>
        </div>
    </div>
  );
};

export default GitHubStats;