import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { QuoteItem } from '@/types'
import { jsonStorage, storageKey, STORAGE_VERSION } from './persist'

export const MAX_QUANTITY = 999

interface QuoteState {
  items: QuoteItem[]
  add: (productId: string, quantity?: number) => void
  setQuantity: (productId: string, quantity: number) => void
  remove: (productId: string) => void
  clear: () => void
}

const clamp = (q: number) => (Number.isFinite(q) ? Math.min(MAX_QUANTITY, Math.floor(q)) : 0)

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (productId, quantity = 1) => {
        const qty = Math.max(1, clamp(quantity))
        const existing = get().items.find((i) => i.productId === productId)
        if (existing) {
          get().setQuantity(productId, existing.quantity + qty)
        } else {
          set({ items: [...get().items, { productId, quantity: qty }] })
        }
      },
      setQuantity: (productId, quantity) => {
        const qty = clamp(quantity)
        if (qty <= 0) {
          get().remove(productId)
          return
        }
        set({ items: get().items.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i)) })
      },
      remove: (productId) => set({ items: get().items.filter((i) => i.productId !== productId) }),
      clear: () => set({ items: [] }),
    }),
    { name: storageKey('quote'), version: STORAGE_VERSION, storage: jsonStorage() },
  ),
)

export const selectQuoteCount = (s: QuoteState) => s.items.reduce((n, i) => n + i.quantity, 0)
