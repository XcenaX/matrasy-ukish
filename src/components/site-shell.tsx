import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

import { Logo } from './logo'

const KASPI_SHOP_URL = 'https://l.kaspi.kz/shop/AchLr5gWyD2QX7N'
const MAIN_PHONE_DISPLAY = '+7 705 388 6887'
const MAIN_PHONE_TEL = '+77053886887'
const B2B_PHONE_DISPLAY = '+7 776 531 2506'
const B2B_PHONE_TEL = '+77765312506'
const RETAIL_PHONE_DISPLAY = '+7 775 514 6461'
const RETAIL_PHONE_TEL = '+77755146461'
const CONTACT_EMAIL = 'Astana.matrasy@gmail.com'

const nav = [
  { href: '/catalog/', label: 'Каталог' },
  { href: '/#collections', label: 'Коллекции' },
  { href: '/#about', label: 'О нас' },
  { href: '/#delivery', label: 'Доставка и оплата' },
  { href: '/#contacts', label: 'Контакты' },
]

export function Header({ transparent = false }: { transparent?: boolean }) {
  return (
    <header className={transparent ? 'absolute inset-x-0 top-0 z-20 text-white' : 'bg-[var(--brown)] text-white'}>
      <div className="container-wide flex h-[92px] items-center justify-between gap-8">
        <Logo light />
        <nav className="hidden items-center gap-10 lg:flex">
          {nav.map((item) => (
            <Link
              className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/90 hover:text-white"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          <a className="hidden text-sm text-white/95 sm:inline" href={`tel:${MAIN_PHONE_TEL}`}>
            {MAIN_PHONE_DISPLAY}
          </a>
          <span className="hidden items-center gap-4 sm:flex">
            <a href={KASPI_SHOP_URL} aria-label="Kaspi" target="_blank" rel="noopener noreferrer">
              <img src="/kaspi.svg" alt="Kaspi" className="h-[18px] w-[18px]" />
            </a>

            <a href="https://wa.me/77053886887" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
              <img src="/whatsapp.svg" alt="WhatsApp" className="h-[18px] w-[18px]" />
            </a>      
          </span>
          <Link aria-label="Корзина" href="/cart/" className="inline-flex">
            <ShoppingBag size={19} />
          </Link>
        </div>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer id="contacts" className="bg-[var(--brown)] text-white">
      <div className="container-wide py-20">
        <div className="grid gap-12 border-b border-white/10 pb-16 md:grid-cols-4">
          <div>
            <Logo light />
            <p className="mt-10 text-sm text-slate-400">Ежедневно с 09:00 до 21:00</p>
            <p className="mt-4 text-sm leading-6 text-slate-400">Алматы, Астана, Усть-Каменогорск, Караганда</p>
            <a className="mt-8 block text-2xl text-white" href={`tel:${MAIN_PHONE_TEL}`}>
              {MAIN_PHONE_DISPLAY}
            </a>
            <a className="mt-5 block text-sm text-slate-300 hover:text-white" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            <div className="mt-7 space-y-3 text-sm text-slate-400">
              <p>
                B2B: <a className="text-white hover:text-[var(--gold)]" href={`tel:${B2B_PHONE_TEL}`}>{B2B_PHONE_DISPLAY}</a> Магжан
              </p>
              <p>
                Розница: <a className="text-white hover:text-[var(--gold)]" href={`tel:${RETAIL_PHONE_TEL}`}>{RETAIL_PHONE_DISPLAY}</a> Анеля
              </p>
            </div>
          </div>
          <FooterColumn
            title="Каталог"
            items={[
              { label: 'Все матрасы', href: '/catalog/' },
              { label: 'Премиум коллекция', href: '/catalog/' },
              { label: 'Ортопедические', href: '/catalog/' },
              { label: 'Детские матрасы', href: '/catalog/' },
              { label: 'Аксессуары для сна', href: '/catalog/' },
            ]}
          />
          <FooterColumn
            title="Клиентам"
            items={[
              { label: 'О компании', href: '/catalog/' },
              { label: 'Доставка и оплата', href: '/catalog/' },
              { label: 'Гарантия и возврат', href: '/catalog/' },
              { label: 'Рассрочка', href: '/catalog/' },
              { label: 'Отзывы покупателей', href: '/catalog/' },
            ]}
          />
          <FooterColumn
            title="Мы в соцсетях"
            items={[
              { label: 'Instagram', href: 'https://www.instagram.com/ukish_mattress', icon: '/instagram.svg' },
              { label: 'TikTok', href: 'https://www.tiktok.com/@ukish_mattress1', icon: '/tiktok.svg' },
              { label: 'WhatsApp', href: `https://wa.me/${MAIN_PHONE_TEL.replace('+', '')}`, icon: '/whatsapp.svg' },
            ]}
          />
        </div>
        <div className="flex flex-col gap-4 pt-10 text-[10px] text-white/30 md:flex-row md:items-center md:justify-between">
          <p>© 2026 UKISH MATTRESS. Все права защищены.</p>
          <div className="flex gap-8">
            <Link href="/privacy/">Политика конфиденциальности</Link>
            <Link href="/offer/">Договор оферты</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  items,
}: {
  title: string
  items: { label: string; href: string; icon?: string }[]
}) {
  return (
    <div>
      <h3 className="eyebrow">{title}</h3>
      <ul className="mt-9 space-y-5 text-sm text-slate-400">
        {items.map((item) => {
          const external = item.href.startsWith('http')
          const content = (
            <span className="inline-flex items-center gap-3 hover:text-white">
              {item.icon && <img src={item.icon} alt="" className="h-[18px] w-[18px]" />}
              {item.label}
            </span>
          )
          return (
            <li key={item.label}>
              {external ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              ) : (
                <Link href={item.href}>{content}</Link>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
