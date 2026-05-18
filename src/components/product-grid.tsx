"use client"

import { useEffect, useMemo, useState } from 'react'

import { type StoreProduct } from '@/lib/seed-data'

import { ProductCard } from './product-card'

type CollectionFilter = 'all' | 'premium' | 'ortho' | 'kids' | 'basic' | 'accessories'
type HardnessFilter = 'all' | 'soft' | 'medium' | 'hard' | 'dual'
type SortOption = 'popular' | 'price-asc' | 'price-desc'

const collectionFilters: { label: string; value: CollectionFilter }[] = [
  { label: 'Все коллекции', value: 'all' },
  { label: 'Премиум', value: 'premium' },
  { label: 'Ортопедические', value: 'ortho' },
  { label: 'Детские', value: 'kids' },
  { label: 'Базовые', value: 'basic' },
  { label: 'Аксессуары', value: 'accessories' },
]

const hardnessFilters: { label: string; value: HardnessFilter }[] = [
  { label: 'Любая жесткость', value: 'all' },
  { label: 'Мягкий', value: 'soft' },
  { label: 'Средней жесткости', value: 'medium' },
  { label: 'Жесткий', value: 'hard' },
  { label: 'Разносторонний', value: 'dual' },
]

const sortOptions: { label: string; value: SortOption }[] = [
  { label: 'По популярности', value: 'popular' },
  { label: 'Сначала дешевле', value: 'price-asc' },
  { label: 'Сначала дороже', value: 'price-desc' },
]

const PAGE_SIZE = 9

function filterAndSortProducts(
  products: StoreProduct[],
  collection: CollectionFilter,
  hardness: HardnessFilter,
  sort: SortOption,
) {
  const result = products
    .filter((product) => product.active !== false)
    .filter((product) => collection === 'all' || product.collection === collection)
    .filter((product) => hardness === 'all' || product.hardness === hardness)

  result.sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price

    return (a.sortOrder ?? 100) - (b.sortOrder ?? 100)
  })

  return result
}

function buildProductsUrl(collection: CollectionFilter, hardness: HardnessFilter, sort: SortOption) {
  const params = new URLSearchParams()

  if (collection !== 'all') params.set('collection', collection)
  if (hardness !== 'all') params.set('hardness', hardness)
  if (sort !== 'popular') params.set('sort', sort)

  const query = params.toString()
  return query ? `/api/products?${query}` : '/api/products'
}

