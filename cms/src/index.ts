type AdminFieldConfig = {
  edit?: Record<string, unknown>
  list?: Record<string, unknown>
}

type AdminConfig = {
  uid: string
  settings: Record<string, unknown>
  metadatas: Record<string, AdminFieldConfig>
  layouts: {
    list: string[]
    editRelations: unknown[]
    edit: { name: string; size: number }[][]
  }
}

async function ensurePublicPermission(strapi: any, action: string) {
  const role = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  })

  if (!role) return

  const existingPermission = await strapi.db.query('plugin::users-permissions.permission').findOne({
    where: {
      action,
      role: role.id,
    },
  })

  if (existingPermission) return

  await strapi.db.query('plugin::users-permissions.permission').create({
    data: {
      action,
      role: role.id,
    },
  })
}

const systemMetadatas = {
  documentId: { edit: {}, list: { label: 'documentId', searchable: true, sortable: true } },
  createdAt: { edit: {}, list: { label: 'Создано', searchable: true, sortable: true } },
  updatedAt: { edit: {}, list: { label: 'Обновлено', searchable: true, sortable: true } },
  createdBy: { edit: {}, list: { label: 'Создал', searchable: false, sortable: false } },
  updatedBy: { edit: {}, list: { label: 'Обновил', searchable: false, sortable: false } },
}

function field(label: string, options: { searchable?: boolean; sortable?: boolean; visible?: boolean; editable?: boolean } = {}) {
  const { searchable = true, sortable = true, visible = true, editable = true } = options

  return {
    edit: { label, visible, editable },
    list: { label, searchable, sortable },
  }
}

async function setAdminConfig(strapi: any, keyPrefix: 'configuration_content_types' | 'configuration_components', value: AdminConfig) {
  const key = `${keyPrefix}::${value.uid}`
  const nextValue = {
    ...value,
    metadatas: {
      ...systemMetadatas,
      ...value.metadatas,
    },
  }

  for (const name of ['content-manager', 'content_manager']) {
    const store = strapi.store({ type: 'plugin', name })
    await store.set({ key, value: nextValue })
  }
}

function contentTypeConfig(
  uid: string,
  settings: AdminConfig['settings'],
  metadatas: AdminConfig['metadatas'],
  edit: AdminConfig['layouts']['edit'],
  list: string[],
): AdminConfig {
  return {
    uid,
    settings,
    metadatas,
    layouts: {
      list,
      editRelations: [],
      edit,
    },
  }
}

