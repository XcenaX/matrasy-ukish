import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { getStoreProduct, getStoreProducts } from '@/lib/products'

import { ProductClient } from '../product-client'

type ProductSlugPageProps = {
  params: Promise<{
    slug: string
  }>
}

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  const products = await getStoreProducts()

  return products.map((product) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata({ params }: ProductSlugPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getStoreProduct(slug)

  if (!product) {
    return {
      title: 'Товар не найден',
      robots: { index: false, follow: true },
    }
  }

  const title = `${product.title} - купить матрас UKISH`
  const description =
    product.shortDescription ||
    `${product.title}: ортопедический матрас UKISH с доставкой по Казахстану.`

  return {
    title,
    description,
    alternates: {
      canonical: `/product/${product.slug}/`,
    },
    openGraph: {
      title,
      description,
      url: `/product/${product.slug}/`,
      type: 'website',
      images: [
        {
          url: product.image,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image],
    },
  }
}

export default async function ProductSlugPage({ params }: ProductSlugPageProps) {
  const { slug } = await params
  const product = await getStoreProduct(slug)

  if (!product) notFound()

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#faf8f5]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--gold)] border-t-transparent" />
        </div>
      }
    >
      <ProductClient initialProduct={product} initialSlug={slug} />
    </Suspense>
  )
}
