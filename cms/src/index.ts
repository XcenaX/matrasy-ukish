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

async function configureProductListView(strapi: any) {
  const storeKey = 'configuration_content_types::api::product.product'
  const store = strapi.store({ type: 'plugin', name: 'content-manager' })
  const existing = await store.get({ key: storeKey })

  // Не перезаписываем если уже настроено вручную
  if (existing?.layouts?.list?.length) return

  await store.set({
    key: storeKey,
    value: {
      uid: 'api::product.product',
      settings: {
        bulkable: true,
        filterable: true,
        searchable: true,
        pageSize: 25,
        mainField: 'title',
        defaultSortBy: 'title',
        defaultSortOrder: 'ASC',
      },
      metadatas: {
        id:         { edit: {}, list: { label: 'ID', searchable: true, sortable: true } },
        title:      { edit: { label: 'Название', visible: true, editable: true }, list: { label: 'Название', searchable: true, sortable: true } },
        slug:       { edit: { label: 'Слаг', visible: true, editable: true },     list: { label: 'Слаг', searchable: true, sortable: true } },
        collection: { edit: { label: 'Коллекция', visible: true, editable: true }, list: { label: 'Коллекция', searchable: false, sortable: true } },
        price:      { edit: { label: 'Цена', visible: true, editable: true },      list: { label: 'Цена', searchable: false, sortable: true } },
        active:     { edit: { label: 'Активен', visible: true, editable: true },   list: { label: 'Активен', searchable: false, sortable: true } },
      },
      layouts: {
        list: ['title', 'collection', 'price', 'active'],
        editRelations: [],
        edit: [
          [{ name: 'title', size: 6 }, { name: 'slug', size: 6 }],
          [{ name: 'collection', size: 4 }, { name: 'hardness', size: 4 }, { name: 'active', size: 4 }],
          [{ name: 'price', size: 4 }, { name: 'oldPrice', size: 4 }, { name: 'sortOrder', size: 4 }],
          [{ name: 'shortDescription', size: 12 }],
          [{ name: 'description', size: 12 }],
          [{ name: 'image', size: 12 }],
        ],
      },
    },
  })
}

async function setContentManagerConfig(strapi: any, uid: string, value: any) {
  const key = `configuration_content_types::${uid}`
  const storeNames = ['content-manager', 'content_manager']

  for (const name of storeNames) {
    const store = strapi.store({ type: 'plugin', name })
    await store.set({ key, value })
  }
}

async function configureReviewAdminView(strapi: any) {
  await setContentManagerConfig(strapi, 'api::review.review', {
    uid: 'api::review.review',
    settings: {
      bulkable: true,
      filterable: true,
      searchable: true,
      pageSize: 25,
      mainField: 'name',
      defaultSortBy: 'sortOrder',
      defaultSortOrder: 'ASC',
    },
    metadatas: {
      id: { edit: {}, list: { label: 'ID', searchable: true, sortable: true } },
      name: { edit: { label: 'Имя', visible: true, editable: true }, list: { label: 'Имя', searchable: true, sortable: true } },
      city: { edit: { label: 'Город', visible: true, editable: true }, list: { label: 'Город', searchable: true, sortable: true } },
      text: { edit: { label: 'Текст комментария', visible: true, editable: true }, list: { label: 'Текст комментария', searchable: true, sortable: false } },
      rating: { edit: { label: 'Оценка', visible: true, editable: true }, list: { label: 'Оценка', searchable: false, sortable: true } },
      reviewDate: { edit: { label: 'Дата отзыва', visible: true, editable: true }, list: { label: 'Дата отзыва', searchable: false, sortable: true } },
      photos: { edit: { label: 'Фото клиента', visible: true, editable: true }, list: { label: 'Фото клиента', searchable: false, sortable: false } },
      active: { edit: { label: 'Активен', visible: true, editable: true }, list: { label: 'Активен', searchable: false, sortable: true } },
      sortOrder: { edit: { label: 'Порядок', visible: true, editable: true }, list: { label: 'Порядок', searchable: false, sortable: true } },
    },
    layouts: {
      list: ['name', 'rating', 'city', 'active'],
      editRelations: [],
      edit: [
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
    },
  })
}

async function configureLandingSettingsAdminView(strapi: any) {
  await setContentManagerConfig(strapi, 'api::landing-setting.landing-setting', {
    uid: 'api::landing-setting.landing-setting',
    settings: {
      bulkable: false,
      filterable: true,
      searchable: true,
      pageSize: 25,
      mainField: 'productionAlt',
      defaultSortBy: 'id',
      defaultSortOrder: 'ASC',
    },
    metadatas: {
      id: { edit: {}, list: { label: 'ID', searchable: true, sortable: true } },
      productionVideo: { edit: { label: 'Видео производства', visible: true, editable: true }, list: { label: 'Видео производства', searchable: false, sortable: false } },
      productionFallbackImage: { edit: { label: 'Фото, если видео не загрузилось', visible: true, editable: true }, list: { label: 'Фото, если видео не загрузилось', searchable: false, sortable: false } },
      productionAlt: { edit: { label: 'Описание медиа', visible: true, editable: true }, list: { label: 'Описание медиа', searchable: true, sortable: true } },
    },
    layouts: {
      list: ['productionAlt'],
      editRelations: [],
      edit: [
        [{ name: 'productionVideo', size: 12 }],
        [{ name: 'productionFallbackImage', size: 12 }],
        [{ name: 'productionAlt', size: 12 }],
      ],
    },
  })
}

export default {
  register() {},

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

    await configureProductListView(strapi)
    await configureReviewAdminView(strapi)
    await configureLandingSettingsAdminView(strapi)
  },
}
