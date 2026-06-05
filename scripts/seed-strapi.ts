import { seedProducts } from '../src/lib/seed-data'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const STRAPI_URL = (process.env.STRAPI_URL || 'http://127.0.0.1:1337').replace(/\/$/, '')
const STRAPI_ADMIN_EMAIL = process.env.STRAPI_ADMIN_EMAIL || 'admin@ukish.local'
const STRAPI_ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD || 'UkishAdmin123!'

const collectionMap = {
  premium: 'Премиум',
  ortho: 'Ортопедические',
  kids: 'Детские',
  basic: 'Базовые',
  accessories: 'Аксессуары',
} as const

const hardnessMap = {
  soft: 'Мягкий',
  medium: 'Средней жесткости',
  hard: 'Жесткий',
  dual: 'Разносторонний',
} as const

const uploadedFiles = new Map<string, number>()

const seedReviews = [
  {
    name: 'Архат Нурушев',
    text: 'Купил сегодня у них матрас, классный, всем советую. Менеджер оперативно отработала, а самый жёсткий матрас сделали на заказ в своём цеху.',
  },
  {
    name: 'Саяжан Ж',
    text: 'Приехала посмотреть матрасы на двуспалку, оказался большой выбор. В итоге купила матрас и топер, всё доставили в тот же день, ещё подарили подушку.',
  },
  {
    name: 'Айсулу Нургалиева',
    text: 'Купила высокий матрас "Элит кокос" под нестандартный размер. До обеда заказала, вечером уже сшили и доставили. Консультант всё грамотно объяснила.',
  },
  {
    name: 'Анастасия Биржанова',
    text: 'Уже не первый раз заказываю матрасы. Качество супер, быстро доставляют, всё подскажут и расскажут. В подарок положили ортопедические подушки.',
  },
  {
    name: 'Гульмира Тореханова',
    text: 'Самые качественные и стильные матрасы. Сервис на 100%, быстро, с заботой, на все вопросы отвечают терпеливо и профессионально.',
  },
  {
    name: 'Татьяна Устелимова',
    text: 'Пришли с определённым запросом, нас подробно и ненавязчиво проконсультировали. Доставка день в день, матрасом остались очень довольны.',
  },
  {
    name: 'Ануара Дженисова',
    text: 'Качество превзошло ожидания: матрас удобный, спина по утрам не болит, запаха не было. Доставили быстро в тот же день и подарили подушки.',
  },
  {
    name: 'Laurie Muz',
    text: 'Спасибо Залине: нашли классный матрас и кровать по хорошей цене. Очень понравилось, что можно полежать на разных моделях и выбрать свою.',
  },
  {
    name: 'Klara Makenova',
    text: 'Ознакомилась и с фабрикой, и с магазином. Выбрали матрас по душе и не ошиблись, всё привезли вовремя. Очень довольны сервисом.',
  },
  {
    name: 'Алия Сарсенбаева',
    text: 'Взяли матрасы себе и детям, очень понравилось. Цена и качество порадовали, ещё получили три подушки в подарок. Менеджер Залина грамотно консультирует.',
  },
  {
    name: 'Lana Sh',
    text: 'Купила два ортопедических матраса для детей. Консультанты помогли с выбором, заказ оформили быстро, доставка была своевременной, упаковка надёжная.',
  },
  {
    name: 'Сергей Клещенко',
    text: 'Взял вариант с кокосом: одна половина средней жёсткости, другая чуть мягче. Очень удобно, с женой довольны. Доставили оперативно.',
  },
  {
    name: 'Anara Meiramova',
    text: 'Заказали матрас "Элит кокос 2", результат превзошёл ожидания. Консультация грамотная, доставка аккуратная и оперативная.',
  },
  {
    name: 'Elena Andrychenko',
    text: 'Утром приняли заказ на матрас нужного размера, в этот же день доставили. Матрас очень хороший, всем советую.',
  },
  {
    name: 'Динара Бегимова',
    text: 'Матрасы качественные и красивые, цены приемлемые, доставили вовремя. Консультант подробно рассказала, подсказала и помогла с выбором.',
  },
  {
    name: 'Madi Elander',
    text: 'Great customer service and prices. The mattress was delivered the next day, and we could not be happier with the experience.',
  },
  {
    name: 'Илья',
    text: 'Сотрудница отдела продаж показала, рассказала и помогла подобрать матрас для семьи. Приятно удивили скидка, рассрочка и доставка в день заказа.',
  },
  {
    name: 'Асылтас Омарова',
    text: 'Заказала двухсторонний матрас, доставили вовремя. Продавец вежливо всё объяснила, отправила фото и видео, была на связи. Качество отличное.',
  },
]

