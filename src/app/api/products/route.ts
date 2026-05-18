import { NextRequest, NextResponse } from 'next/server'

import { getStoreProducts } from '@/lib/products'

const collections = new Set(['premium', 'ortho', 'kids', 'basic', 'accessories'])
const hardnessOptions = new Set(['soft', 'medium', 'hard', 'dual'])

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const collection = searchParams.get('collection')
  const hardness = searchParams.get('hardness')
  const sort = searchParams.get('sort')

  const products = (await getStoreProducts())
    .filter((product) => product.active !== false)
    .filter((product) => !collection || collection === 'all' || (collections.has(collection) && product.collection === collection))
    .filter((product) => !hardness || hardness === 'all' || (hardnessOptions.has(hardness) && product.hardness === hardness))
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price

      return (a.sortOrder ?? 100) - (b.sortOrder ?? 100)
    })

  return NextResponse.json({
    docs: products,
    totalDocs: products.length,
  })
}
