"use client"

import { ArrowRight, Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { cartKey, useCartStore } from '@/lib/cart-store'
import { formatPrice } from '@/lib/seed-data'

export function CartClient() {
  const [mounted, setMounted] = useState(false)
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <CartEmpty />
  if (items.length === 0) return <CartEmpty />

  return (
    <div className="grid gap-16 lg:grid-cols-[1fr_470px]">
      <div>
        <div className="grid grid-cols-[1fr_150px_160px] border-b border-slate-200 pb-5 text-[11px] uppercase tracking-[0.18em] text-slate-400">
          <span>Товар</span>
          <span className="text-center">Количество</span>
          <span className="text-right">Сумма</span>
        </div>
        <div className="divide-y divide-slate-100">
          {items.map((item) => {
            const key = cartKey(item)
            return (
              <div className="grid grid-cols-[1fr_150px_160px] items-center py-8" key={key}>
                <div className="flex gap-6">
                  <div className="relative h-24 w-24 bg-slate-100">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="eyebrow text-slate-400">{item.collectionLabel}</p>
                    <h2 className="serif mt-2 text-2xl text-[#111827]">{item.title}</h2>
                    <p className="mt-2 text-sm text-slate-500">Размер: {item.size} см</p>
                    <button className="mt-3 inline-flex items-center gap-2 text-xs text-red-400" onClick={() => removeItem(key)} type="button">
                      <Trash2 size={13} /> Удалить
                    </button>
                  </div>
                </div>
                <div className="mx-auto flex h-10 w-28 items-center justify-between border border-slate-200 px-3">
                  <button type="button" onClick={() => setQuantity(key, item.quantity - 1)}>
                    <Minus size={14} />
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => setQuantity(key, item.quantity + 1)}>
                    <Plus size={14} />
                  </button>
                </div>
                <p className="text-right text-lg font-medium">{formatPrice(item.price * item.quantity)}</p>
              </div>
            )
          })}
        </div>
      </div>
      <Summary total={total} count={items.length} />
    </div>
  )
}

function CartEmpty() {
  return (
    <div className="bg-white p-12 text-center">
      <h2 className="serif text-3xl">Корзина пока пустая</h2>
      <p className="mt-4 text-slate-500">Добавьте матрас из каталога, чтобы оформить заказ.</p>
      <Link href="/catalog" className="btn-primary mt-8">
        Перейти в каталог
      </Link>
    </div>
  )
}

function Summary({ total, count }: { total: number; count: number }) {
  return (
    <aside className="h-fit bg-white p-10">
      <h2 className="serif text-3xl text-[#111827]">Итого</h2>
      <div className="mt-9 space-y-5 border-b border-slate-100 pb-8 text-sm text-slate-600">
        <div className="flex justify-between">
          <span>Товары ({count})</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-red-400">
          <span>Скидка</span>
          <span>-47 000 ₸</span>
        </div>
        <div className="flex justify-between">
          <span>Доставка</span>
          <span>Бесплатно</span>
        </div>
      </div>
      <div className="mt-9 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.2em]">К оплате</span>
        <span className="serif text-3xl">{formatPrice(total)}</span>
      </div>
      <Link href="/checkout" className="btn-primary mt-10 w-full">
        Оформить заказ <ArrowRight size={16} />
      </Link>
      <p className="mt-5 text-center text-xs text-slate-400">Доступна оплата в рассрочку</p>
    </aside>
  )
}
