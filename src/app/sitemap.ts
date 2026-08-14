import type { MetadataRoute } from 'next'

import { PUBLIC_ROUTES, absoluteUrl } from '@/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return PUBLIC_ROUTES.map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }))
}
