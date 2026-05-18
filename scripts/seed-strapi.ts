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

async function main() {
  const token = await getAdminToken()

  await deleteExistingProducts(token)

  for (const [index, product] of seedProducts.entries()) {
    await createProduct(token, product, (index + 1) * 10)
  }

  console.log(`Seeded ${seedProducts.length} products into Strapi`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
