export type StoreProduct = {
  id: string
  slug: string
  title: string
  collection: 'premium' | 'ortho' | 'kids' | 'basic' | 'accessories'
  collectionLabel: string
  hardness?: 'soft' | 'medium' | 'hard' | 'dual'
  hardnessLabel?: string
  shortDescription: string
  description: string
  price: number
  oldPrice?: number
  image: string
  gallery: string[]
  sizes: { size: string; price: number }[]
  benefits: { title: string; text: string }[]
  active?: boolean
  sortOrder?: number
}

export const collectionLabels: Record<StoreProduct['collection'], string> = {
  premium: 'Премиум коллекция',
  ortho: 'Ортопедическая коллекция',
  kids: 'Детская коллекция',
  basic: 'Базовая коллекция',
  accessories: 'Аксессуары',
}

export const hardnessLabels: Record<NonNullable<StoreProduct['hardness']>, string> = {
  soft: 'Мягкий',
  medium: 'Средней жесткости',
  hard: 'Жесткий',
  dual: 'Разносторонний',
}

export const seedProducts: StoreProduct[] = [
  {
    id: 'diamond-king',
    slug: 'diamond-king',
    title: 'Diamond King',
    collection: 'premium',
    collectionLabel: collectionLabels.premium,
    hardness: 'medium',
    hardnessLabel: hardnessLabels.medium,
    shortDescription: 'Максимальный комфорт и поддержка. Идеально для пар с разным весом.',
    description:
      'Премиальный матрас с независимым пружинным блоком, мягким верхним слоем и усиленной поддержкой по периметру.',
    price: 245000,
    oldPrice: 298000,
    image: '/assets/diamond-king.jpg',
    gallery: ['/assets/diamond-king.jpg', '/assets/diamond-prime.jpg', '/assets/smart.jpg'],
    sizes: [
      { size: '90x200', price: 245000 },
      { size: '120x200', price: 275000 },
      { size: '140x200', price: 298000 },
      { size: '160x200', price: 325000 },
      { size: '180x200', price: 355000 },
      { size: '200x200', price: 390000 },
    ],
    benefits: [
      { title: 'Гарантия до 10 лет', text: 'На пружинный блок и материалы наполнения' },
      { title: 'Бесплатная доставка', text: 'По всему Казахстану до двери' },
      { title: 'Сертифицированные материалы', text: 'Все материалы проходят строгий контроль качества' },
    ],
  },
  {
    id: 'diamond-prime',
    slug: 'diamond-prime',
    title: 'Diamond Prime',
    collection: 'premium',
    collectionLabel: collectionLabels.premium,
    hardness: 'soft',
    hardnessLabel: hardnessLabels.soft,
    shortDescription: 'Идеальный баланс мягкости и упругости благодаря латексному слою.',
    description:
      'Матрас подстраивается под анатомические особенности тела и обеспечивает глубокий восстанавливающий сон.',
    price: 198000,
    oldPrice: 245000,
    image: '/assets/diamond-prime.jpg',
    gallery: ['/assets/diamond-prime.jpg', '/assets/diamond-king.jpg', '/assets/smart.jpg'],
    sizes: [
      { size: '90x200', price: 198000 },
      { size: '120x200', price: 218000 },
      { size: '140x200', price: 232000 },
      { size: '160x200', price: 245000 },
      { size: '180x200', price: 268000 },
      { size: '200x200', price: 294000 },
    ],
    benefits: [
      { title: 'Гарантия до 10 лет', text: 'На пружинный блок и материалы наполнения' },
      { title: 'Бесплатная доставка', text: 'По всему Казахстану до двери' },
      { title: 'Современные технологии', text: 'Комфортная поддержка и долговечность конструкции' },
    ],
  },
  {
    id: 'smart',
    slug: 'smart',
    title: 'Smart',
    collection: 'ortho',
    collectionLabel: collectionLabels.ortho,
    hardness: 'medium',
    hardnessLabel: hardnessLabels.medium,
    shortDescription: 'Умная поддержка позвоночника с независимым пружинным блоком.',
    description:
      'Практичная ортопедическая модель для ежедневного сна, стабильной поддержки и правильного положения спины.',
    price: 124000,
    oldPrice: 158000,
    image: '/assets/smart.jpg',
    gallery: ['/assets/smart.jpg', '/assets/diamond-prime.jpg', '/assets/production.jpg'],
    sizes: [
      { size: '90x200', price: 124000 },
      { size: '120x200', price: 142000 },
      { size: '140x200', price: 156000 },
      { size: '160x200', price: 171000 },
      { size: '180x200', price: 188000 },
      { size: '200x200', price: 205000 },
    ],
    benefits: [
      { title: 'Ортопедическая поддержка', text: 'Помогает равномерно распределять нагрузку' },
      { title: 'Бесплатная доставка', text: 'До кровати в день заказа' },
      { title: 'Сертифицированные материалы', text: 'Безопасные ткани и наполнители' },
    ],
  },
  {
    id: 'kids-comfort',
    slug: 'kids-comfort',
    title: 'Kids Comfort',
    collection: 'kids',
    collectionLabel: collectionLabels.kids,
    hardness: 'medium',
    hardnessLabel: hardnessLabels.medium,
    shortDescription: 'Забота о здоровом сне вашего ребенка. Гипоаллергенные материалы.',
    description:
      'Детский матрас с умеренной жесткостью и безопасными материалами для правильной поддержки растущего организма.',
    price: 89000,
    image: '/assets/kids-comfort.jpg',
    gallery: ['/assets/kids-comfort.jpg', '/assets/smart.jpg', '/assets/diamond-king.jpg'],
    sizes: [
      { size: '80x190', price: 89000 },
      { size: '90x190', price: 96000 },
      { size: '90x200', price: 99000 },
      { size: '120x200', price: 128000 },
    ],
    benefits: [
      { title: 'Для детей', text: 'Умеренная жесткость для здоровой осанки' },
      { title: 'Гипоаллергенно', text: 'Ткани и наполнители проходят контроль качества' },
      { title: 'Точный подбор', text: 'Поможем выбрать подходящий размер и жесткость' },
    ],
  },
  {
    id: 'classic-sleep',
    slug: 'classic-sleep',
    title: 'Classic Sleep',
    collection: 'basic',
    collectionLabel: collectionLabels.basic,
    hardness: 'medium',
    hardnessLabel: hardnessLabels.medium,
    shortDescription: 'Надежный классический матрас средней жесткости.',
    description:
      'Базовая модель для гостевой спальни, дачи или первого ортопедического матраса без лишних затрат.',
    price: 75000,
    image: '/assets/classic-sleep.jpg',
    gallery: ['/assets/classic-sleep.jpg', '/assets/diamond-king.jpg', '/assets/production.jpg'],
    sizes: [
      { size: '90x200', price: 75000 },
      { size: '120x200', price: 94000 },
      { size: '160x200', price: 118000 },
      { size: '180x200', price: 132000 },
    ],
    benefits: [
      { title: 'Честная цена', text: 'Без посредников благодаря собственному производству' },
      { title: 'Быстрое изготовление', text: 'Заказ готов в течение 1-3 дней' },
      { title: 'Доставка', text: 'Привезем до двери и поднимем до кровати' },
    ],
  },
  {
    id: 'ortho-hard',
    slug: 'ortho-hard',
    title: 'Ortho Hard',
    collection: 'ortho',
    collectionLabel: collectionLabels.ortho,
    hardness: 'hard',
    hardnessLabel: hardnessLabels.hard,
    shortDescription: 'Жесткий матрас с кокосовой койрой для проблемной спины.',
    description:
      'Усиленная ортопедическая модель для тех, кому нужна выраженная поддержка и высокая устойчивость поверхности.',
    price: 135000,
    oldPrice: 169000,
    image: '/assets/ortho-hard.jpg',
    gallery: ['/assets/production.jpg', '/assets/smart.jpg', '/assets/diamond-prime.jpg'],
    sizes: [
      { size: '90x200', price: 135000 },
      { size: '120x200', price: 152000 },
      { size: '160x200', price: 186000 },
      { size: '180x200', price: 204000 },
    ],
    benefits: [
      { title: 'Жесткая поддержка', text: 'Кокосовая койра и усиленный блок' },
      { title: 'Гарантия', text: 'Официальная гарантия от производителя' },
      { title: 'Проверенная конструкция', text: 'Надежные материалы для ежедневного сна' },
    ],
  },
]

export function formatPrice(price: number) {
  return new Intl.NumberFormat('ru-KZ').format(price) + ' ₸'
}
