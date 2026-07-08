"use client"

import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw, ShieldCheck, Truck, X } from 'lucide-react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { AddToCart } from '@/components/add-to-cart'
import { Footer, Header } from '@/components/site-shell'
import { fetchProductFromStrapi } from '@/lib/products'
import { formatPrice, type StoreProduct } from '@/lib/seed-data'

type ProductClientProps = {
  initialSlug?: string
  initialProduct?: StoreProduct | null
}

export function ProductClient({ initialSlug = '', initialProduct = null }: ProductClientProps) {
  const searchParams = useSearchParams()
  const slug = initialSlug || searchParams.get('slug') || ''
  const [product, setProduct] = useState<StoreProduct | null>(initialProduct)
  const [loading, setLoading] = useState(!initialProduct)
  const [selectedSize, setSelectedSize] = useState(getDefaultSize(initialProduct))
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const galleryImages = useMemo(() => {
    if (!product) return []
    return Array.from(new Set([product.image, ...product.gallery].filter(Boolean)))
  }, [product])

  useEffect(() => {
    if (!slug) {
      setProduct(null)
      setLoading(false)
      return
    }

    if (!initialProduct || initialProduct.slug !== slug) {
      setLoading(true)
    }

    let isMounted = true
    fetchProductFromStrapi(slug).then((p) => {
      if (!isMounted) return
      setProduct(p || initialProduct)
      setLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [initialProduct, slug])

  useEffect(() => {
    setSelectedSize(getDefaultSize(product))
    setActiveImageIndex(0)
    setIsLightboxOpen(false)
  }, [product?.id])

  useEffect(() => {
    if (!isLightboxOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsLightboxOpen(false)
      if (event.key === 'ArrowLeft') setActiveImageIndex((index) => getPreviousIndex(index, galleryImages.length))
      if (event.key === 'ArrowRight') setActiveImageIndex((index) => getNextIndex(index, galleryImages.length))
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [galleryImages.length, isLightboxOpen])

  const selected = product?.sizes.find((size) => size.size === selectedSize)
  const displayedPrice = selected?.price ?? product?.price
  const activeImage = galleryImages[activeImageIndex] || product?.image

  const showPreviousImage = () => {
    setActiveImageIndex((index) => getPreviousIndex(index, galleryImages.length))
  }

  const showNextImage = () => {
    setActiveImageIndex((index) => getNextIndex(index, galleryImages.length))
  }

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
                <div className="lg:sticky lg:top-8 lg:self-start">
                  <button
                    type="button"
                    className="relative block aspect-[1.27] w-full overflow-hidden bg-slate-100"
                    onClick={() => setIsLightboxOpen(true)}
                    aria-label="Открыть фото на весь экран"
                  >
                    {activeImage ? <Image src={activeImage} alt={product.title} fill priority className="object-cover" /> : null}
                  </button>

                  {galleryImages.length > 1 ? (
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        type="button"
                        className="grid h-11 w-11 shrink-0 place-items-center border border-[var(--gold)]/40 bg-white text-[#111827]"
                        onClick={showPreviousImage}
                        aria-label="Предыдущее фото"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <div className="flex flex-1 snap-x gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {galleryImages.map((image, index) => (
                          <button
                            key={image}
                            type="button"
                            className={`relative aspect-[1.75] w-36 shrink-0 snap-start overflow-hidden border bg-slate-100 ${
                              activeImageIndex === index ? 'border-[var(--gold)] ring-2 ring-[var(--gold)]/20' : 'border-[var(--gold)]/30'
                            }`}
                            onClick={() => setActiveImageIndex(index)}
                            aria-label={`Показать фото ${index + 1}`}
                          >
                            <Image src={image} alt={`${product.title} фото ${index + 1}`} fill className="object-cover" />
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="grid h-11 w-11 shrink-0 place-items-center border border-[var(--gold)]/40 bg-white text-[#111827]"
                        onClick={showNextImage}
                        aria-label="Следующее фото"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  ) : null}

                  {product.reviewVideo ? (
                    <div className="mt-4 overflow-hidden bg-black">
                      <video className="aspect-video w-full" controls preload="metadata">
                        <source src={product.reviewVideo} />
                      </video>
                    </div>
                  ) : null}
                </div>

                <div>
                  <p className="eyebrow text-slate-400">{product.collectionLabel}</p>
                  <h1 className="serif mt-10 text-[clamp(44px,5vw,64px)] leading-tight text-[#111827]">{product.title}</h1>
                  <div className="mt-8 flex flex-wrap items-end gap-5">
                    {displayedPrice ? <span className="text-4xl font-medium text-[#111827]">{formatPrice(displayedPrice)}</span> : null}
                    {product.oldPrice ? <span className="text-xl text-slate-400 line-through">{formatPrice(product.oldPrice)}</span> : null}
                  </div>
                  <div className="mt-10">
                    <AddToCart product={product} selectedSize={selectedSize} onSelectedSizeChange={setSelectedSize} />
                  </div>
                  <ProductDescription text={product.description} />
                  {product.details?.length ? <ProductDetails details={product.details} /> : null}
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

              {isLightboxOpen && activeImage ? (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true">
                  <button
                    type="button"
                    className="absolute right-4 top-4 grid h-12 w-12 place-items-center bg-white/10 text-white hover:bg-white/20"
                    onClick={() => setIsLightboxOpen(false)}
                    aria-label="Закрыть"
                  >
                    <X size={24} />
                  </button>
                  {galleryImages.length > 1 ? (
                    <button
                      type="button"
                      className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center bg-white/10 text-white hover:bg-white/20"
                      onClick={showPreviousImage}
                      aria-label="Предыдущее фото"
                    >
                      <ChevronLeft size={28} />
                    </button>
                  ) : null}
                  <div className="relative h-[82vh] w-[min(96vw,1280px)]">
                    <Image src={activeImage} alt={product.title} fill className="object-contain" sizes="96vw" />
                  </div>
                  {galleryImages.length > 1 ? (
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center bg-white/10 text-white hover:bg-white/20"
                      onClick={showNextImage}
                      aria-label="Следующее фото"
                    >
                      <ChevronRight size={28} />
                    </button>
                  ) : null}
                </div>
              ) : null}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

function getDefaultSize(product: StoreProduct | null) {
  return product?.sizes[3]?.size || product?.sizes[0]?.size || ''
}

function getPreviousIndex(index: number, length: number) {
  if (length <= 1) return 0
  return (index - 1 + length) % length
}

function getNextIndex(index: number, length: number) {
  if (length <= 1) return 0
  return (index + 1) % length
}

function ProductDetails({ details }: { details: NonNullable<StoreProduct['details']> }) {
  return (
    <div className="mt-10 border-t border-slate-200 pt-10">
      <h2 className="serif text-3xl text-[#111827]">Детали</h2>
      <dl className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
        {details.map((detail) => (
          <div key={`${detail.label}-${detail.value}`} className="grid grid-cols-[minmax(120px,0.8fr)_1fr] gap-6 py-4 text-sm">
            <dt className="text-slate-500">{detail.label}</dt>
            <dd className="font-medium text-[#111827]">{detail.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function ProductDescription({ text }: { text: string }) {
  const blocks = parseMarkdownBlocks(text)

  return (
    <div className="mt-10 border-b border-slate-200 pb-10 text-base leading-8 text-slate-600">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return (
            <h2 key={index} className="serif mb-4 mt-8 text-3xl leading-tight text-[#111827] first:mt-0">
              {renderInlineMarkdown(block.text)}
            </h2>
          )
        }

        if (block.type === 'list') {
          return (
            <ul key={index} className="my-4 list-disc space-y-2 pl-5">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInlineMarkdown(item)}</li>
              ))}
            </ul>
          )
        }

        return (
          <p key={index} className="mb-4 last:mb-0">
            {renderInlineMarkdown(block.text)}
          </p>
        )
      })}
    </div>
  )
}

type MarkdownBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }

function parseMarkdownBlocks(text: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = []
  const lines = text.split(/\r?\n/)
  let paragraph: string[] = []
  let listItems: string[] = []

  const flushParagraph = () => {
    if (!paragraph.length) return
    blocks.push({ type: 'paragraph', text: paragraph.join(' ') })
    paragraph = []
  }

  const flushList = () => {
    if (!listItems.length) return
    blocks.push({ type: 'list', items: listItems })
    listItems = []
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      flushParagraph()
      flushList()
      continue
    }

    const heading = trimmed.match(/^#{1,3}\s+(.+)$/)
    if (heading) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'heading', text: heading[1] })
      continue
    }

    const listItem = trimmed.match(/^[-*]\s+(.+)$/)
    if (listItem) {
      flushParagraph()
      listItems.push(listItem[1])
      continue
    }

    flushList()
    paragraph.push(trimmed)
  }

  flushParagraph()
  flushList()

  return blocks.length ? blocks : [{ type: 'paragraph', text }]
}

function renderInlineMarkdown(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))

    const token = match[0]
    if (token.startsWith('**')) {
      nodes.push(
        <strong key={`${match.index}-${token}`} className="font-semibold text-[#111827]">
          {token.slice(2, -2)}
        </strong>,
      )
    } else {
      nodes.push(
        <em key={`${match.index}-${token}`} className="italic">
          {token.slice(1, -1)}
        </em>,
      )
    }

    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

const fallbackBenefits = [
  { title: 'Гарантия 60 месяцев', text: 'Официальная гарантия от производителя' },
  { title: 'Бесплатная доставка', text: 'По всему Казахстану до двери' },
  { title: 'Сертифицированные материалы', text: 'Качественные ткани и наполнители для ежедневного сна' },
]
