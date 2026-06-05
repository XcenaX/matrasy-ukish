import { getStrapiPublicUrl } from './products'

type StrapiMedia = {
  url?: string | null
  alternativeText?: string | null
  mime?: string | null
  data?: StrapiMediaLike | StrapiMediaLike[] | null
  attributes?: StrapiMedia | null
}

type StrapiMediaLike = string | StrapiMedia | null | undefined

type StrapiLandingSetting = {
  productionVideo?: StrapiMediaLike
  productionFallbackImage?: StrapiMediaLike
  productionAlt?: string | null
  attributes?: StrapiLandingSetting
}

type StrapiReview = {
  id?: string | number
  documentId?: string
  name?: string
  city?: string | null
  text?: string
  rating?: number | null
  photos?: StrapiMediaLike[] | StrapiMedia | null
  active?: boolean | null
  sortOrder?: number | null
  attributes?: StrapiReview
}

type StrapiListResponse<T> = {
  data?: T[]
}

type StrapiSingleResponse<T> = {
  data?: T | null
}

export type LandingMedia = {
  url: string
  alt?: string
  mime?: string
}

export type CustomerReview = {
  id: string
  name: string
  city?: string
  text: string
  rating: number
  photos: LandingMedia[]
  sortOrder?: number
}

export type LandingSettings = {
  productionVideo?: LandingMedia | null
  productionFallbackImage: LandingMedia
  productionAlt: string
}

export const fallbackLandingSettings: LandingSettings = {
  productionVideo: null,
  productionFallbackImage: {
    url: '/assets/production.jpg',
    alt: 'Производство матрасов UKISH',
    mime: 'image/jpeg',
  },
  productionAlt: 'Производство матрасов UKISH',
}

export const fallbackReviews: CustomerReview[] = [
  {
    id: 'aigerim',
    name: 'Айгерим',
    city: 'Караганда',
    text: 'Купили матрас Diamond Prime. Спим уже месяц, спина перестала болеть. Очень качественные материалы, сервис на высшем уровне.',
    rating: 5,
    photos: [],
    sortOrder: 10,
  },
  {
    id: 'maksat',
    name: 'Максат',
    city: 'Астана',
    text: 'Доставили день в день, как и обещали. Матрас Smart оказался идеальной жёсткости. Спасибо консультанту за помощь в выборе.',
    rating: 5,
    photos: [],
    sortOrder: 20,
  },
  {
    id: 'elena',
    name: 'Елена',
    city: 'Шымкент',
    text: 'Заказывали матрас для ребёнка из коллекции Kids. Нет никакого запаха, чехол приятный на ощупь. Ребёнок спит отлично.',
    rating: 5,
    photos: [],
    sortOrder: 30,
  },
]

function resolveMedia(media: StrapiMediaLike, fallbackUrl?: string): LandingMedia | null {
  if (!media) {
    return fallbackUrl ? { url: fallbackUrl } : null
  }

  if (typeof media === 'string') {
    return { url: media }
  }

  if (Array.isArray(media.data)) {
    return resolveMedia(media.data[0], fallbackUrl)
  }

  if (media.data) return resolveMedia(media.data, fallbackUrl)
  if (media.attributes) return resolveMedia(media.attributes, fallbackUrl)

  if (!media.url) {
    return fallbackUrl ? { url: fallbackUrl } : null
  }

  return {
    url: media.url.startsWith('/') ? `${getStrapiPublicUrl()}${media.url}` : media.url,
    alt: media.alternativeText || undefined,
    mime: media.mime || undefined,
  }
}

function resolveMediaList(media: StrapiReview['photos']): LandingMedia[] {
  if (!media) return []
  if (Array.isArray(media)) return media.map((item) => resolveMedia(item)).filter(Boolean) as LandingMedia[]
  if (Array.isArray(media.data)) return media.data.map((item) => resolveMedia(item)).filter(Boolean) as LandingMedia[]

  const single = resolveMedia(media)
  return single ? [single] : []
}

function normalizeReview(rawReview: StrapiReview): CustomerReview | null {
  const review = rawReview.attributes || rawReview
  if (!review.name || !review.text) return null

  return {
    id: String(review.documentId || review.id || review.name),
    name: review.name,
    city: review.city || undefined,
    text: review.text,
    rating: Math.min(Math.max(review.rating || 5, 1), 5),
    photos: resolveMediaList(review.photos),
    sortOrder: review.sortOrder || undefined,
  }
}

function normalizeLandingSettings(rawSettings?: StrapiLandingSetting | null): LandingSettings {
  const settings = rawSettings?.attributes || rawSettings
  const fallbackImage = resolveMedia(settings?.productionFallbackImage, fallbackLandingSettings.productionFallbackImage.url)
  const video = resolveMedia(settings?.productionVideo)
  const alt = settings?.productionAlt || fallbackLandingSettings.productionAlt

  return {
    productionVideo: video,
    productionFallbackImage: {
      ...fallbackLandingSettings.productionFallbackImage,
      ...fallbackImage,
      alt,
    },
    productionAlt: alt,
  }
}

export async function fetchLandingSettingsFromStrapi(): Promise<LandingSettings> {
  const params = new URLSearchParams()
  params.set('populate[productionVideo]', 'true')
  params.set('populate[productionFallbackImage]', 'true')

  try {
    const response = await fetch(`${getStrapiPublicUrl()}/api/landing-setting?${params}`)
    if (!response.ok) return fallbackLandingSettings

    const payload = (await response.json()) as StrapiSingleResponse<StrapiLandingSetting>
    return normalizeLandingSettings(payload.data)
  } catch {
    return fallbackLandingSettings
  }
}

export async function fetchReviewsFromStrapi(): Promise<CustomerReview[]> {
  const params = new URLSearchParams({
    'filters[active][$eq]': 'true',
    'pagination[pageSize]': '100',
    sort: 'sortOrder:asc',
  })
  params.set('populate[photos]', 'true')

  try {
    const response = await fetch(`${getStrapiPublicUrl()}/api/reviews?${params}`)
    if (!response.ok) return fallbackReviews

    const payload = (await response.json()) as StrapiListResponse<StrapiReview>
    const reviews = payload.data?.map(normalizeReview).filter(Boolean) as CustomerReview[] | undefined
    return reviews?.length ? reviews : fallbackReviews
  } catch {
    return fallbackReviews
  }
}
