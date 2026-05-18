import type { Metadata } from 'next'

import { Footer, Header } from '@/components/site-shell'

import { CartClient } from './cart-client'

export const metadata: Metadata = {
  title: 'Корзина',
  robots: { index: false, follow: true },
}

export default function CartPage() {
  return (
    <div className="site-page">
      <Header />
      <main className="bg-[#faf8f5] py-20">
        <div className="container-wide">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Главная / Корзина</p>
          <h1 className="section-title mt-8 border-b border-slate-200 pb-10 text-[#111827]">Ваша корзина</h1>
          <div className="mt-14">
            <CartClient />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
