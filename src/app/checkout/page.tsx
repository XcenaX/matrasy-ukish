import type { Metadata } from 'next'

import { Footer, Header } from '@/components/site-shell'

import { BackToCart, CheckoutClient } from './checkout-client'

export const metadata: Metadata = {
  title: 'Оформление заказа',
  robots: { index: false, follow: true },
}

export default function CheckoutPage() {
  return (
    <div className="site-page">
      <Header />
      <main className="bg-[#faf8f5] py-20">
        <div className="container-wide">
          <BackToCart />
          <h1 className="section-title border-b border-slate-200 pb-10 text-[#111827]">Оформление заказа</h1>
          <div className="mt-14">
            <CheckoutClient />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
