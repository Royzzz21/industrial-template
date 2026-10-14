import { resetAll, useProductsStore } from './index'
import { STORAGE_ERROR_EVENT } from './persist'

const base = {
  name: 'Quota test', sku: 'Q-1', brand: '', categoryId: 'cat-generators', shortDescription: 's', description: '',
  images: [], specs: [], stock: 'in_stock' as const, featured: false,
}

beforeEach(() => resetAll())

test('a storage quota error does not throw from the store action and raises an event', () => {
  const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('quota', 'QuotaExceededError')
  })
  const handler = vi.fn()
  window.addEventListener(STORAGE_ERROR_EVENT, handler)
  expect(() => useProductsStore.getState().add(base)).not.toThrow()
  expect(useProductsStore.getState().products.some((p) => p.sku === 'Q-1')).toBe(true)
  expect(handler).toHaveBeenCalled()
  window.removeEventListener(STORAGE_ERROR_EVENT, handler)
  setItem.mockRestore()
})

test('a product whose name has no slug characters still gets a usable slug', () => {
  const p = useProductsStore.getState().add({ ...base, name: '###' })
  expect(p.slug).toBe('product')
})
