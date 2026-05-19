import type { MetadataRoute } from 'next'

import { seedProducts } from '@/lib/seed-data'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const now = new Date()

  return [
    {
      url: siteUrl,
      lastModified: now,
      priority: 1,
    },
    {
      url: `${siteUrl}/catalog`,
      lastModified: now,
      priority: 0.9,
    },
    ...seedProducts.map((product) => ({
      url: `${siteUrl}/product/${product.slug}`,
      lastModified: now,
      priority: 0.8,
    })),
  ]
}
