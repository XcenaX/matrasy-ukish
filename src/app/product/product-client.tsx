"use client"

import { RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { AddToCart } from '@/components/add-to-cart'
import { Footer, Header } from '@/components/site-shell'
import { fetchProductFromStrapi } from '@/lib/products'
import { formatPrice, type StoreProduct } from '@/lib/seed-data'

export function ProductClient() {
  const searchParams = useSearchParams()
  const slug = searchParams.get('slug') || ''
  const [product, setProduct] = useState<StoreProduct | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) {
      setProduct(null)
      setLoading(false)
      return
    }

    setLoading(true)
    fetchProductFromStrapi(slug).then((p) => {
      setProduct(p)
      setLoading(false)
    })
  }, [slug])

  return (
    <div className="site-page">
      <Header />
      <main className="bg-[#faf8f5] py-16">
        <div className="container-wide">
          {loading && (
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--gold)] border-t-transparent" />
            </div>
          )}

          {!loading && !product && (
            <div className="py-32 text-center">
              <h1 className="serif text-4xl text-[#111827]">Товар не найден</h1>
            </div>
          )}

          {product && (
            <>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Главная / Каталог / {product.title}</p>

              <section className="mt-10 grid gap-16 lg:grid-cols-[1.1fr_0.75fr]">
                <div>
                  <div className="relative aspect-[1.27] bg-slate-100">
                    <Image src={product.image} alt={product.title} fill priority className="object-cover" />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {product.gallery.slice(0, 3).map((image) => (
                      <div key={image} className="relative aspect-[1.75] border border-[var(--gold)]/40 bg-slate-100">
                        <Image src={image} alt={`${product.title} фото`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="eyebrow text-slate-400">{product.collectionLabel}</p>
                  <h1 className="serif mt-10 text-[clamp(44px,5vw,64px)] leading-tight text-[#111827]">{product.title}</h1>
                  <div className="mt-8 flex items-center gap-5">
                    <span className="text-4xl font-medium text-[#111827]">{formatPrice(product.price)}</span>
                    {product.oldPrice ? <span className="text-xl text-slate-400 line-through">{formatPrice(product.oldPrice)}</span> : null}
                  </div>
                  <p className="mt-10 border-b border-slate-200 pb-10 text-base leading-8 text-slate-600">{product.description}</p>
                  <div className="mt-10">
                    <AddToCart product={product} />
                  </div>
                  <div className="mt-10 space-y-6 border-t border-slate-200 pt-10">
                    {(product.benefits.length ? product.benefits : fallbackBenefits).map((benefit, index) => {
                      const Icon = [ShieldCheck, Truck, RotateCcw][index % 3]
                      return (
                        <div key={benefit.title} className="flex gap-5">
                          <Icon className="mt-1 text-[var(--gold)]" size={18} />
                          <div>
                            <h3 className="font-semibold text-[#111827]">{benefit.title}</h3>
                            <p className="mt-1 text-sm text-slate-500">{benefit.text}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

const fallbackBenefits = [
  { title: 'Гарантия до 10 лет', text: 'На пружинный блок и материалы наполнения' },
  { title: 'Бесплатная доставка', text: 'По всему Казахстану до двери' },
  { title: '100 дней на тест', text: 'Не подойдет жесткость - обменяем на другой' },
]
