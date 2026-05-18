import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const baseUrl = 'http://127.0.0.1:1337'
const screenshotDir = path.resolve('screenshots')
const orderUrl =
  `${baseUrl}/admin/content-manager/collection-types/api::order.order/yz3xmrhfp1r4pmattq0k0zy8`
const productUrl =
  `${baseUrl}/admin/content-manager/collection-types/api::product.product/pt1ml8hstvln2tuesjpo4g9y`

await mkdir(screenshotDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 })
await page.addInitScript(() => {
  window.localStorage.setItem('strapi-admin-language', 'ru')
  window.localStorage.setItem(
    'STRAPI_GUIDED_TOUR',
    JSON.stringify({
      enabled: false,
      hidden: true,
      completedActions: [],
      tours: {
        contentTypeBuilder: { currentStep: 0, isCompleted: true },
        contentManager: { currentStep: 0, isCompleted: true },
        apiTokens: { currentStep: 0, isCompleted: true },
        strapiCloud: { currentStep: 0, isCompleted: true },
      },
    }),
  )
})

async function login() {
  await page.goto(`${baseUrl}/admin`, { waitUntil: 'domcontentloaded' })
  await page.waitForLoadState('networkidle').catch(() => undefined)

  const email = page.locator('input[name="email"]')
  await email.waitFor({ state: 'visible', timeout: 20000 }).catch(() => undefined)
  if (await email.count()) {
    await email.fill('admin@ukish.local')
    await page.locator('input[name="password"]').fill('UkishAdmin123!')
    await page.locator('button[type="submit"]').click()
    await page.waitForURL(/\/admin(?!\/auth\/login)/, { timeout: 30000 }).catch(() => undefined)
    await page.waitForLoadState('networkidle').catch(() => undefined)
  }
}

async function waitForAdminPage() {
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('networkidle').catch(() => undefined)
  await page.locator('body').waitFor({ state: 'visible', timeout: 20000 })
}

await login()

await page.goto(orderUrl, { waitUntil: 'domcontentloaded' })
await waitForAdminPage()
await page.screenshot({ path: path.join(screenshotDir, 'strapi-order-edit.png'), fullPage: true })

await page.goto(productUrl, { waitUntil: 'domcontentloaded' })
await waitForAdminPage()
await page.screenshot({ path: path.join(screenshotDir, 'strapi-product-edit.png'), fullPage: true })

await page.goto(`${baseUrl}/admin/content-manager/collection-types/api::product.product`, {
  waitUntil: 'domcontentloaded',
})
await waitForAdminPage()
await page.screenshot({ path: path.join(screenshotDir, 'strapi-products-list.png'), fullPage: true })

const checks = await page.evaluate(() => {
  const bodyText = document.body.innerText
  const links = Array.from(document.querySelectorAll('a')).map((link) => ({
    text: link.textContent?.trim() || '',
    href: link.getAttribute('href') || '',
    display: getComputedStyle(link).display,
  }))

  return {
    hiddenLinks: links.filter((link) =>
      /content-type-builder|marketplace|settings/i.test(`${link.href} ${link.text}`),
    ),
    hasEnglishContentBuilder: /Content-Type Builder|Content-type builder/i.test(bodyText),
    hasMarketplace: /Marketplace/i.test(bodyText),
    hasSettings: /Settings/i.test(bodyText),
  }
})

await browser.close()
console.log(JSON.stringify(checks, null, 2))
