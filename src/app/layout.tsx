import type { Metadata } from 'next'

import { fetchContactsFromStrapi, telFromPhone } from '@/lib/contacts'

import './globals.css'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'UKISH Mattress - ортопедические матрасы в Казахстане',
    template: '%s | UKISH Mattress',
  },
  description:
    'Премиальные ортопедические матрасы UKISH с собственным производством, доставкой по Казахстану, включая Астану, Усть-Каменогорск и Караганду.',
  keywords: [
    'матрасы Астана',
    'матрасы Усть-Каменогорск',
    'матрасы Караганда',
    'ортопедические матрасы',
    'матрасы Казахстан',
    'UKISH Mattress',
    'купить матрас',
  ],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon-ukish.ico',
    shortcut: '/favicon-ukish.ico',
  },
  openGraph: {
    title: 'UKISH Mattress',
    description: 'Премиальные ортопедические матрасы с доставкой по Казахстану, включая Астану, Усть-Каменогорск и Караганду.',
    url: '/',
    siteName: 'UKISH Mattress',
    locale: 'ru_KZ',
    type: 'website',
    images: [
      {
        url: '/assets/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'UKISH Mattress',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UKISH Mattress',
    description: 'Премиальные ортопедические матрасы с доставкой по Казахстану, включая Астану, Усть-Каменогорск и Караганду.',
    images: ['/assets/hero.jpg'],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const contacts = await fetchContactsFromStrapi()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FurnitureStore',
    name: 'UKISH Mattress',
    description:
      'Собственное производство ортопедических матрасов в Казахстане с доставкой по Астане, Караганде и Усть-Каменогорску.',
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/assets/hero.jpg`,
    telephone: telFromPhone(contacts.mainPhone),
    email: contacts.email,
    priceRange: '₸₸',
    openingHours: 'Mo-Su 10:00-20:00',
    sameAs: [contacts.instagramUrl, contacts.tiktokUrl].filter(Boolean),
    address: contacts.addresses.map((address) => ({
      '@type': 'PostalAddress',
      streetAddress: address.lines.join(', '),
      addressLocality: address.city.replace(/^г\.\s*/, ''),
      addressCountry: 'KZ',
    })),
    areaServed: contacts.cityPhones.map((item) => item.city),
  }

  return (
    <html className="h-full antialiased" lang="ru">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  )
}
