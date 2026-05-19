import type { MetadataRoute } from 'next'

import { getStoreProducts } from '@/lib/products'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
  const now = new Date()
  const products = await getStoreProducts()

  return [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      priority: 1,
    },
    {
      url: `${siteUrl}/catalog/`,
      lastModified: now,
      priority: 0.9,
    },
    ...products.map((product) => ({
      url: `${siteUrl}/product/${product.slug}/`,
      lastModified: now,
      priority: 0.8,
    })),
    {
      url: `${siteUrl}/privacy/`,
      lastModified: now,
      priority: 0.3,
    },
    {
      url: `${siteUrl}/offer/`,
      lastModified: now,
      priority: 0.3,
    },
  ]
}
