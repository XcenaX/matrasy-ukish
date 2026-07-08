const STRAPI_URL = (process.env.STRAPI_URL || 'http://127.0.0.1:1337').replace(/\/$/, '')
const STRAPI_ADMIN_EMAIL = process.env.STRAPI_ADMIN_EMAIL || 'admin@ukish.local'
const STRAPI_ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD || 'UkishAdmin123!'

type ContentManagerConfig = {
  settings: Record<string, unknown>
  metadatas: Record<string, { edit: Record<string, unknown>; list: Record<string, unknown> }>
  layouts: {
    edit: { name: string; size: number }[][]
    editRelations?: unknown[]
    list: string[]
  }
}

async function getAdminToken() {
  if (process.env.STRAPI_ADMIN_TOKEN) return process.env.STRAPI_ADMIN_TOKEN

  const response = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
    throw new Error(`${path}: ${response.status} ${await response.text()}`)
  }

  return response.json()
}

async function configureContentType(
  token: string,
  uid: string,
  labels: Record<string, string>,
  editLayout: { name: string; size: number }[][],
  listLayout: string[],
  hiddenFields: string[] = [],
) {
  const response = (await request(`/content-manager/content-types/${uid}/configuration`, token)) as {
    data: { contentType: ContentManagerConfig }
  }
  const config = response.data.contentType

  for (const [field, label] of Object.entries(labels)) {
    if (!config.metadatas[field]) continue
    config.metadatas[field].edit.label = label
    config.metadatas[field].list.label = label
  }

  for (const metadata of Object.values(config.metadatas)) {
    delete metadata.list.mainField
  }

  for (const field of hiddenFields) {
    if (!config.metadatas[field]) continue
    config.metadatas[field].edit.visible = false
    config.metadatas[field].edit.editable = false
  }

  config.layouts.edit = editLayout
  config.layouts.list = listLayout

  await request(`/content-manager/content-types/${uid}/configuration`, token, {
    method: 'PUT',
    body: JSON.stringify({
      settings: config.settings,
      metadatas: config.metadatas,
      layouts: config.layouts,
    }),
  })
}

async function configureComponent(
  token: string,
  uid: string,
  labels: Record<string, string>,
  editLayout: { name: string; size: number }[][],
  listLayout: string[],
  mainField?: string,
) {
  const response = (await request(`/content-manager/components/${uid}/configuration`, token)) as {
    data: { component: ContentManagerConfig }
  }
  const config = response.data.component

  for (const [field, label] of Object.entries(labels)) {
    if (!config.metadatas[field]) continue
    config.metadatas[field].edit.label = label
    config.metadatas[field].list.label = label
  }

  for (const metadata of Object.values(config.metadatas)) {
    delete metadata.list.mainField
  }

  if (mainField) {
    config.settings.mainField = mainField
  }

  config.layouts.edit = editLayout
  config.layouts.list = listLayout

  await request(`/content-manager/components/${uid}/configuration`, token, {
    method: 'PUT',
    body: JSON.stringify({
      settings: config.settings,
      metadatas: config.metadatas,
      layouts: config.layouts,
    }),
  })
}

