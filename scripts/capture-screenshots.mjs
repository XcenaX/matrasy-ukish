import { chromium } from 'playwright'

const baseUrl = 'http://127.0.0.1:3000'
const outputDir = 'screenshots'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })

await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' })
await page.screenshot({ path: `${outputDir}/local-site-home.png`, fullPage: true })

await page.goto(`${baseUrl}/catalog`, { waitUntil: 'networkidle' })
await page.screenshot({ path: `${outputDir}/local-site-catalog.png`, fullPage: true })

await page.goto(`${baseUrl}/product/diamond-prime`, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: '160x200' }).click()
await page.getByRole('button', { name: /В корзину/i }).click()
await page.waitForURL('**/cart')
await page.screenshot({ path: `${outputDir}/local-site-cart.png`, fullPage: true })

await page.goto(`${baseUrl}/admin`, { waitUntil: 'networkidle' })
await page.screenshot({ path: `${outputDir}/local-admin-login.png`, fullPage: true })

await page.getByLabel('Email').fill('admin@ukish.local')
await page.getByLabel('Password').fill('UkishAdmin123!')
await page.getByRole('button', { name: /Login|Войти|Log in/i }).click()
await page.waitForURL('**/admin', { timeout: 30_000 })
await page.waitForLoadState('networkidle')
await page.screenshot({ path: `${outputDir}/local-admin-dashboard.png`, fullPage: true })

await page.goto(`${baseUrl}/admin/collections/products`, { waitUntil: 'networkidle' })
await page.screenshot({ path: `${outputDir}/local-admin-products.png`, fullPage: true })

await browser.close()
