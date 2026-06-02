import type { Metadata } from 'next'

import './globals.css'

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className="h-full antialiased" lang="ru">
      <body>{children}</body>
    </html>
  )
}
