import { ArrowRight, BadgePercent, Factory, Gem, MapPin, ShieldCheck, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { AnimateIn, StaggerItem, StaggerList } from '@/components/animate-in'
import { ConsultForm } from '@/components/consult-form'
import { ProductGrid } from '@/components/product-grid'
import { Footer, Header } from '@/components/site-shell'
import { seedProducts } from '@/lib/seed-data'

const KASPI_SHOP_URL = 'https://l.kaspi.kz/shop/3vC4nEY6Qcv7Mta'

const features = [
  { icon: Factory, label: 'Собственное производство' },
  { icon: Gem, label: 'Премиальные материалы' },
  { icon: ShieldCheck, label: 'Гарантия 24 месяца' },
  { icon: BadgePercent, label: 'Нагрузка до 200 кг' },
  { icon: Truck, label: 'Бесплатная доставка' },
  { icon: BadgePercent, label: 'Рассрочка 0-0-12' },
]

const reasons = [
  ['01', 'Собственное производство', 'Фабрика UKISH с собственными складами и автопарком для доставки'],
  ['02', 'Доставка по Казахстану', 'Работаем по всему Казахстану и доставляем заказы до двери'],
  ['03', 'Гарантия до 24 месяцев', 'Официальная гарантия от производителя'],
  ['04', 'Быстрое изготовление', 'Заказ готов в течение 1-3 дней'],
  ['05', 'Сертифицированные материалы', 'Все материалы проходят строгий контроль качества'],
  ['06', 'Честные цены', 'На 27% ниже рынка благодаря отсутствию посредников'],
]

const reviews = [
  ['Айгерим', 'г. Караганда', 'Купили матрас Diamond Prime. Спим уже месяц, спина перестала болеть. Очень качественные материалы, сервис на высшем уровне!'],
  ['Максат', 'г. Астана', 'Доставили день в день, как и обещали. Матрас Smart оказался идеальной жесткости. Спасибо консультанту за помощь в выборе.'],
  ['Елена', 'г. Шымкент', 'Заказывали матрас для ребенка из коллекции Kids. Нет никакого запаха, чехол приятный на ощупь. Ребенок спит отлично.'],
]

const cities = ['Астана', 'Караганда', 'Усть-Каменогорск']

const partners = [
  { name: 'Quantum Stem School', src: '/assets/partners/quantum.png', className: 'h-16 w-56' },
  { name: 'ATM Construction & Investment', src: '/assets/partners/atm-mask.png', className: 'h-[67px] w-[173px]' },
  { name: 'Wyndham Garden', src: '/assets/partners/wyndham.svg', className: 'h-[57px] w-56' },
  { name: 'Törre', src: '/assets/partners/torre.svg', className: 'h-[38px] w-[220px]' },
  { name: 'Arabtec', src: '/assets/partners/arabtec.png', className: 'h-24 w-[105px]' },
  { name: 'Global Construction Development', src: '/assets/partners/global-construction-development.svg', className: 'h-[82px] w-[190px]' },
  { name: 'Burabay Hotel', src: '/assets/partners/burabay-hotel.svg', className: 'h-[92px] w-[112px]' },
  { name: 'Saryarka', src: '/assets/partners/saryarka.svg', className: 'h-[86px] w-[112px]' },
  { name: 'Amanat Mental Clinic', src: '/assets/partners/amanat-mental-clinic.svg', className: 'h-[86px] w-[185px]' },
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
                Собственное производство премиальных ортопедических матрасов в Астане. Работаем по всему Казахстану, принимаем заказы в Астане, Караганде и Усть-Каменогорске.
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
          <StaggerList className="container-wide grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-6" gap={0.07}>
            {features.map((feature) => (
              <StaggerItem key={feature.label} className="flex items-center justify-center gap-3 text-sm text-[#1e2939] sm:gap-4">
                <feature.icon className="shrink-0 text-[var(--gold)]" size={30} strokeWidth={1.4} />
                <span className="max-w-[120px] leading-5 sm:max-w-[130px]">{feature.label}</span>
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
        <section id="about-company" className="py-28">
          <div className="container-wide grid overflow-hidden bg-[#f3eee8] lg:grid-cols-2">
            <AnimateIn variant="fade-left" className="p-12 md:p-20">
              <p className="eyebrow">О компании</p>
              <h2 className="serif mt-8 max-w-2xl text-5xl leading-tight text-[#111827]">Ukish Matras - забота о качестве сна с 2018 года</h2>
              <p className="mt-8 max-w-2xl text-base leading-7 text-slate-600">
                Ukish Matras — современное производство матрасов и товаров для сна, основанное в 2018 году. Название компании дано в честь матери — как символ заботы, уважения и семейных ценностей, которые лежат в основе философии бренда.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                Производство находится в городе Астана. Компания также успешно развивается и работает в Караганде и Усть-Каменогорске, предлагая продукцию как для розничных покупателей, так и для оптовых партнёров.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                С момента основания мы стремимся создавать продукцию, которая сочетает в себе высокое качество, современные технологии и максимальный комфорт. В производстве используются тщательно подобранные материалы и современные решения, позволяющие обеспечивать надежность, долговечность и высокий уровень комфорта.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                Каждое изделие создаётся с вниманием к деталям и проходит контроль качества на всех этапах производства. Мы уделяем особое внимание эстетике, качеству исполнения и современному дизайну, создавая продукцию, соответствующую высоким стандартам индустрии сна.
              </p>
              <div className="mt-8 max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#111827]">Сегодня Ukish Matras — это:</p>
                <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-600 sm:grid-cols-2">
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
              <p className="mt-8 max-w-2xl text-base leading-7 text-slate-600">
                Мы ценим доверие наших клиентов и продолжаем развиваться, совершенствуя качество продукции и создавая комфорт, который становится частью повседневной жизни.
              </p>
              <Link href="/catalog" className="mt-12 inline-flex min-h-12 items-center justify-center bg-[var(--brown)] px-10 py-4 text-[10px] uppercase tracking-[0.2em] text-white shadow-[0_18px_40px_-24px_rgba(42,31,26,0.75)] transition hover:bg-[var(--brown-soft)] active:translate-y-px">
                Узнать больше
              </Link>
            </AnimateIn>
            <AnimateIn variant="fade-right" className="relative min-h-[420px]">
              <Image src="/assets/production.jpg" alt="Производство матрасов UKISH" fill className="object-cover grayscale" />
              <div className="absolute inset-0 bg-black/20" />
            </AnimateIn>
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

        {/* Partners */}
        <section id="partners" className="border-b-[8px] border-[#e8e8e8] bg-[var(--brown)] py-28 text-white">
          <div className="container-wide">
            <AnimateIn className="text-center">
              <p className="eyebrow">Партнёры</p>
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
