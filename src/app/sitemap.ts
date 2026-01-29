import { MetadataRoute } from 'next';
import siteConfig from '@/data/site-config.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.site.url;
  const lastModified = new Date();

  // Define all static routes with their priorities and change frequencies
  const routes: Array<{
    route: string;
    priority: number;
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  }> = [
    { route: '', priority: 1.0, changeFrequency: 'weekly' }, // Homepage
    { route: '/about', priority: 0.9, changeFrequency: 'monthly' },
    { route: '/projects', priority: 0.9, changeFrequency: 'monthly' },
    { route: '/now', priority: 0.9, changeFrequency: 'weekly' }, // Updated more frequently
    { route: '/resume', priority: 0.8, changeFrequency: 'monthly' },
    { route: '/contact', priority: 0.8, changeFrequency: 'yearly' },
    { route: '/privacy', priority: 0.5, changeFrequency: 'yearly' }, // Legal pages
    { route: '/terms', priority: 0.5, changeFrequency: 'yearly' },
  ];

  return routes.map(({ route, priority, changeFrequency }) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
