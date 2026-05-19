import type { Metadata } from 'next'

import { ProductGrid } from '@/components/product-grid'
import { Footer, Header } from '@/components/site-shell'
import { seedProducts } from '@/lib/seed-data'

export const metadata: Metadata = {
  title: 'Каталог матрасов',
  description: 'Каталог ортопедических матрасов UKISH: премиум, детские, базовые и ортопедические модели с доставкой по Казахстану.',
}

export default function CatalogPage() {
  return (
    <div className="site-page">
      <Header />

      <main className="bg-[#faf8f5] py-20">
        <div className="container-wide">
          <div className="border-b border-slate-200 pb-10">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Главная / Каталог</p>
            <h1 className="section-title mt-9 text-[#111827]">Каталог матрасов</h1>
          </div>

          <div className="mt-14">
            <ProductGrid initialProducts={seedProducts} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
