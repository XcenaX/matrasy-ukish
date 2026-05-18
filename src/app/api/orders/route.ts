import { NextResponse } from 'next/server'

type OrderItem = {
  productId?: string
  title: string
  size?: string
  quantity: number
  price: number
}

function getStrapiUrl() {
  return (process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337').replace(/\/$/, '')
}

function getHeaders() {
  const headers: HeadersInit = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  if (process.env.STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${process.env.STRAPI_API_TOKEN}`
  }

  return headers
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    customerName?: string
    phone?: string
    city?: string
    address?: string
    paymentMethod?: string
    comment?: string
    items?: OrderItem[]
  }

  if (!body.customerName || !body.phone || !body.items?.length) {
    return NextResponse.json({ error: 'Заполните имя, телефон и корзину.' }, { status: 400 })
  }

  const items = body.items.map((item) => ({
    productId: item.productId,
    title: item.title,
    size: item.size,
    quantity: Math.max(1, Number(item.quantity || 1)),
    price: Number(item.price || 0),
  }))
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const orderNumber = 'UK-' + Date.now().toString().slice(-8)

  try {
    const response = await fetch(`${getStrapiUrl()}/api/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        data: {
          orderNumber,
          orderStatus: 'Новый',
          customerName: body.customerName,
          phone: body.phone,
          city: body.city,
          address: body.address,
          paymentMethod: body.paymentMethod || 'card_on_delivery',
          comment: body.comment,
          items,
          total,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(await response.text())
    }
  } catch {
    return NextResponse.json({ error: 'Не удалось сохранить заказ. Проверьте, что Strapi запущен.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, orderNumber, total })
}
