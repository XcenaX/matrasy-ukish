/**
 * product lifecycles
 *
 * Гарантирует, что у товара всегда есть `slug`, даже если админка не
 * подставила его автоматически (типичная ситуация при заполнении только
 * кириллического `title`). Без этого создание падает с ошибкой
 * "slug must be defined." из серверной валидации Strapi.
 */

const CONTENT_TYPE_UID = 'api::product.product'

async function ensureSlug(data: Record<string, unknown>): Promise<void> {
  if (!data) return

  const slug = typeof data.slug === 'string' ? data.slug.trim() : data.slug
  if (slug) return

  const title = typeof data.title === 'string' ? data.title.trim() : ''
  if (!title) return

  const uidService = strapi.plugin('content-manager').service('uid')
  data.slug = await uidService.generateUIDField({
    contentTypeUID: CONTENT_TYPE_UID,
    field: 'slug',
    data,
  })
}

export default {
  async beforeCreate(event: { params: { data: Record<string, unknown> } }) {
    await ensureSlug(event.params.data)
  },

  async beforeUpdate(event: { params: { data: Record<string, unknown> } }) {
    await ensureSlug(event.params.data)
  },
}
