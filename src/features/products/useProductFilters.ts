import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Category, Product, StockStatus } from '@/types'
import { useCategoriesStore, useProductsStore } from '@/stores'

export type SortKey = 'featured' | 'name' | 'newest'

export interface ProductFilters {
  category: string
  q: string
  availability: '' | StockStatus
  sort: SortKey
}

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured first' },
  { value: 'name', label: 'Name A to Z' },
  { value: 'newest', label: 'Newest' },
]

const STOCK_VALUES: StockStatus[] = ['in_stock', 'on_order', 'enquire']

export function applyFilters(products: Product[], categories: Category[], f: ProductFilters): Product[] {
  let list = products
  if (f.category) {
    const cat = categories.find((c) => c.slug === f.category)
    if (!cat) return []
    list = list.filter((p) => p.categoryId === cat.id)
  }
  if (f.availability) list = list.filter((p) => p.stock === f.availability)
  const q = f.q.trim().toLowerCase()
  if (q) {
    list = list.filter((p) =>
      [p.name, p.sku, p.brand, p.shortDescription].some((s) => s.toLowerCase().includes(q)),
    )
  }
  const sorted = [...list]
  switch (f.sort) {
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'newest':
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      break
    default:
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name))
  }
  return sorted
}

export function useProductFilters() {
  const [params, setParams] = useSearchParams()
  const products = useProductsStore((s) => s.products)
  const categories = useCategoriesStore((s) => s.categories)

  const filters = useMemo<ProductFilters>(() => {
    const availability = params.get('availability') ?? ''
    const sort = params.get('sort') ?? 'featured'
    return {
      category: params.get('category') ?? '',
      q: params.get('q') ?? '',
      availability: STOCK_VALUES.includes(availability as StockStatus) ? (availability as StockStatus) : '',
      sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortKey) : 'featured',
    }
  }, [params])

  const setFilter = useCallback(
    (key: keyof ProductFilters, value: string) => {
      const next = new URLSearchParams(params)
      if (value) next.set(key, value)
      else next.delete(key)
      setParams(next, { replace: true, preventScrollReset: true })
    },
    [params, setParams],
  )

  const clear = useCallback(() => setParams(new URLSearchParams(), { replace: true, preventScrollReset: true }), [setParams])

  const results = useMemo(() => applyFilters(products, categories, filters), [products, categories, filters])

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const p of products) c[p.categoryId] = (c[p.categoryId] ?? 0) + 1
    return c
  }, [products])

  const activeCount = [filters.category, filters.q, filters.availability].filter(Boolean).length

  return { filters, setFilter, clear, results, counts, categories, activeCount }
}