async function configureProductAdminView(strapi: any) {
  await setAdminConfig(
    strapi,
    'configuration_content_types',
    contentTypeConfig(
      'api::product.product',
      {
        bulkable: true,
        filterable: true,
        searchable: true,
        pageSize: 25,
        mainField: 'title',
        defaultSortBy: 'title',
        defaultSortOrder: 'ASC',
      },
      {
        id: { edit: {}, list: { label: 'ID', searchable: true, sortable: true } },
        title: field('Название'),
        slug: field('Слаг', { visible: false, editable: false }),
        collection: field('Коллекция', { searchable: false }),
        hardness: field('Жесткость', { searchable: false }),
        shortDescription: field('Краткое описание', { sortable: false }),
        description: field('Описание', { sortable: false }),
        price: field('Базовая цена (резерв)', { searchable: false, visible: false }),
        oldPrice: field('Старая цена (резерв)', { searchable: false, visible: false }),
        image: field('Главное фото', { searchable: false, sortable: false }),
        gallery: field('Дополнительные фото', { searchable: false, sortable: false }),
        reviewVideo: field('Видео-обзор', { searchable: false, sortable: false }),
        sizes: field('Размеры и цены', { searchable: false, sortable: false }),
        details: field('Детали', { searchable: false, sortable: false }),
        benefits: field('Преимущества', { searchable: false, sortable: false }),
        active: field('Активен', { searchable: false }),
        sortOrder: field('Порядок', { searchable: false }),
      },
      [
        [{ name: 'title', size: 12 }],
        [
          { name: 'collection', size: 6 },
          { name: 'hardness', size: 6 },
        ],
        [{ name: 'sortOrder', size: 4 }],
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
      ['title', 'collection', 'active'],
    ),
  )
}

async function configureOrderAdminView(strapi: any) {
  await setAdminConfig(
    strapi,
    'configuration_content_types',
    contentTypeConfig(
      'api::order.order',
      {
        bulkable: true,
        filterable: true,
        searchable: true,
        pageSize: 25,
        mainField: 'orderNumber',
        defaultSortBy: 'createdAt',
        defaultSortOrder: 'DESC',
      },
      {
        id: { edit: {}, list: { label: 'ID', searchable: true, sortable: true } },
        orderNumber: field('Номер заказа'),
        orderStatus: field('Статус', { searchable: false }),
        customerName: field('Имя клиента'),
        phone: field('Телефон'),
        city: field('Город'),
        address: field('Адрес', { sortable: false }),
        paymentMethod: field('Способ оплаты'),
        comment: field('Комментарий', { sortable: false }),
        items: field('Состав заказа', { searchable: false, sortable: false }),
        total: field('Итого', { searchable: false }),
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
    ),
  )
}

async function configureReviewAdminView(strapi: any) {
  await setAdminConfig(
    strapi,
    'configuration_content_types',
    contentTypeConfig(
      'api::review.review',
      {
        bulkable: true,
        filterable: true,
        searchable: true,
        pageSize: 25,
        mainField: 'name',
        defaultSortBy: 'sortOrder',
        defaultSortOrder: 'ASC',
      },
      {
        id: { edit: {}, list: { label: 'ID', searchable: true, sortable: true } },
        name: field('Имя'),
        city: field('Город'),
        text: field('Текст комментария', { sortable: false }),
        rating: field('Оценка', { searchable: false }),
        reviewDate: field('Дата отзыва', { searchable: false }),
        photos: field('Фото клиента', { searchable: false, sortable: false }),
        active: field('Активен', { searchable: false }),
        sortOrder: field('Порядок', { searchable: false }),
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
    ),
  )
}

async function configureLandingSettingsAdminView(strapi: any) {
  await setAdminConfig(
    strapi,
    'configuration_content_types',
    contentTypeConfig(
      'api::landing-setting.landing-setting',
      {
        bulkable: false,
        filterable: true,
        searchable: true,
        pageSize: 25,
        mainField: 'productionAlt',
        defaultSortBy: 'id',
        defaultSortOrder: 'ASC',
      },
      {
        id: { edit: {}, list: { label: 'ID', searchable: true, sortable: true } },
        productionVideo: field('Видео производства', { searchable: false, sortable: false }),
        productionFallbackImage: field('Фото, если видео не загрузилось', { searchable: false, sortable: false }),
        productionAlt: field('Описание медиа'),
        mainPhone: field('Основной телефон'),
        wholesalePhone: field('Оптовый телефон'),
        email: field('Email'),
        workHours: field('Часы работы'),
        whatsappPhone: field('WhatsApp (цифры)'),
        instagramUrl: field('Instagram (ссылка)', { searchable: false, sortable: false }),
        tiktokUrl: field('TikTok (ссылка)', { searchable: false, sortable: false }),
        kaspiUrl: field('Kaspi магазин (ссылка)', { searchable: false, sortable: false }),
        cityPhones: field('Телефоны по городам', { searchable: false, sortable: false }),
        addresses: field('Адреса точек', { searchable: false, sortable: false }),
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
      ['productionAlt', 'mainPhone'],
    ),
  )
}

async function configureComponentAdminViews(strapi: any) {
  const components: AdminConfig[] = [
    contentTypeConfig(
      'product.size',
      { mainField: 'size' },
      {
        id: { edit: {}, list: { label: 'ID', searchable: true, sortable: true } },
        size: field('Размер'),
        price: field('Цена до скидки', { searchable: false }),
        discountPercent: field('Скидка %', { searchable: false }),
      },
      [
        [
          { name: 'size', size: 4 },
          { name: 'price', size: 4 },
          { name: 'discountPercent', size: 4 },
        ],
      ],
      ['size', 'price', 'discountPercent'],
    ),
    contentTypeConfig(
      'product.gallery-image',
      { mainField: 'id' },
      {
        id: { edit: {}, list: { label: 'ID', searchable: true, sortable: true } },
        image: field('Фото', { searchable: false, sortable: false }),
      },
      [[{ name: 'image', size: 12 }]],
      ['image'],
    ),
    contentTypeConfig(
      'product.benefit',
      { mainField: 'title' },
      {
        id: { edit: {}, list: { label: 'ID', searchable: true, sortable: true } },
        title: field('Заголовок'),
        text: field('Текст', { sortable: false }),
      },
      [
        [{ name: 'title', size: 12 }],
        [{ name: 'text', size: 12 }],
      ],
      ['title'],
    ),
    contentTypeConfig(
      'product.detail',
      { mainField: 'label' },
      {
        id: { edit: {}, list: { label: 'ID', searchable: true, sortable: true } },
        label: field('Название'),
        value: field('Значение'),
      },
      [
        [
          { name: 'label', size: 6 },
          { name: 'value', size: 6 },
        ],
      ],
      ['label', 'value'],
    ),
    contentTypeConfig(
      'contact.city-phone',
      { mainField: 'city' },
      {
        id: { edit: {}, list: { label: 'ID', searchable: true, sortable: true } },
        city: field('Город'),
        phone: field('Телефон'),
      },
      [
        [
          { name: 'city', size: 6 },
          { name: 'phone', size: 6 },
        ],
      ],
      ['city', 'phone'],
    ),
    contentTypeConfig(
      'contact.address-line',
      { mainField: 'city' },
      {
        id: { edit: {}, list: { label: 'ID', searchable: true, sortable: true } },
        city: field('Город'),
        lines: field('Адреса', { sortable: false }),
      },
      [
        [{ name: 'city', size: 12 }],
        [{ name: 'lines', size: 12 }],
      ],
      ['city'],
    ),
    contentTypeConfig(
      'order.item',
      { mainField: 'title' },
      {
        id: { edit: {}, list: { label: 'ID', searchable: true, sortable: true } },
        productId: field('ID товара'),
        title: field('Товар'),
        size: field('Размер'),
        quantity: field('Количество', { searchable: false }),
        price: field('Цена', { searchable: false }),
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
    ),
  ]

  for (const component of components) {
    await setAdminConfig(strapi, 'configuration_components', component)
  }
}

const PRODUCT_UID = 'api::product.product'

export default {
  register({ strapi }: { strapi: any }) {
    // Auto-generate a unique slug for products when none is provided.
    //
    // This must live in a document-service middleware, NOT a content-type
    // lifecycle: entity validation (which requires a non-empty `slug`) runs
    // before DB lifecycles fire, so a `beforeCreate` hook is too late and the
    // create still fails with "slug must be defined." Middlewares wrap the
    // whole document-service call and run before validation.
    //
    // `generateUIDField` slugifies `title` and guarantees uniqueness by
    // appending -1, -2, ... when a matching slug already exists.
    strapi.documents.use(async (ctx: any, next: any) => {
      if (ctx.uid === PRODUCT_UID && (ctx.action === 'create' || ctx.action === 'update')) {
        const data = ctx.params?.data
        if (data) {
          const slug = typeof data.slug === 'string' ? data.slug.trim() : data.slug
          const title = typeof data.title === 'string' ? data.title.trim() : ''

          if (!slug && title) {
            data.slug = await strapi
              .plugin('content-manager')
              .service('uid')
              .generateUIDField({ contentTypeUID: PRODUCT_UID, field: 'slug', data })
          }
        }
      }

      return next()
    })
  },

  async bootstrap({ strapi }: { strapi: any }) {
    const publicActions = [
      'api::product.product.find',
      'api::product.product.findOne',
      'api::review.review.find',
      'api::review.review.findOne',
      'api::landing-setting.landing-setting.find',
      'api::order.order.create',
    ]

    for (const action of publicActions) {
      await ensurePublicPermission(strapi, action)
    }

    await configureProductAdminView(strapi)
    await configureOrderAdminView(strapi)
    await configureReviewAdminView(strapi)
    await configureLandingSettingsAdminView(strapi)
    await configureComponentAdminViews(strapi)
  },
}