export function ProductGrid({ initialProducts, limit }: { initialProducts: StoreProduct[]; limit?: number }) {
  const [products, setProducts] = useState(initialProducts)
  const [collection, setCollection] = useState<CollectionFilter>('all')
  const [hardness, setHardness] = useState<HardnessFilter>('all')
  const [sort, setSort] = useState<SortOption>('popular')
  const [visibleCount, setVisibleCount] = useState(limit ?? PAGE_SIZE)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (limit) return

    const params = new URLSearchParams(window.location.search)
    const initialCollection = params.get('collection')
    const initialHardness = params.get('hardness')
    const initialSort = params.get('sort')

    if (initialCollection && collectionFilters.some((item) => item.value === initialCollection)) {
      setCollection(initialCollection as CollectionFilter)
    }

    if (initialHardness && hardnessFilters.some((item) => item.value === initialHardness)) {
      setHardness(initialHardness as HardnessFilter)
    }

    if (initialSort && sortOptions.some((item) => item.value === initialSort)) {
      setSort(initialSort as SortOption)
    }
  }, [limit])

  useEffect(() => {
    if (limit) return

    const url = buildProductsUrl(collection, hardness, sort)
    const controller = new AbortController()

    setIsLoading(true)

    fetch(url, { signal: controller.signal })
      .then((response) => response.json())
      .then((data: { docs?: StoreProduct[] }) => {
        setProducts(data.docs || [])
      })
      .catch(() => {
        setProducts(filterAndSortProducts(initialProducts, collection, hardness, sort))
      })
      .finally(() => setIsLoading(false))

    window.history.replaceState(null, '', url.replace('/api/products', '/catalog'))

    return () => controller.abort()
  }, [collection, hardness, sort, initialProducts, limit])

  useEffect(() => {
    setVisibleCount(limit ?? PAGE_SIZE)
  }, [collection, hardness, sort, limit])

  const filteredProducts = useMemo(() => {
    if (!limit) return products

    return filterAndSortProducts(products, 'all', 'all', 'popular')
  }, [products, limit])

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, limit ?? visibleCount),
    [filteredProducts, limit, visibleCount],
  )

  const gridClassName = limit
    ? 'grid gap-6 md:grid-cols-2 xl:grid-cols-4'
    : 'grid gap-6 md:grid-cols-2 xl:grid-cols-3'

  const resetFilters = () => {
    setCollection('all')
    setHardness('all')
    setSort('popular')
  }

  if (limit) {
    return (
      <div className={gridClassName}>
        {visibleProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-10 xl:grid-cols-[300px_1fr]">
      <aside className="border border-slate-200 bg-white p-6 xl:sticky xl:top-8 xl:self-start">
        <FilterGroup
          title="Коллекция"
          items={collectionFilters}
          value={collection}
          onChange={setCollection}
        />

        <FilterGroup
          title="Жесткость"
          items={hardnessFilters}
          value={hardness}
          onChange={setHardness}
        />

        <button
          className="mt-2 inline-flex min-h-11 items-center border border-slate-200 px-5 text-[11px] uppercase tracking-[0.18em] text-slate-500 hover:border-[var(--gold)] hover:text-[#111827]"
          type="button"
          onClick={resetFilters}
        >
          Сбросить фильтры
        </button>
      </aside>

      <div>
        <div className="mb-8 flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Найдено товаров: <span className="font-medium text-[#111827]">{filteredProducts.length}</span>
            {isLoading ? <span className="ml-3 text-slate-400">Обновляем...</span> : null}
          </p>

          <label className="flex items-center gap-3 text-sm text-slate-500">
            Сортировать:
            <select
              className="w-auto min-w-52 border border-slate-200 bg-white px-4 py-3 font-medium text-[#111827] outline-none focus:border-[var(--gold)]"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {visibleProducts.length ? (
          <div className={gridClassName}>
            {visibleProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="border border-slate-200 bg-white px-8 py-14 text-center">
            <p className="text-lg font-medium text-[#111827]">Ничего не найдено</p>
            <p className="mt-3 text-sm text-slate-500">Попробуйте выбрать другую коллекцию или жесткость.</p>
          </div>
        )}

        {visibleCount < filteredProducts.length && (
          <div className="mt-16 text-center">
            <button
              className="border border-[var(--gold)] px-14 py-4 text-[10px] uppercase tracking-[0.22em] text-[var(--gold)]"
              type="button"
              onClick={() => setVisibleCount((current) => current + PAGE_SIZE)}
            >
              Показать еще
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function FilterGroup<T extends string>({
  title,
  items,
  value,
  onChange,
}: {
  title: string
  items: { label: string; value: T }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="mb-10">
      <h2 className="mb-5 text-[11px] uppercase tracking-[0.22em] text-[#111827]">{title}</h2>

      <div className="flex flex-wrap gap-3 xl:block xl:space-y-3">
        {items.map((item) => {
          const isActive = item.value === value

          return (
            <button
              key={item.value}
              type="button"
              aria-pressed={isActive}
              className={`inline-flex min-h-10 items-center gap-3 border px-4 text-left text-sm ${
                isActive
                  ? 'border-[var(--gold)] bg-[var(--gold)]/10 text-[#111827]'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-[var(--gold)] hover:text-[#111827]'
              }`}
              onClick={() => onChange(item.value)}
            >
              <span
                className={`h-3 w-3 border ${
                  isActive ? 'border-[var(--gold)] bg-[var(--gold)]' : 'border-slate-300'
                }`}
              />
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
