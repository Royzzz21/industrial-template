import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types'
import { seed } from '@/data/seed'
import { newId } from '@/lib/id'
import { slugify, uniqueSlug } from '@/lib/slugify'
import { jsonStorage, storageKey, STORAGE_VERSION } from './persist'

export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'slug'> & { slug?: string }

interface ProductsState {
  products: Product[]
  add: (input: ProductInput) => Product
  update: (id: string, patch: ProductInput) => Product
  remove: (id: string) => void
  replaceAll: (products: Product[]) => void
  reset: () => void
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: seed.products,
      add: (input) => {
        const now = new Date().toISOString()
        const taken = get().products.map((p) => p.slug)
        const product: Product = {
          ...input,
          id: newId('prod'),
          slug: uniqueSlug(slugify(input.slug || input.name) || 'product', taken),
          createdAt: now,
          updatedAt: now,
        }
        set({ products: [product, ...get().products] })
        return product
      },
      update: (id, patch) => {
        const existing = get().products.find((p) => p.id === id)
        if (!existing) throw new Error(`Product ${id} not found`)
        const taken = get().products.filter((p) => p.id !== id).map((p) => p.slug)
        const updated: Product = {
          ...existing,
          ...patch,
          slug: uniqueSlug(slugify(patch.slug || patch.name) || 'product', taken),
          updatedAt: new Date().toISOString(),
        }
        set({ products: get().products.map((p) => (p.id === id ? updated : p)) })
        return updated
      },
      remove: (id) => set({ products: get().products.filter((p) => p.id !== id) }),
      replaceAll: (products) => set({ products }),
      reset: () => set({ products: seed.products }),
    }),
    { name: storageKey('products'), version: STORAGE_VERSION, storage: jsonStorage() },
  ),
)
