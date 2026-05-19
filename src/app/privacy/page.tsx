import type { Metadata } from 'next'

import { Footer, Header } from '@/components/site-shell'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  description: 'Политика обработки персональных данных клиентов UKISH Mattress.',
  alternates: {
    canonical: '/privacy/',
  },
}

export default function PrivacyPage() {
  return (
    <div className="site-page">
      <Header />
      <main className="bg-[#faf8f5] py-20">
        <article className="container-wide max-w-4xl">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">UKISH Mattress</p>
          <h1 className="section-title mt-8 text-[#111827]">Политика конфиденциальности</h1>
          <div className="mt-10 space-y-7 text-base leading-8 text-slate-600">
            <p>
              Мы используем данные, которые клиент оставляет на сайте, только для обработки заявки,
              консультации, оформления заказа, доставки и обратной связи.
            </p>
            <p>
              Обычно это имя, номер телефона, выбранный товар, размер, адрес доставки и комментарий
              к заказу. Эти данные не публикуются и не передаются третьим лицам, кроме случаев,
              когда это нужно для выполнения заказа или требуется законом.
            </p>
            <p>
              Сайт может использовать технические cookie и аналитику, чтобы корректно работать,
              сохранять корзину и улучшать качество сервиса.
            </p>
            <p>
              По вопросам удаления или уточнения персональных данных можно связаться с нами через
              контакты, указанные на сайте.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
