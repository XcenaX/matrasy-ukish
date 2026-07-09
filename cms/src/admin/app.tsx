import type { StrapiApp } from '@strapi/strapi/admin'
import { unstable_useContentManagerContext, useFetchClient, useForm } from '@strapi/strapi/admin'
import * as React from 'react'

import './custom.css'

const PRODUCT_UID = 'api::product.product'

/**
 * Pre-fills the "Преимущества" repeatable component on the product CREATE form
 * with the editable default list stored on the landing settings single type.
 *
 * Rendered inside the content-manager edit view (within its Form provider via
 * the `editView.right-links` injection zone), so it can use `useForm` to add
 * rows. Runs once, only when creating a new product that has no benefits yet;
 * the editor can still edit/remove them before saving.
 */
function DefaultBenefitsPrefill() {
  const { model, isCreatingEntry } = unstable_useContentManagerContext()
  const { get } = useFetchClient()
  const addFieldRow = useForm('DefaultBenefitsPrefill', (state) => state.addFieldRow)
  const benefits = useForm('DefaultBenefitsPrefill', (state) => state.values?.benefits)
  const applied = React.useRef(false)

  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.info(
      '[UKISH prefill] tick ' +
        JSON.stringify({
          model: String(model),
          isCreatingEntry,
          benefitsType: Array.isArray(benefits) ? `array(${benefits.length})` : typeof benefits,
          addFieldRowType: typeof addFieldRow,
          applied: applied.current,
        }),
    )

    if (applied.current) return
    if (model !== PRODUCT_UID || !isCreatingEntry) {
      // eslint-disable-next-line no-console
      console.info('[UKISH prefill] guard-1 skip (model/create)')
      return
    }
    if (Array.isArray(benefits) && benefits.length > 0) {
      // eslint-disable-next-line no-console
      console.info('[UKISH prefill] guard-2 skip (benefits not empty)')
      return
    }

    applied.current = true

    get('/content-manager/single-types/api::landing-setting.landing-setting')
      .then((res: any) => {
        const data = res?.data?.data ?? res?.data
        const defaults = Array.isArray(data?.defaultBenefits) ? data.defaultBenefits : []
        // eslint-disable-next-line no-console
        console.info('[UKISH prefill] fetched defaults', defaults.length, 'addFieldRow=', typeof addFieldRow)

        defaults.forEach((benefit: { title?: string; text?: string }) => {
          addFieldRow('benefits', { title: benefit?.title ?? '', text: benefit?.text ?? '' })
        })
      })
      .catch((err: any) => {
        applied.current = false
        // eslint-disable-next-line no-console
        console.error('[UKISH prefill] fetch failed', err?.message || err)
      })
  }, [model, isCreatingEntry, benefits, addFieldRow, get])

  return null
}

if (typeof window !== 'undefined') {
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
  document.documentElement.lang = 'ru'
}

const hiddenAdminLinkPatterns = ['/plugins/content-type-builder', '/marketplace', '/settings']

function polishAdminNavigation() {
  if (typeof document === 'undefined') return

  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
    const href = link.getAttribute('href') || ''

    if (hiddenAdminLinkPatterns.some((pattern) => href.includes(pattern))) {
      link.style.setProperty('display', 'none', 'important')
      link.closest('li')?.setAttribute('hidden', 'true')
    }

    if (href === '/admin' && link.getAttribute('aria-label') === 'Home') {
      link.setAttribute('aria-label', 'Главная')
      link.setAttribute('title', 'Главная')
    }

    if (href.includes('/content-manager/collection-types/plugin::users-permissions.user')) {
      const label = link.textContent?.trim()
      if (label === 'User' || label === 'Users') {
        link.textContent = 'Пользователи'
        link.style.setProperty('align-items', 'center', 'important')
        link.style.setProperty('color', '#32324d', 'important')
        link.style.setProperty('display', 'flex', 'important')
        link.style.setProperty('font-size', '14px', 'important')
        link.style.setProperty('font-weight', '500', 'important')
        link.style.setProperty('min-height', '32px', 'important')
        link.style.setProperty('padding', '0 12px', 'important')
      }
    }
  })
}

export default {
  config: {
    locales: ['ru'],
    tutorials: false,
    notifications: {
      releases: false,
    },
    translations: {
      ru: {
        'app.components.LeftMenu.navbrand.title': 'UKISH',
        'app.components.LeftMenu.navbrand.workplace': 'Администрирование',
        'app.components.HomePage.welcome': 'Панель управления UKISH',
        'app.components.HomePage.welcome.again': 'Панель управления UKISH',
        'app.components.HomePage.welcomeBlock.content.again': 'Управляйте товарами и заказами магазина.',
        'global.content-manager': 'Контент',
        'global.marketplace': 'Маркетплейс',
        'global.settings': 'Настройки',
        clearLabel: 'Очистить',
        'search.placeholder': 'Поиск',
        'Settings.profile.form.section.experience.interfaceLanguage': 'Язык интерфейса',
        'content-manager.plugin.name': 'Контент',
        'content-manager.containers.ListPage.displayedFields': 'Поля таблицы',
        'content-manager.containers.ListPage.table-headers.publishedAt': 'Публикация',
        'content-manager.containers.ListPage.table-headers.createdAt': 'Создано',
        'content-manager.containers.ListPage.table-headers.updatedAt': 'Обновлено',
        'content-manager.containers.List.draft': 'Черновик',
        'content-manager.containers.List.published': 'Опубликован',
        'content-manager.containers.edit.panels.default.title': 'Запись',
        'content-manager.containers.edit.panels.default.more-actions': 'Дополнительные действия',
        'content-manager.containers.edit.title.new': 'Создать запись',
        'content-manager.containers.edit.header.more-actions': 'Дополнительные действия',
        'content-manager.containers.edit.tabs.draft': 'Черновик',
        'content-manager.containers.edit.tabs.published': 'Опубликовано',
        'content-manager.containers.edit.tabs.label': 'Статус записи',
        'content-manager.preview.panel.title': 'Предпросмотр',
        'content-manager.preview.panel.button-configuration': 'Настроить предпросмотр',
        'content-manager.components.LeftMenu.collection-types': 'Разделы',
        'content-manager.components.LeftMenu.single-types': 'Одиночные разделы',
        'content-manager.components.TableDelete.delete': 'Удалить',
        'app.utils.defaultMessage': 'Загрузить',
        'app.components.Button.cancel': 'Отмена',
        'app.components.Button.save': 'Сохранить',
        'app.components.Button.confirm': 'Подтвердить',
        'global.back': 'Назад',
        'global.search': 'Поиск',
        'global.filters': 'Фильтры',
        'global.create': 'Создать',
        'global.delete': 'Удалить',
        'global.edit': 'Редактировать',
        'global.save': 'Сохранить',
        'global.publish': 'Опубликовать',
        'global.unpublish': 'Снять с публикации',
      },
    },
  },
  bootstrap(app: StrapiApp) {
    polishAdminNavigation()
    const observer = new MutationObserver(polishAdminNavigation)
    observer.observe(document.body, { childList: true, subtree: true })

    app.getPlugin('content-manager').injectComponent('editView', 'right-links', {
      name: 'ukish-default-benefits-prefill',
      Component: DefaultBenefitsPrefill,
    })

    console.info('UKISH admin customization loaded', Boolean(app))
  },
}