async function request(path: string, token: string, init: RequestInit = {}) {
  const response = await fetch(`${STRAPI_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...init.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${await response.text()}`)
  }

  if (response.status === 204) return null
  return response.json()
}

async function getAdminToken() {
  if (process.env.STRAPI_ADMIN_TOKEN) {
    return process.env.STRAPI_ADMIN_TOKEN
  }

  const response = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: STRAPI_ADMIN_EMAIL,
      password: STRAPI_ADMIN_PASSWORD,
    }),
  })

  if (!response.ok) {
    throw new Error(`Cannot login to Strapi admin: ${response.status} ${await response.text()}`)
  }

  const payload = (await response.json()) as { data?: { token?: string; accessToken?: string } }
  const token = payload.data?.token || payload.data?.accessToken

  if (!token) throw new Error('Strapi admin login response did not include a token')

  return token
}

async function deleteExistingProducts(token: string) {
  const payload = (await request(
    '/content-manager/collection-types/api::product.product?page=1&pageSize=100',
    token,
  )) as { results?: { documentId?: string }[] }

  for (const product of payload.results || []) {
    if (!product.documentId) continue
    await request(`/content-manager/collection-types/api::product.product/${product.documentId}`, token, {
      method: 'DELETE',
    })
  }
}

async function deleteExistingReviews(token: string) {
  const payload = (await request(
    '/content-manager/collection-types/api::review.review?page=1&pageSize=100',
    token,
  )) as { results?: { documentId?: string }[] }

  for (const review of payload.results || []) {
    if (!review.documentId) continue
    await request(`/content-manager/collection-types/api::review.review/${review.documentId}`, token, {
      method: 'DELETE',
    })
  }
}

async function uploadImage(token: string, imagePath: string) {
  if (uploadedFiles.has(imagePath)) return uploadedFiles.get(imagePath) as number

  const absolutePath = path.join(process.cwd(), 'public', imagePath.replace(/^\/+/, ''))
  const file = await readFile(absolutePath)
  const form = new FormData()
  const blob = new Blob([file], { type: 'image/jpeg' })

  form.append('files', blob, path.basename(imagePath))

  const response = await fetch(`${STRAPI_URL}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  })

  if (!response.ok) {
    throw new Error(`Cannot upload ${imagePath}: ${response.status} ${await response.text()}`)
  }

  const payload = (await response.json()) as { id?: number }[]
  const id = payload[0]?.id

  if (!id) throw new Error(`Strapi did not return media id for ${imagePath}`)

  uploadedFiles.set(imagePath, id)
  return id
}

async function createProduct(token: string, product: (typeof seedProducts)[number], sortOrder: number) {
  const image = await uploadImage(token, product.image)
  const gallery = await Promise.all(
    product.gallery.map(async (item) => ({
      image: await uploadImage(token, item),
    })),
  )

  const createPayload = (await request('/content-manager/collection-types/api::product.product', token, {
    method: 'POST',
    body: JSON.stringify({
      title: product.title,
      slug: product.slug,
      collection: collectionMap[product.collection],
      hardness: product.hardness ? hardnessMap[product.hardness] : undefined,
      shortDescription: product.shortDescription,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice,
      image,
      gallery,
      sizes: product.sizes,
      benefits: product.benefits,
      active: true,
      sortOrder,
    }),
  })) as { data?: { documentId?: string } }

  const documentId = createPayload.data?.documentId
  if (!documentId) throw new Error(`Strapi did not return documentId for ${product.title}`)

  await request(`/content-manager/collection-types/api::product.product/${documentId}/actions/publish`, token, {
    method: 'POST',
    body: JSON.stringify({}),
  })
}

async function createReview(token: string, review: (typeof seedReviews)[number], sortOrder: number) {
  await request('/content-manager/collection-types/api::review.review', token, {
    method: 'POST',
    body: JSON.stringify({
      ...review,
      city: 'Астана',
      rating: 5,
      active: true,
      sortOrder,
    }),
  })
}

async function main() {
  const token = await getAdminToken()

  await deleteExistingProducts(token)
  await deleteExistingReviews(token)

  for (const [index, product] of seedProducts.entries()) {
    await createProduct(token, product, (index + 1) * 10)
  }

  for (const [index, review] of seedReviews.entries()) {
    await createReview(token, review, (index + 1) * 10)
  }

  console.log(`Seeded ${seedProducts.length} products and ${seedReviews.length} reviews into Strapi`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
