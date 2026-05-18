import { mkdir } from 'node:fs/promises'

import { chromium } from 'playwright'

const baseURL = 'http://127.0.0.1:3000'
const outDir = 'screenshots'

await mkdir(outDir, { recursive: true })

const browser = await chromium.launch()

async function capturePublic(path, fileName) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1200 } })
  await page.goto(`${baseURL}${path}`, { waitUntil: 'load', timeout: 45000 })
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${outDir}/${fileName}`, fullPage: true })
  await page.close()
  console.log(`${fileName} ${path}`)
}

async function captureAdmin() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  await page.goto(`${baseURL}/admin/login`, { waitUntil: 'load', timeout: 45000 })
  await page.waitForTimeout(800)

  const email = page.locator('input[name="email"]')
  if (await email.count()) {
    await email.fill('admin@ukish.local')
    await page.locator('input[name="password"]').fill('UkishAdmin123!')
    await Promise.all([
      page.waitForURL('**/admin', { timeout: 20000 }),
      page.locator('button[type="submit"]').click(),
    ])
  }

  const pages = [
    ['/admin', 'admin-dashboard.png'],
    ['/admin/collections/products', 'admin-products-list.png'],
    ['/admin/collections/products/create', 'admin-products-create.png'],
    ['/admin/collections/orders', 'admin-orders-list.png'],
    ['/admin/collections/orders/create', 'admin-orders-create.png'],
    ['/admin/collections/users', 'admin-users-list.png'],
    ['/admin/account', 'admin-account.png'],
  ]

  for (const [path, fileName] of pages) {
    await page.goto(`${baseURL}${path}`, { waitUntil: 'load', timeout: 45000 })
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${outDir}/${fileName}`, fullPage: true })
    console.log(`${fileName} ${path}`)
  }

  await page.close()
}

await capturePublic('/', 'local-site-home.png')
await capturePublic('/catalog', 'local-site-catalog.png')
await capturePublic('/product/diamond-prime', 'local-site-product.png')
await capturePublic('/cart', 'local-site-cart-empty.png')
await captureAdmin()

await browser.close()
