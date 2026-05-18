import { ArrowRight, BadgePercent, Factory, Gem, ShieldCheck, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { AnimateIn, StaggerItem, StaggerList } from '@/components/animate-in'
import { ConsultForm } from '@/components/consult-form'
import { ProductGrid } from '@/components/product-grid'
import { Footer, Header } from '@/components/site-shell'
import { getStoreProducts } from '@/lib/products'

const features = [
  { icon: Factory, label: 'Собственное производство' },
  { icon: Gem, label: 'Премиальные материалы' },
  { icon: ShieldCheck, label: 'Гарантия до 10 лет' },
  { icon: BadgePercent, label: 'Нагрузка до 200 кг' },
  { icon: Truck, label: 'Бесплатная доставка' },
  { icon: BadgePercent, label: 'Рассрочка 0-0-12' },
]

const reasons = [
  ['01', 'Собственное производство', 'Фабрика UKISH с собственными складами и автопарком для доставки'],
  ['02', 'Бесплатная доставка', 'До кровати в день заказа по всему Казахстану'],
  ['03', 'Гарантия до 60 месяцев', 'Официальная гарантия от производителя'],
  ['04', 'Быстрое изготовление', 'Заказ готов в течение 1-3 дней'],
  ['05', 'Бесплатный замер', 'Наш специалист приедет к вам с образцами материалов'],
  ['06', 'Сертифицированные материалы', 'Все материалы проходят строгий контроль качества'],
  ['07', 'Тест-драйв 100 дней', 'Возможность обмена матраса, если не подошла жесткость'],
  ['08', 'Честные цены', 'На 27% ниже рынка благодаря отсутствию посредников'],
]

const reviews = [
  ['Айгерим', 'г. Алматы', 'Купили матрас Diamond Prime. Спим уже месяц, спина перестала болеть. Очень качественные материалы, сервис на высшем уровне!'],
  ['Максат', 'г. Астана', 'Доставили день в день, как и обещали. Матрас Smart оказался идеальной жесткости. Спасибо консультанту за помощь в выборе.'],
  ['Елена', 'г. Шымкент', 'Заказывали матрас для ребенка из коллекции Kids. Нет никакого запаха, чехол приятный на ощупь. Ребенок спит отлично.'],
]

export default async function Home() {
  const products = await getStoreProducts()

  return (
    <div className="site-page">
      <main className="bg-[#faf8f5]">

        {/* Hero */}
        <section className="relative min-h-[960px] overflow-hidden bg-[var(--brown)] text-white">
          <Image src="/assets/hero.jpg" alt="Премиальный матрас UKISH в спальне" fill priority className="object-cover opacity-75" />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/60 to-transparent" />
          <Header transparent />
          <div className="container-wide relative z-10 flex min-h-[960px] items-center">
            <AnimateIn variant="fade-up" duration={0.8} className="max-w-[760px] pt-20 pl-10">
              <p className="eyebrow text-slate-200">Премиальные матрасы</p>
              <h1 className="serif mt-9 text-[clamp(58px,7vw,94px)] leading-[1.08] tracking-0">
                Искусство
                <br />
                идеального сна
              </h1>
              <p className="mt-9 max-w-md text-base leading-7 text-slate-200">
                Собственное производство премиальных ортопедических матрасов в Казахстане
              </p>
              <div className="mt-12 flex flex-wrap gap-4">
                <Link href="/catalog" className="btn-primary">
                  Смотреть каталог
                </Link>
                <a href="#consult" className="btn-outline">
                  Получить консультацию
                </a>
              </div>
            </AnimateIn>
          </div>
          <div className="container-wide pointer-events-none absolute inset-x-0 bottom-20 z-10 hidden items-center gap-5 text-[12px] text-white/70 md:flex" aria-hidden="true">
            <span>01</span>
            <span className="h-px w-24 bg-white/45" />
            <span>03</span>
          </div>
        </section>

        {/* Features bar */}
        <section className="border-b border-slate-200 bg-[#faf8f5] py-14">
          <StaggerList className="container-wide grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" gap={0.07}>
            {features.map((feature) => (
              <StaggerItem key={feature.label} className="flex items-center gap-4 text-sm text-[#1e2939]">
                <feature.icon className="text-[var(--gold)]" size={32} strokeWidth={1.4} />
                <span className="max-w-[130px] leading-5">{feature.label}</span>
              </StaggerItem>
            ))}
          </StaggerList>
        </section>

        {/* Collections */}
        <section id="collections" className="pb-36 pt-32">
          <div className="container-wide">
            <AnimateIn className="mb-16 flex items-end justify-between gap-8">
              <div>
                <p className="eyebrow text-slate-400">Коллекции</p>
                <h2 className="section-title mt-6 text-[#111827]">Выберите свою коллекцию</h2>
              </div>
              <Link href="/catalog" className="hidden items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-[#111827] md:flex">
                Смотреть все матрасы <ArrowRight size={16} />
              </Link>
            </AnimateIn>
            <AnimateIn delay={0.15}>
              <ProductGrid initialProducts={products} limit={4} />
            </AnimateIn>
          </div>
        </section>

        {/* Reasons */}
        <section id="about" className="bg-[var(--brown)] py-28 text-white">
          <div className="container-wide">
            <AnimateIn>
              <p className="eyebrow">Почему выбирают нас</p>
              <h2 className="section-title mt-7">8 причин купить матрас у нас</h2>
            </AnimateIn>
            <StaggerList className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4" gap={0.08}>
              {reasons.map(([number, title, text]) => (
                <StaggerItem key={number} className="border border-white/10 bg-white/[0.04] p-8">
                  <p className="serif text-3xl text-[var(--gold)]">{number}</p>
                  <h3 className="serif mt-7 text-2xl">{title}</h3>
                  <p className="mt-4 text-sm leading-6 text-slate-400">{text}</p>
                </StaggerItem>
              ))}
            </StaggerList>
          </div>
        </section>

        {/* Production */}
        <section className="py-28">
          <div className="container-wide grid overflow-hidden bg-[#f3eee8] lg:grid-cols-2">
            <AnimateIn variant="fade-left" className="p-12 md:p-20">
              <p className="eyebrow">Собственное производство</p>
              <h2 className="serif mt-8 max-w-lg text-5xl leading-tight text-[#111827]">Контроль качества на каждом этапе</h2>
              <p className="mt-8 max-w-sm text-base leading-7 text-slate-600">
                Мы используем только проверенные материалы и современное оборудование, чтобы создавать матрасы премиального качества.
              </p>
              <Link href="/catalog" className="mt-12 inline-flex border border-slate-300 px-10 py-4 text-[10px] uppercase tracking-[0.2em] text-[#111827]">
                Узнать больше
              </Link>
            </AnimateIn>
            <AnimateIn variant="fade-right" className="relative min-h-[420px]">
              <Image src="/assets/production.jpg" alt="Производство матрасов UKISH" fill className="object-cover grayscale" />
              <div className="absolute inset-0 bg-black/20" />
            </AnimateIn>
          </div>
        </section>

        {/* Consult */}
        <section id="consult" className="bg-[var(--brown)] py-28 text-white">
          <div className="container-wide grid gap-12 lg:grid-cols-[1fr_430px] lg:items-center">
            <AnimateIn variant="fade-up">
              <p className="eyebrow">Консультация</p>
              <h2 className="serif mt-8 text-5xl leading-tight max-w-md">Поможем выбрать идеальный матрас</h2>
              <p className="mt-8 max-w-md text-base leading-7 text-slate-400">
                Оставьте заявку, и наш специалист поможет подобрать матрас, учитывая ваши анатомические особенности, вес и предпочтения.
              </p>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={0.15}>
              <ConsultForm />
            </AnimateIn>
          </div>
        </section>

        {/* Reviews */}
        <section className="py-28">
          <div className="container-wide">
            <AnimateIn className="text-center">
              <p className="eyebrow text-slate-400">Отзывы</p>
              <h2 className="section-title mt-6 text-[#111827]">Что говорят наши клиенты</h2>
            </AnimateIn>
            <StaggerList className="mt-16 grid gap-8 lg:grid-cols-3" gap={0.12}>
              {reviews.map(([name, city, text]) => (
                <StaggerItem key={name} className="bg-white p-10">
                  <p className="text-[var(--gold)]">★★★★★</p>
                  <p className="mt-8 min-h-[86px] text-base leading-7 text-slate-600">{text}</p>
                  <div className="mt-8 flex items-center gap-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">{name[0]}</span>
                    <div>
                      <h3 className="font-semibold">{name}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{city}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerList>
            <StaggerList className="mt-14 grid rounded-lg bg-white py-9 text-center md:grid-cols-3" gap={0.12}>
              {[
                ['12 лет', 'На рынке Казахстана'],
                ['1000+', 'Довольных клиентов'],
                ['98%', 'Рекомендуют нас'],
              ].map(([value, label]) => (
                <StaggerItem key={value}>
                  <p className="text-5xl font-bold text-[#111827]">{value}</p>
                  <p className="mt-3 text-sm text-slate-500">{label}</p>
                </StaggerItem>
              ))}
            </StaggerList>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
