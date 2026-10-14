import { applyFilters, type ProductFilters } from './useProductFilters'
import { seed } from '@/data/seed'

const base: ProductFilters = { category: '', q: '', availability: '', sort: 'featured' }
const run = (f: Partial<ProductFilters>) => applyFilters(seed.products, seed.categories, { ...base, ...f })

test('no filters returns every product', () => {
  expect(run({})).toHaveLength(seed.products.length)
})

test('category slug filters to that category', () => {
  const r = run({ category: 'generators' })
  expect(r.length).toBeGreaterThan(0)
  expect(r.every((p) => p.categoryId === 'cat-generators')).toBe(true)
})

test('unknown category slug yields an empty list, not a crash', () => {
  expect(run({ category: 'does-not-exist' })).toEqual([])
})

test('text search matches name, sku and brand case-insensitively', () => {
  expect(run({ q: 'gen-ng65' }).map((p) => p.sku)).toEqual(['GEN-NG65'])
  expect(run({ q: 'DEWALT' }).every((p) => p.brand === 'DeWalt')).toBe(true)
  expect(run({ q: 'forklift' }).length).toBeGreaterThanOrEqual(3)
})

test('availability filter', () => {
  expect(run({ availability: 'on_order' }).every((p) => p.stock === 'on_order')).toBe(true)
})

test('sort by name, newest and featured first', () => {
  const names = run({ sort: 'name' }).map((p) => p.name)
  expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
  const newest = run({ sort: 'newest' })
  expect(newest[0].createdAt >= newest[newest.length - 1].createdAt).toBe(true)
  const featured = run({ sort: 'featured' })
  const firstNonFeatured = featured.findIndex((p) => !p.featured)
  expect(featured.slice(0, firstNonFeatured).every((p) => p.featured)).toBe(true)
})
