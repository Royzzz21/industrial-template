import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Category } from '@/types'
import { seed } from '@/data/seed'
import { newId } from '@/lib/id'
import { slugify, uniqueSlug } from '@/lib/slugify'
import { jsonStorage, storageKey, STORAGE_VERSION } from './persist'
import { useProductsStore } from './useProductsStore'

export type CategoryInput = Omit<Category, 'id' | 'slug'> & { slug?: string }
export type RemoveResult = { ok: true } | { ok: false; reason: string }

interface CategoriesState {
  categories: Category[]
  add: (input: CategoryInput) => Category
  update: (id: string, patch: Partial<CategoryInput>) => void
  remove: (id: string) => RemoveResult
  replaceAll: (categories: Category[]) => void
  reset: () => void
}

const sorted = (list: Category[]) => [...list].sort((a, b) => a.sortOrder - b.sortOrder)

export const useCategoriesStore = create<CategoriesState>()(
  persist(
    (set, get) => ({
      categories: sorted(seed.categories),
      add: (input) => {
        const taken = get().categories.map((c) => c.slug)
        const category: Category = {
          ...input,
          id: newId('cat'),
          slug: uniqueSlug(slugify(input.slug || input.name), taken),
        }
        set({ categories: sorted([...get().categories, category]) })
        return category
      },
      update: (id, patch) => {
        const taken = get().categories.filter((c) => c.id !== id).map((c) => c.slug)
        set({
          categories: sorted(
            get().categories.map((c) => {
              if (c.id !== id) return c
              const next = { ...c, ...patch }
              const slugBase = slugify(patch.slug || patch.name || c.slug)
              return { ...next, slug: uniqueSlug(slugBase, taken) }
            }),
          ),
        })
      },
      remove: (id) => {
        const inUse = useProductsStore.getState().products.filter((p) => p.categoryId === id).length
        if (inUse > 0) {
          return { ok: false, reason: `${inUse} product${inUse === 1 ? '' : 's'} use this category` }
        }
        set({ categories: get().categories.filter((c) => c.id !== id) })
        return { ok: true }
      },
      replaceAll: (categories) => set({ categories: sorted(categories) }),
      reset: () => set({ categories: sorted(seed.categories) }),
    }),
    { name: storageKey('categories'), version: STORAGE_VERSION, storage: jsonStorage() },
  ),
)
