"use client"

import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { useCartStore } from '@/lib/cart-store'
import { formatPrice } from '@/lib/seed-data'

const WHATSAPP_PHONE = '77053886887'

const PAYMENT_LABELS: Record<string, string> = {
  card_on_delivery: 'Картой при получении',
  kaspi: 'Kaspi Рассрочка 0-0-12',
  cash: 'Наличными курьеру',
}

export function CheckoutClient() {
  const [mounted, setMounted] = useState(false)
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card_on_delivery')
  const items = useCartStore((state) => state.items)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  useEffect(() => setMounted(true), [])

  const isFormFilled = city.trim().length > 0 && address.trim().length > 0

  function buildWhatsAppUrl() {
    const lines: string[] = ['*Заявка на заказ матраса*', '']
    lines.push('*Товары:*')
    for (const item of items) {
      lines.push(`• ${item.title}, ${item.size} см × ${item.quantity} шт. — ${formatPrice(item.price * item.quantity)}`)
    }
    lines.push('')
    lines.push(`*Город:* ${city.trim()}`)
    lines.push(`*Адрес:* ${address.trim()}`)
    lines.push(`*Способ оплаты:* ${PAYMENT_LABELS[paymentMethod]}`)
    lines.push('')
    lines.push(`*Итого: ${formatPrice(total)}*`)
    const text = encodeURIComponent(lines.join('\n'))
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`
  }

  if (!mounted || items.length === 0) {
    return (
      <div className="bg-white p-12 text-center">
        <h2 className="serif text-3xl">Нет товаров для оформления</h2>
        <Link href="/catalog" className="btn-primary mt-8">
          Вернуться в каталог
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-16 lg:grid-cols-[1fr_470px]">
      <div className="bg-white p-10 md:p-12">
        <h2 className="serif text-3xl text-[#111827]">Доставка</h2>
        <div className="mt-6 h-px bg-slate-100" />
        <div className="mt-8 grid gap-6">
          <Field label="Город *" placeholder="Алматы" value={city} onChange={setCity} />
          <Field label="Адрес (улица, дом, квартира) *" placeholder="ул. Абая, д. 1, кв. 1" value={address} onChange={setAddress} />
        </div>

        <h2 className="serif mt-14 text-3xl text-[#111827]">Способ оплаты</h2>
        <div className="mt-6 h-px bg-slate-100" />
        <div className="mt-6 grid gap-4">
          {Object.entries(PAYMENT_LABELS).map(([value, label]) => (
            <button
              className={`border px-8 py-5 text-left ${paymentMethod === value ? 'border-[var(--gold)] bg-[#f7f0e8]' : 'border-slate-200'}`}
              key={value}
              onClick={() => setPaymentMethod(value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        {isFormFilled ? (
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-12 flex w-full items-center justify-center gap-3"
          >
            <WhatsAppIcon />
            Отправить заявку в WhatsApp
          </a>
        ) : (
          <button
            disabled
            type="button"
            className="btn-primary mt-12 w-full cursor-not-allowed opacity-40"
          >
            <WhatsAppIcon />
            Отправить заявку в WhatsApp
          </button>
        )}
        {!isFormFilled && (
          <p className="mt-3 text-center text-xs text-slate-400">Заполните город и адрес, чтобы продолжить</p>
        )}
      </div>

      <aside className="h-fit bg-white p-10">
        <h2 className="serif text-3xl text-[#111827]">Ваш заказ</h2>
        <div className="mt-8 space-y-6 border-b border-slate-100 pb-8">
          {items.map((item) => (
            <div className="flex items-center gap-4" key={`${item.productId}:${item.size}`}>
              <div className="relative h-12 w-12 rounded-md bg-slate-100">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-[#111827]">{item.title}</p>
                <p className="text-xs text-slate-400">{item.quantity} шт.</p>
              </div>
              <span className="text-sm">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 space-y-5 border-b border-slate-100 pb-8 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Товары ({items.length})</span>
            <span>{formatPrice(total)}</span>
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
      </aside>
    </div>
  )
}

function Field({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</span>
      <input
        className="mt-3 h-14 w-full border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[var(--gold)]"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

export function BackToCart() {
  return (
    <Link href="/cart" className="mb-8 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-slate-500">
      <ArrowLeft size={14} /> Назад в корзину
    </Link>
  )
}
