import type { MetadataRoute } from 'next'

import { getStoreProducts } from '@/lib/products'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const products = await getStoreProducts()
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
    ...products.map((product) => ({
      url: `${siteUrl}/product/${product.slug}`,
      lastModified: now,
      priority: 0.8,
    })),
  ]
}
