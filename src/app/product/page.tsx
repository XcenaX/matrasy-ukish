import { Suspense } from 'react'
import type { Metadata } from 'next'

import { ProductClient } from './product-client'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Товар',
  description: 'Карточка матраса UKISH Mattress с размерами, ценой и описанием.',
  robots: { index: false, follow: true },
}

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#faf8f5]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--gold)] border-t-transparent" />
        </div>
      }
    >
      <ProductClient />
    </Suspense>
  )
}
