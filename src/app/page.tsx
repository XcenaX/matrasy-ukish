import { ArrowRight, BadgePercent, Factory, Gem, MapPin, ShieldCheck, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { AnimateIn, StaggerItem, StaggerList } from '@/components/animate-in'
import { ConsultForm } from '@/components/consult-form'
import { LandingProductionMedia } from '@/components/landing-production-media'
import { ProductGrid } from '@/components/product-grid'
import { ReviewsCarousel } from '@/components/reviews-carousel'
import { Footer, Header } from '@/components/site-shell'
import { fallbackLandingSettings, fallbackReviews } from '@/lib/landing-content'
import { seedProducts } from '@/lib/seed-data'

const KASPI_SHOP_URL = 'https://l.kaspi.kz/shop/3vC4nEY6Qcv7Mta'

const features = [
  { icon: Factory, label: 'Собственное производство' },
  { icon: Gem, label: 'Премиальные материалы' },
  { icon: ShieldCheck, label: 'Гарантия 60 месяцев' },
  { icon: BadgePercent, label: 'Нагрузка до 200 кг' },
  { icon: Truck, label: 'Бесплатная доставка' },
  { icon: BadgePercent, label: 'Рассрочка 0-0-12' },
]

const reasons = [
  ['01', 'Собственная фабрика', 'Фабрика UKISH с собственными складами и автопарком для доставки'],
  ['02', 'Доставка по Казахстану', 'Работаем по всему Казахстану и доставляем заказы до двери'],
  ['03', 'Гарантия 60 месяцев', 'Официальная гарантия от производителя'],
  ['04', 'Быстрое изготовление', 'Заказ готов в течение 1-3 дней'],
  ['05', 'Сертифицированные материалы', 'Все материалы проходят строгий контроль качества'],
  ['06', 'Честные цены', 'На 27% ниже рынка благодаря отсутствию посредников'],
]

const cities = ['Астана', 'Караганда', 'Усть-Каменогорск']

const partners = [
  { name: 'Quantum Stem School', src: '/assets/partners/quantum.png', className: 'h-16 w-56' },
  { name: 'ATM Construction & Investment', src: '/assets/partners/atm-mask.png', className: 'h-[67px] w-[173px]' },
  { name: 'Wyndham Garden', src: '/assets/partners/wyndham.svg', className: 'h-[57px] w-56' },
  { name: 'Törre', src: '/assets/partners/torre.svg', className: 'h-[38px] w-[220px]' },
  { name: 'Arabtec', src: '/assets/partners/arabtec.png', className: 'h-24 w-[105px]' },
  { name: 'Global Construction Development', src: '/assets/partners/global-construction-development.svg', className: 'partner-logo-original h-[82px] w-[174px]' },
  { name: 'Burabay Hotel', src: '/assets/partners/burabay-hotel.svg', className: 'partner-logo-original h-[92px] w-[99px]' },
  { name: 'Saryarka', src: '/assets/partners/saryarka.svg', className: 'partner-logo-original h-[86px] w-[88px]' },
  { name: 'Amanat Mental Clinic', src: '/assets/partners/amanat-mental-clinic.svg', className: 'partner-logo-original h-[58px] w-[218px]' },
]

export default function Home() {
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
            <AnimateIn variant="fade-up" duration={0.8} className="mx-auto max-w-[960px] text-center md:mx-0 md:pl-10 md:text-left">
              <p className="eyebrow text-slate-200">Премиальные матрасы</p>
              <h1 className="serif mt-9 max-w-[1120px] text-[clamp(44px,5vw,76px)] leading-[1.08] tracking-0">
                Ортопедические премиальные матрасы
                <br />
                напрямую от производителя
              </h1>
              <p className="mx-auto mt-9 max-w-md text-base leading-7 text-slate-200 md:mx-0">
                Собственное производство ортопедических матрасов в Астане. Работаем по всему Казахстану, принимаем заказы в Астане, Караганде и Усть-Каменогорске.
              </p>
              <div className="mx-auto mt-12 flex w-full max-w-sm flex-col gap-4 sm:max-w-none sm:flex-row sm:flex-wrap md:mx-0">
                <Link href="/catalog" className="btn-primary w-full sm:w-auto">
                  Смотреть каталог
                </Link>
                <a href={KASPI_SHOP_URL} target="_blank" rel="noopener noreferrer" className="btn-outline w-full sm:w-auto">
                  Kaspi магазин
                </a>
                <a href="#consult" className="btn-outline w-full sm:w-auto">
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
          <div className="container-wide grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-6">
            {features.map((feature) => (
              <div key={feature.label} className="flex items-center justify-center gap-3 text-sm text-[#1e2939] sm:gap-4">
                <feature.icon className="shrink-0 text-[var(--gold)]" size={30} strokeWidth={1.4} />
                <span className="max-w-[120px] leading-5 sm:max-w-[130px]">{feature.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Production */}
        <section id="about-company" className="py-24">
          <div className="container-wide bg-[#f3eee8] p-8 md:p-12 xl:p-16">
            <div className="grid gap-10 xl:grid-cols-[minmax(0,0.9fr)_minmax(520px,1.1fr)] xl:items-start">
              <AnimateIn variant="fade-left">
                <p className="eyebrow">О компании</p>
                <h2 className="serif mt-8 max-w-3xl text-[clamp(40px,4vw,64px)] leading-tight text-[#111827]">
                  Ukish Mattress - забота о качестве сна с 2018 года
                </h2>
                <p className="mt-8 max-w-2xl text-base leading-7 text-slate-600">
                  Ukish Mattress — современное производство матрасов и товаров для сна, основанное в 2018 году. Название компании дано в честь матери — как символ заботы, уважения и семейных ценностей, которые лежат в основе философии бренда.
                </p>
                <Link href="/catalog" className="mt-10 inline-flex min-h-12 items-center justify-center bg-[var(--brown)] px-10 py-4 text-[10px] uppercase tracking-[0.2em] text-white shadow-[0_18px_40px_-24px_rgba(42,31,26,0.75)] transition hover:bg-[var(--brown-soft)] active:translate-y-px">
                  Узнать больше
                </Link>
              </AnimateIn>

              <AnimateIn variant="fade-right" className="relative overflow-hidden">
                <LandingProductionMedia initialSettings={fallbackLandingSettings} />
              </AnimateIn>
            </div>

            <AnimateIn className="mt-12 grid gap-10 border-t border-[#dccfbe] pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)]">
              <div className="grid gap-5 text-base leading-7 text-slate-600 md:grid-cols-2">
                <p>
                  Производство находится в городе Астана. Компания также успешно развивается и работает в Караганде и Усть-Каменогорске, предлагая продукцию как для розничных покупателей, так и для оптовых партнёров.
                </p>
                <p>
                  С момента основания мы стремимся создавать продукцию, которая сочетает в себе высокое качество, современные технологии и максимальный комфорт. В производстве используются тщательно подобранные материалы и современные решения, позволяющие обеспечивать надежность, долговечность и высокий уровень комфорта.
                </p>
                <p>
                  Каждое изделие создаётся с вниманием к деталям и проходит контроль качества на всех этапах производства. Мы уделяем особое внимание эстетике, качеству исполнения и современному дизайну, создавая продукцию, соответствующую высоким стандартам индустрии сна.
                </p>
                <p>
                  Мы ценим доверие наших клиентов и продолжаем развиваться, совершенствуя качество продукции и создавая комфорт, который становится частью повседневной жизни.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#111827]">Сегодня Ukish Mattress — это:</p>
                <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-600 sm:grid-cols-2 lg:grid-cols-1">
                  {[
                    'собственное производство',
                    'современные технологии',
                    'широкий ассортимент продукции',
                    'работа оптом и в розницу',
                    'индивидуальный подход к каждому клиенту',
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[var(--gold)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>
          </div>
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
              <ProductGrid initialProducts={seedProducts} limit={4} />
            </AnimateIn>
          </div>
        </section>

        {/* Reasons */}
        <section id="about" className="bg-[var(--brown)] py-28 text-white">
          <div className="container-wide">
            <AnimateIn>
              <p className="eyebrow">Почему выбирают нас</p>
              <h2 className="section-title mt-7">6 причин купить матрас у нас</h2>
              <p className="mt-7 max-w-3xl text-base leading-7 text-slate-300">
                С 2018 года производим ортопедические матрасы в Казахстане по турецким и международным технологиям сна, внедряем современные материалы и развиваем собственное производство.
              </p>
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

        {/* Delivery */}
        <section id="delivery" className="bg-[#faf8f5] pb-28">
          <div className="container-wide grid gap-10 border-y border-slate-200 py-16 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <AnimateIn variant="fade-up">
              <p className="eyebrow text-slate-400">География</p>
              <h2 className="serif mt-7 max-w-xl text-5xl leading-tight text-[#111827]">Мы есть в городах Казахстана</h2>
              <p className="mt-7 max-w-xl text-base leading-7 text-slate-600">
                Работаем по всему Казахстану: принимаем розничные заявки и заказы на оптовые продажи, консультируем по подбору матраса и организуем доставку до двери.
              </p>
            </AnimateIn>
            <StaggerList className="grid gap-4 sm:grid-cols-2" gap={0.08}>
              {cities.map((city) => (
                <StaggerItem key={city} className="flex min-h-[96px] items-center gap-5 bg-white px-7 py-6 shadow-sm shadow-black/5">
                  <MapPin className="text-[var(--gold)]" size={22} strokeWidth={1.7} />
                  <span className="serif text-2xl text-[#111827]">{city}</span>
                </StaggerItem>
              ))}
            </StaggerList>
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
            <ReviewsCarousel initialReviews={fallbackReviews} />
            <StaggerList className="mt-14 grid rounded-lg bg-white py-9 text-center md:grid-cols-3" gap={0.12}>
              {[
                ['8 лет', 'На рынке Казахстана'],
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

        {/* Partners */}
        <section id="partners" className="border-b-[8px] border-[#e8e8e8] bg-[var(--brown)] py-28 text-white">
          <div className="container-wide">
            <AnimateIn className="text-center">
              <h2 className="serif mt-7 text-5xl leading-tight">Наши партнёры</h2>
              <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-white/45">
                Мы работаем с ведущими брендами и компаниями, которым доверяем и которые доверяют нам
              </p>
            </AnimateIn>
            <StaggerList className="partners-grid mt-20 grid items-center gap-7 sm:gap-10" gap={0.08}>
              {partners.map((partner) => (
                <StaggerItem key={partner.name} className="flex min-h-[96px] items-center justify-center">
                  <img alt={partner.name} className={`partner-logo-img object-contain ${partner.className}`} src={partner.src} />
                </StaggerItem>
              ))}
            </StaggerList>
            <AnimateIn className="mx-auto mt-16 flex max-w-lg items-center justify-center gap-7 text-center">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/25">Более 50 брендов-партнёров</span>
              <span className="h-px flex-1 bg-white/10" />
            </AnimateIn>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
