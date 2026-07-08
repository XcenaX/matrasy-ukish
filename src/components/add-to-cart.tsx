"use client"

import { ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useCartStore } from '@/lib/cart-store'
import { formatPrice, type StoreProduct } from '@/lib/seed-data'

type AddToCartProps = {
  product: StoreProduct
  selectedSize: string
  onSelectedSizeChange: (size: string) => void
}

export function AddToCart({ product, selectedSize, onSelectedSizeChange }: AddToCartProps) {
  const addItem = useCartStore((state) => state.addItem)
  const router = useRouter()
  const selected = product.sizes.find((size) => size.size === selectedSize) || product.sizes[0]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.18em] text-[#111827]">Размер (см)</span>
        <button type="button" className="text-xs text-slate-500 underline">
          Таблица размеров
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {product.sizes.map((item) => (
          <button
            key={item.size}
            type="button"
            onClick={() => onSelectedSizeChange(item.size)}
            className={`h-12 border text-sm ${
              selectedSize === item.size
                ? 'border-[var(--gold)] bg-[#f7f0e8] text-[var(--gold)]'
                : 'border-slate-200 bg-white text-slate-600 hover:border-[var(--gold)]'
            }`}
          >
            {item.size}
          </button>
        ))}
      </div>
      <button
        className="btn-primary mt-10 w-full"
        type="button"
        onClick={() => {
          addItem({
            productId: product.id,
            slug: product.slug,
            title: product.title,
            collectionLabel: product.collectionLabel,
            image: product.image,
            size: selected?.size || selectedSize,
            price: selected?.price || product.price,
          })
          router.push('/cart/')
        }}
      >
        <ShoppingBag size={16} />
        В корзину
      </button>
      {selected ? <p className="mt-3 text-center text-xs text-slate-400">Цена выбранного размера: {formatPrice(selected.price)}</p> : null}
    </div>
  )
}
