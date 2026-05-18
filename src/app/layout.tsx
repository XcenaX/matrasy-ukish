import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'UKISH Mattress - ортопедические матрасы в Казахстане',
    template: '%s | UKISH Mattress',
  },
  description:
    'Премиальные ортопедические матрасы UKISH с собственным производством, доставкой по Казахстану и гарантией до 10 лет.',
  openGraph: {
    title: 'UKISH Mattress',
    description: 'Премиальные ортопедические матрасы с доставкой по Казахстану.',
    siteName: 'UKISH Mattress',
    locale: 'ru_KZ',
    type: 'website',
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
