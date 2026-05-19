import { Check } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

import { Footer, Header } from '@/components/site-shell'

export const metadata: Metadata = {
  title: 'Заказ принят',
  robots: { index: false, follow: false },
}

export default function ConfirmPage() {
  return (
    <div className="site-page">
      <Header />
      <main className="flex min-h-[590px] items-center justify-center bg-[#faf8f5] px-6 py-20">
        <section className="w-full max-w-[512px] bg-white px-12 py-16 text-center shadow-2xl shadow-black/15">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--gold)] text-[var(--gold)]">
            <Check size={30} />
          </div>
          <h1 className="serif mt-10 text-4xl text-[#111827]">Спасибо за заказ!</h1>
          <p className="mt-6 text-base leading-7 text-slate-500">
            Ваш заказ успешно оформлен. Наш менеджер свяжется с вами в течение 10 минут для подтверждения деталей доставки.
          </p>
          <Link href="/" className="btn-primary mt-10">
            На главную
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
