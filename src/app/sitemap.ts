import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lukeedwards.me'
  
  // Last modified date for static pages - using current date as a baseline
  const lastModified = new Date()

  // Define all static routes
  const routes = [
    '',
    '/about',
    '/contact',
    '/now',
    '/projects',
    '/privacy',
    '/terms',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }))
}
