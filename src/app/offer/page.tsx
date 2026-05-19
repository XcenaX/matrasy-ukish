import type { Metadata } from 'next'

import { Footer, Header } from '@/components/site-shell'

export const metadata: Metadata = {
  title: 'Договор оферты',
  description: 'Условия заказа, оплаты и доставки матрасов UKISH Mattress.',
  alternates: {
    canonical: '/offer/',
  },
}

export default function OfferPage() {
  return (
    <div className="site-page">
      <Header />
      <main className="bg-[#faf8f5] py-20">
        <article className="container-wide max-w-4xl">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">UKISH Mattress</p>
          <h1 className="section-title mt-8 text-[#111827]">Договор оферты</h1>
          <div className="mt-10 space-y-7 text-base leading-8 text-slate-600">
            <p>
              Оформляя заявку на сайте, клиент подтверждает намерение приобрести выбранный товар и
              соглашается с условиями консультации, оплаты, изготовления и доставки.
            </p>
            <p>
              Итоговая стоимость заказа зависит от модели, размера, комплектации, адреса доставки и
              дополнительных услуг. Менеджер подтверждает цену и сроки перед запуском заказа в работу.
            </p>
            <p>
              Оплата, рассрочка, доставка, подъем и возможный обмен согласуются индивидуально с
              клиентом до передачи товара.
            </p>
            <p>
              Гарантийные условия действуют на товары UKISH Mattress при соблюдении правил
              эксплуатации и подтверждаются менеджером при оформлении заказа.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
