import { getStrapiPublicUrl } from './products'

export type CityPhone = {
  city: string
  phone: string
}

export type SiteAddress = {
  city: string
  lines: string[]
}

export type SiteContacts = {
  mainPhone: string
  wholesalePhone: string
  email: string
  workHours: string
  whatsappPhone: string
  instagramUrl: string
  tiktokUrl: string
  kaspiUrl: string
  cityPhones: CityPhone[]
  addresses: SiteAddress[]
}

/**
 * Единственный источник правды в коде. Используется и как значения по умолчанию
 * при первом рендере, и как фоллбэк, если Strapi недоступен (сайт не падает).
 */
export const fallbackContacts: SiteContacts = {
  mainPhone: '+7 705 388 6887',
  wholesalePhone: '+7 776 531 2506',
  email: 'Astana.matrasy@gmail.com',
  workHours: 'Ежедневно с 10:00 до 20:00',
  whatsappPhone: '77053886887',
  instagramUrl: 'https://www.instagram.com/ukish_mattress',
  tiktokUrl: 'https://www.tiktok.com/@ukish_mattress1',
  kaspiUrl: 'https://l.kaspi.kz/shop/3vC4nEY6Qcv7Mta',
  cityPhones: [
    { city: 'Астана', phone: '+7 705 388 6887' },
    { city: 'Караганда', phone: '+7 705 433 4001' },
    { city: 'Усть-Каменогорск', phone: '+7 708 527 9247' },
  ],
  addresses: [
    { city: 'г. Астана', lines: ['ул. Ж.Омарова, 150'] },
    { city: 'г. Караганда', lines: ['ул. Республики, 9', 'ТЦ «Kazmart», 1 этаж'] },
  ],
}

/** '+7 705 388 6887' -> '+77053886887' для tel:/wa.me ссылок. */
export function telFromPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return digits ? `+${digits}` : ''
}

/** Цифры без плюса для wa.me ссылок. */
export function whatsappDigits(phone: string): string {
  return phone.replace(/\D/g, '')
}

type StrapiCityPhone = { city?: string | null; phone?: string | null }
type StrapiAddress = { city?: string | null; lines?: string | null }

type StrapiContacts = {
  mainPhone?: string | null
  wholesalePhone?: string | null
  email?: string | null
  workHours?: string | null
  whatsappPhone?: string | null
  instagramUrl?: string | null
  tiktokUrl?: string | null
  kaspiUrl?: string | null
  cityPhones?: StrapiCityPhone[] | null
  addresses?: StrapiAddress[] | null
  attributes?: StrapiContacts
}

function splitLines(value?: string | null): string[] {
  if (!value) return []
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function normalizeContacts(raw?: StrapiContacts | null): SiteContacts {
  const data = raw?.attributes || raw
  if (!data) return fallbackContacts

  const cityPhones = (data.cityPhones || [])
    .map((item) => ({ city: item.city || '', phone: item.phone || '' }))
    .filter((item) => item.city && item.phone)

  const addresses = (data.addresses || [])
    .map((item) => ({ city: item.city || '', lines: splitLines(item.lines) }))
    .filter((item) => item.city && item.lines.length > 0)

  return {
    mainPhone: data.mainPhone || fallbackContacts.mainPhone,
    wholesalePhone: data.wholesalePhone || fallbackContacts.wholesalePhone,
    email: data.email || fallbackContacts.email,
    workHours: data.workHours || fallbackContacts.workHours,
    whatsappPhone: data.whatsappPhone || fallbackContacts.whatsappPhone,
    instagramUrl: data.instagramUrl || fallbackContacts.instagramUrl,
    tiktokUrl: data.tiktokUrl || fallbackContacts.tiktokUrl,
    kaspiUrl: data.kaspiUrl || fallbackContacts.kaspiUrl,
    cityPhones: cityPhones.length ? cityPhones : fallbackContacts.cityPhones,
    addresses: addresses.length ? addresses : fallbackContacts.addresses,
  }
}

export async function fetchContactsFromStrapi(): Promise<SiteContacts> {
  const params = new URLSearchParams()
  params.set('populate[cityPhones]', 'true')
  params.set('populate[addresses]', 'true')

  try {
    const response = await fetch(`${getStrapiPublicUrl()}/api/landing-setting?${params}`)
    if (!response.ok) return fallbackContacts

    const payload = (await response.json()) as { data?: StrapiContacts | null }
    return normalizeContacts(payload.data)
  } catch {
    return fallbackContacts
  }
}
