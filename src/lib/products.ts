import { collectionLabels, hardnessLabels, seedProducts, type StoreProduct } from './seed-data'

type StrapiMedia = {
  url?: string | null
  alternativeText?: string | null
  data?: StrapiMediaLike | null
  attributes?: StrapiMedia | null
}

type StrapiMediaLike = string | StrapiMedia | null | undefined

type StrapiProduct = {
  id?: string | number
  documentId?: string
  slug?: string
  title?: string
  collection?: StoreProduct['collection'] | 'Премиум' | 'Ортопедические' | 'Детские' | 'Базовые' | 'Аксессуары'
  hardness?: StoreProduct['hardness'] | 'Мягкий' | 'Средней жесткости' | 'Жесткий' | 'Разносторонний' | null
  shortDescription?: string
  description?: string
  price?: number
  oldPrice?: number | null
  image?: StrapiMediaLike
  gallery?: { image?: StrapiMediaLike }[] | null
  sizes?: { size?: string; price?: number }[] | null
  benefits?: { title?: string; text?: string }[] | null
  active?: boolean | null
  sortOrder?: number | null
  attributes?: StrapiProduct
}

type StrapiListResponse = {
  data?: StrapiProduct[]
}

function getStrapiUrl() {
  return (process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337').replace(/\/$/, '')
}

function getHeaders() {
  const headers: HeadersInit = {
    Accept: 'application/json',
  }

  if (process.env.STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${process.env.STRAPI_API_TOKEN}`
  }

  return headers
}

function resolveMediaUrl(media: StrapiMediaLike): string {
  if (!media) return '/assets/diamond-prime.jpg'
  if (typeof media === 'string') return media
  if (media.data) return resolveMediaUrl(media.data)
  if (media.attributes) return resolveMediaUrl(media.attributes)
  if (!media.url) return '/assets/diamond-prime.jpg'
  if (media.url.startsWith('/')) return `${getStrapiUrl()}${media.url}`

  return media.url
}

const collectionMap: Record<string, StoreProduct['collection']> = {
  premium: 'premium',
  ortho: 'ortho',
  kids: 'kids',
  basic: 'basic',
  accessories: 'accessories',
  Премиум: 'premium',
  Ортопедические: 'ortho',
  Детские: 'kids',
  Базовые: 'basic',
  Аксессуары: 'accessories',
}

const hardnessMap: Record<string, NonNullable<StoreProduct['hardness']>> = {
  soft: 'soft',
  medium: 'medium',
  hard: 'hard',
  dual: 'dual',
  Мягкий: 'soft',
  'Средней жесткости': 'medium',
  Жесткий: 'hard',
  Разносторонний: 'dual',
}

function normalizeProduct(rawProduct: StrapiProduct): StoreProduct | null {
  const product = rawProduct.attributes || rawProduct

  const collection = product.collection ? collectionMap[product.collection] : undefined
  const hardness = product.hardness ? hardnessMap[product.hardness] : undefined

  if (!product.slug || !product.title || !collection || !product.price) {
    return null
  }

  const mainImage = resolveMediaUrl(product.image)
  const gallery = product.gallery
    ?.map((item) => resolveMediaUrl(item.image))
    .filter(Boolean)

  return {
    id: String(product.documentId || product.id || product.slug),
    slug: product.slug,
    title: product.title,
    collection,
    collectionLabel: collectionLabels[collection],
    hardness,
    hardnessLabel: hardness ? hardnessLabels[hardness] : undefined,
    shortDescription: product.shortDescription || '',
    description: product.description || product.shortDescription || '',
    price: product.price,
    oldPrice: product.oldPrice || undefined,
    image: mainImage,
    gallery: gallery?.length ? gallery : [mainImage],
    sizes:
      product.sizes
        ?.filter((item) => item.size && item.price)
        .map((item) => ({ size: item.size as string, price: item.price as number })) || [],
    benefits:
      product.benefits
        ?.filter((item) => item.title && item.text)
        .map((item) => ({ title: item.title as string, text: item.text as string })) || [],
    active: product.active ?? true,
    sortOrder: product.sortOrder ?? undefined,
  }
}

async function fetchStrapiProducts(): Promise<StoreProduct[] | null> {
  const params = new URLSearchParams({
    'filters[active][$eq]': 'true',
    'pagination[pageSize]': '100',
    sort: 'sortOrder:asc',
  })
  params.set('populate[image]', 'true')
  params.set('populate[gallery][populate][image]', 'true')
  params.set('populate[sizes]', 'true')
  params.set('populate[benefits]', 'true')

  try {
    const response = await fetch(`${getStrapiUrl()}/api/products?${params}`, {
      headers: getHeaders(),
      next: { revalidate: 60 },
    })

    if (!response.ok) return null

    const payload = (await response.json()) as StrapiListResponse
    const products = payload.data?.map(normalizeProduct).filter(Boolean) as StoreProduct[] | undefined

    return products?.length ? products : null
  } catch {
    return null
  }
}

export async function getStoreProducts(): Promise<StoreProduct[]> {
  const products = await fetchStrapiProducts()
  return products || seedProducts
}

export async function getStoreProduct(slug: string): Promise<StoreProduct | null> {
  const products = await getStoreProducts()
  return products.find((product) => product.slug === slug) || null
}
