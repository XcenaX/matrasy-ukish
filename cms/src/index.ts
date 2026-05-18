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

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: any }) {
    const publicActions = [
      'api::product.product.find',
      'api::product.product.findOne',
      'api::order.order.create',
    ]

    for (const action of publicActions) {
      await ensurePublicPermission(strapi, action)
    }

    await configureProductListView(strapi)
  },
}
