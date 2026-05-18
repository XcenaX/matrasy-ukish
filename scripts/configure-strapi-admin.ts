const STRAPI_URL = (process.env.STRAPI_URL || 'http://127.0.0.1:1337').replace(/\/$/, '')
const STRAPI_ADMIN_EMAIL = process.env.STRAPI_ADMIN_EMAIL || 'admin@ukish.local'
const STRAPI_ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD || 'UkishAdmin123!'

type ContentManagerConfig = {
  settings: Record<string, unknown>
  metadatas: Record<string, { edit: Record<string, unknown>; list: Record<string, unknown> }>
  layouts: {
    edit: { name: string; size: number }[][]
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
      gallery: 'Галерея',
      sizes: 'Размеры',
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
      [{ name: 'sizes', size: 12 }],
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

  console.log('Configured Strapi admin views')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
