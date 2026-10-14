import { seed } from '@/data/seed'
import { useCategoriesStore } from './useCategoriesStore'
import { useProductsStore } from './useProductsStore'
import { useSlidesStore } from './useSlidesStore'
import { useSettingsStore } from './useSettingsStore'
import { useQuoteStore } from './useQuoteStore'
import { useEnquiriesStore } from './useEnquiriesStore'
import { useAuthStore } from './useAuthStore'
import { exportAll, importAll, resetAll } from './index'

const baseProduct = {
  name: 'NG-65',
  sku: 'TEST-1',
  brand: 'Northline',
  categoryId: 'cat-generators',
  shortDescription: 'short',
  description: 'long',
  images: [],
  specs: [{ label: 'Power', value: '65 kVA' }],
  stock: 'in_stock' as const,
  featured: false,
}

beforeEach(() => {
  localStorage.clear()
  resetAll()
})

describe('products store', () => {
  test('hydrates from seed', () => {
    expect(useProductsStore.getState().products).toHaveLength(seed.products.length)
  })
  test('add generates id, slug, timestamps', () => {
    const p = useProductsStore.getState().add(baseProduct)
    expect(p.id).toMatch(/^prod-/)
    expect(p.slug).toBe('ng-65')
    expect(p.createdAt).toBeTruthy()
    expect(useProductsStore.getState().products.find((x) => x.id === p.id)).toBeTruthy()
  })
  test('slug is de-duplicated across products', () => {
    const a = useProductsStore.getState().add(baseProduct)
    const b = useProductsStore.getState().add({ ...baseProduct, sku: 'TEST-2' })
    expect(b.slug).toBe(a.slug + '-2')
  })
  test('update keeps slug unique against other products but not itself', () => {
    const a = useProductsStore.getState().add(baseProduct)
    const updated = useProductsStore.getState().update(a.id, { ...baseProduct, slug: 'ng-65' })
    expect(updated.slug).toBe('ng-65')
    const b = useProductsStore.getState().add({ ...baseProduct, sku: 'TEST-2' })
    const clash = useProductsStore.getState().update(b.id, { ...baseProduct, sku: 'TEST-2', slug: 'ng-65' })
    expect(clash.slug).toBe('ng-65-2')
  })
  test('remove deletes the product', () => {
    const a = useProductsStore.getState().add(baseProduct)
    useProductsStore.getState().remove(a.id)
    expect(useProductsStore.getState().products.find((x) => x.id === a.id)).toBeUndefined()
  })
})

describe('categories store', () => {
  test('delete refused when products reference the category', () => {
    const r = useCategoriesStore.getState().remove('cat-generators')
    expect(r).toEqual({ ok: false, reason: expect.stringMatching(/^\d+ products? use this category$/) })
    expect(useCategoriesStore.getState().categories.find((c) => c.id === 'cat-generators')).toBeTruthy()
  })
  test('delete succeeds for an unused category', () => {
    const c = useCategoriesStore.getState().add({ name: 'Spares', description: '', imageUrl: '', sortOrder: 9 })
    expect(c.slug).toBe('spares')
    expect(useCategoriesStore.getState().remove(c.id)).toEqual({ ok: true })
  })
})

describe('slides store', () => {
  test('move swaps sort order with the neighbour', () => {
    const [first, second] = useSlidesStore.getState().slides
    useSlidesStore.getState().move(second.id, -1)
    const ids = useSlidesStore.getState().slides.map((s) => s.id)
    expect(ids[0]).toBe(second.id)
    expect(ids[1]).toBe(first.id)
  })
})

describe('quote store', () => {
  test('add increments existing line', () => {
    useQuoteStore.getState().add('p1', 1)
    useQuoteStore.getState().add('p1', 2)
    expect(useQuoteStore.getState().items).toEqual([{ productId: 'p1', quantity: 3 }])
  })
  test('setQuantity clamps to 999 and removes on 0 or NaN', () => {
    useQuoteStore.getState().add('p1', 1)
    useQuoteStore.getState().setQuantity('p1', 2000)
    expect(useQuoteStore.getState().items[0].quantity).toBe(999)
    useQuoteStore.getState().setQuantity('p1', 0)
    expect(useQuoteStore.getState().items).toHaveLength(0)
    useQuoteStore.getState().add('p2', 1)
    useQuoteStore.getState().setQuantity('p2', Number.NaN)
    expect(useQuoteStore.getState().items).toHaveLength(0)
  })
})

describe('enquiries store', () => {
  test('add assigns reference, timestamp and new status', () => {
    const e = useEnquiriesStore.getState().add({
      name: 'A', company: 'B', email: 'a@b.co', phone: '123', message: 'hello',
      items: [{ productId: 'p1', name: 'NG-65', sku: 'X', quantity: 1 }],
    })
    expect(e.reference).toMatch(/^NL-\d{8}-[A-Z0-9]{4}$/)
    expect(e.status).toBe('new')
    useEnquiriesStore.getState().setStatus(e.id, 'handled')
    expect(useEnquiriesStore.getState().enquiries[0].status).toBe('handled')
  })
})

describe('auth store', () => {
  test('login succeeds only with the settings credentials', () => {
    expect(useAuthStore.getState().login('admin@northline.example', 'wrong')).toBe(false)
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().login('admin@northline.example', 'northline2026')).toBe(true)
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    useAuthStore.getState().logout()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })
  test('login follows updated settings credentials', () => {
    useSettingsStore.getState().update({ admin: { email: 'me@x.co', password: 'pw' } })
    expect(useAuthStore.getState().login('me@x.co', 'pw')).toBe(true)
  })
})

describe('export / import / reset', () => {
  test('importAll rejects malformed data and keeps current stores', () => {
    const r = importAll('{"products": "nope"}')
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.length).toBeGreaterThan(0)
    expect(useProductsStore.getState().products).toHaveLength(seed.products.length)
  })
  test('importAll rejects invalid JSON text', () => {
    const r = importAll('not json')
    expect(r.ok).toBe(false)
  })
  test('export then import round-trips edits', () => {
    const p = useProductsStore.getState().add(baseProduct)
    const json = exportAll()
    resetAll()
    expect(useProductsStore.getState().products.find((x) => x.id === p.id)).toBeUndefined()
    expect(importAll(json)).toEqual({ ok: true })
    expect(useProductsStore.getState().products.find((x) => x.id === p.id)).toBeTruthy()
  })
})
