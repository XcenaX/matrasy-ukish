import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { formatPrice, getProductDisplayPrice, type StoreProduct } from '@/lib/seed-data'

export function ProductCard({ product }: { product: StoreProduct }) {
  const image = product.image || '/assets/diamond-prime.jpg'

  return (
    <Link href={`/product/?slug=${encodeURIComponent(product.slug)}`} className="group block bg-white">
      <div className="relative aspect-[1.22] overflow-hidden bg-slate-100">
        <Image
          src={image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, 366px"
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="p-6">
        <p className="eyebrow text-slate-400">{product.collectionLabel}</p>
        <h3 className="serif mt-4 text-[26px] leading-tight text-[#111827]">{product.title}</h3>
        <p className="mt-3 min-h-[44px] text-sm leading-6 text-slate-500">{product.shortDescription}</p>
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
          <span className="text-sm font-semibold text-[#111827]">от {formatPrice(getProductDisplayPrice(product))}</span>
          <ArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-[var(--gold)]" size={18} />
        </div>
      </div>
    </Link>
  )
}
