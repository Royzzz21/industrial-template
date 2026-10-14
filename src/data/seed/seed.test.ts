import { seed } from './index'

test('has six categories', () => {
  expect(seed.categories).toHaveLength(6)
})

test('has at least eighteen products, each in a known category', () => {
  expect(seed.products.length).toBeGreaterThanOrEqual(18)
  const catIds = new Set(seed.categories.map((c) => c.id))
  for (const p of seed.products) expect(catIds.has(p.categoryId)).toBe(true)
})

test('product slugs and skus are unique', () => {
  expect(new Set(seed.products.map((p) => p.slug)).size).toBe(seed.products.length)
  expect(new Set(seed.products.map((p) => p.sku)).size).toBe(seed.products.length)
})

test('every product has an image and at least four specs', () => {
  for (const p of seed.products) {
    expect(p.images.length).toBeGreaterThanOrEqual(1)
    expect(p.specs.length).toBeGreaterThanOrEqual(4)
  }
})

test('has enabled slides and featured products for the home page', () => {
  expect(seed.slides.filter((s) => s.enabled).length).toBeGreaterThanOrEqual(3)
  expect(seed.products.filter((p) => p.featured).length).toBeGreaterThanOrEqual(6)
  expect(seed.testimonials).toHaveLength(3)
})

test('settings carry the demo admin credentials', () => {
  expect(seed.settings.admin).toEqual({ email: 'user', password: '123' })
})