async function main() {
  const token = await getAdminToken()

  await configureContentType(
    token,
    'api::product.product',
    {
      title: 'Название',
      slug: 'Слаг',
      collection: 'Коллекция',
      hardness: 'Жесткость',
      shortDescription: 'Краткое описание',
      description: 'Описание',
      price: 'Цена',
      oldPrice: 'Старая цена',
      image: 'Главное фото',
      gallery: 'Дополнительные фото',
      reviewVideo: 'Видео-обзор',
      sizes: 'Размеры',
      details: 'Детали',
      benefits: 'Преимущества',
      active: 'Активен',
      sortOrder: 'Порядок',
    },
    [
      [{ name: 'title', size: 12 }],
      [
        { name: 'collection', size: 6 },
        { name: 'hardness', size: 6 },
      ],
      [
        { name: 'price', size: 4 },
        { name: 'oldPrice', size: 4 },
        { name: 'sortOrder', size: 4 },
      ],
      [{ name: 'image', size: 12 }],
      [{ name: 'shortDescription', size: 12 }],
      [{ name: 'description', size: 12 }],
      [{ name: 'gallery', size: 12 }],
      [{ name: 'reviewVideo', size: 12 }],
      [{ name: 'sizes', size: 12 }],
      [{ name: 'details', size: 12 }],
      [{ name: 'benefits', size: 12 }],
      [{ name: 'active', size: 4 }],
    ],
    ['title', 'collection', 'price', 'active'],
    ['slug'],
  )

  await configureContentType(
    token,
    'api::order.order',
    {
      orderNumber: 'Номер заказа',
      orderStatus: 'Статус',
      customerName: 'Имя клиента',
      phone: 'Телефон',
      city: 'Город',
      address: 'Адрес',
      paymentMethod: 'Способ оплаты',
      comment: 'Комментарий',
      items: 'Состав заказа',
      total: 'Итого',
    },
    [
      [
        { name: 'orderNumber', size: 6 },
        { name: 'orderStatus', size: 6 },
      ],
      [
        { name: 'customerName', size: 6 },
        { name: 'phone', size: 6 },
      ],
      [
        { name: 'city', size: 6 },
        { name: 'total', size: 6 },
      ],
      [{ name: 'address', size: 12 }],
      [{ name: 'items', size: 12 }],
      [{ name: 'paymentMethod', size: 12 }],
      [{ name: 'comment', size: 12 }],
    ],
    ['orderNumber', 'orderStatus', 'customerName', 'phone', 'total'],
  )

  await configureContentType(
    token,
    'api::review.review',
    {
      name: 'Имя',
      city: 'Город',
      text: 'Текст комментария',
      rating: 'Оценка',
      reviewDate: 'Дата отзыва',
      photos: 'Фото клиента',
      active: 'Активен',
      sortOrder: 'Порядок',
    },
    [
      [
        { name: 'name', size: 6 },
        { name: 'city', size: 6 },
      ],
      [
        { name: 'rating', size: 6 },
        { name: 'reviewDate', size: 6 },
      ],
      [{ name: 'text', size: 12 }],
      [{ name: 'photos', size: 12 }],
      [
        { name: 'active', size: 6 },
        { name: 'sortOrder', size: 6 },
      ],
    ],
    ['name', 'rating', 'city', 'active'],
  )

  await configureContentType(
    token,
    'api::landing-setting.landing-setting',
    {
      productionVideo: 'Видео производства',
      productionFallbackImage: 'Фото, если видео не загрузилось',
      productionAlt: 'Описание медиа',
      mainPhone: 'Основной телефон',
      wholesalePhone: 'Оптовый телефон',
      email: 'Email',
      workHours: 'Часы работы',
      whatsappPhone: 'WhatsApp (цифры)',
      instagramUrl: 'Instagram (ссылка)',
      tiktokUrl: 'TikTok (ссылка)',
      kaspiUrl: 'Kaspi магазин (ссылка)',
      cityPhones: 'Телефоны по городам',
      addresses: 'Адреса точек',
    },
    [
      [{ name: 'productionVideo', size: 12 }],
      [{ name: 'productionFallbackImage', size: 12 }],
      [{ name: 'productionAlt', size: 12 }],
      [
        { name: 'mainPhone', size: 6 },
        { name: 'wholesalePhone', size: 6 },
      ],
      [
        { name: 'email', size: 6 },
        { name: 'workHours', size: 6 },
      ],
      [{ name: 'whatsappPhone', size: 6 }],
      [
        { name: 'instagramUrl', size: 6 },
        { name: 'tiktokUrl', size: 6 },
      ],
      [{ name: 'kaspiUrl', size: 12 }],
      [{ name: 'cityPhones', size: 12 }],
      [{ name: 'addresses', size: 12 }],
    ],
    ['productionAlt'],
  )

  await configureComponent(
    token,
    'product.size',
    {
      size: 'Размер',
      price: 'Цена',
    },
    [[
      { name: 'size', size: 6 },
      { name: 'price', size: 6 },
    ]],
    ['size', 'price'],
  )

  await configureComponent(
    token,
    'product.gallery-image',
    {
      image: 'Фото',
    },
    [[{ name: 'image', size: 12 }]],
    ['image'],
    'id',
  )

  await configureComponent(
    token,
    'product.benefit',
    {
      title: 'Заголовок',
      text: 'Текст',
    },
    [
      [{ name: 'title', size: 12 }],
      [{ name: 'text', size: 12 }],
    ],
    ['title'],
  )

  await configureComponent(
    token,
    'product.detail',
    {
      label: 'Название',
      value: 'Значение',
    },
    [[
      { name: 'label', size: 6 },
      { name: 'value', size: 6 },
    ]],
    ['label', 'value'],
    'label',
  )

  await configureComponent(
    token,
    'contact.city-phone',
    {
      city: 'Город',
      phone: 'Телефон',
    },
    [[
      { name: 'city', size: 6 },
      { name: 'phone', size: 6 },
    ]],
    ['city', 'phone'],
  )

  await configureComponent(
    token,
    'contact.address-line',
    {
      city: 'Город',
      lines: 'Адреса',
    },
    [
      [{ name: 'city', size: 12 }],
      [{ name: 'lines', size: 12 }],
    ],
    ['city'],
  )

  await configureComponent(
    token,
    'order.item',
    {
      productId: 'ID товара',
      title: 'Товар',
      size: 'Размер',
      quantity: 'Количество',
      price: 'Цена',
    },
    [
      [{ name: 'title', size: 12 }],
      [
        { name: 'size', size: 6 },
        { name: 'quantity', size: 6 },
      ],
      [
        { name: 'price', size: 6 },
        { name: 'productId', size: 6 },
      ],
    ],
    ['title', 'size', 'quantity', 'price'],
  )

  console.log('Configured Strapi admin views')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
