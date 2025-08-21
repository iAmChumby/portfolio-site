// Global type definitions for the portfolio site

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  featured: boolean;
  category: ProjectCategory;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export type ProjectCategory = 
  | 'web-development'
  | 'mobile-app'
  | 'desktop-app'
  | 'api'
  | 'library'
  | 'tool'
  | 'other';

export type ProjectStatus = 
  | 'completed'
  | 'in-progress'
  | 'planned'
  | 'archived';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  featured: boolean;
  readingTime: number;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  projectType?: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
}

export interface Analytics {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  averageSessionDuration: number;
  topPages: Array<{
    path: string;
    views: number;
  }>;
  topReferrers: Array<{
    source: string;
    visits: number;
  }>;
}
export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
}