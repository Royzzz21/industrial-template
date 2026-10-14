import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Slide } from '@/types'
import { seed } from '@/data/seed'
import { newId } from '@/lib/id'
import { jsonStorage, storageKey, STORAGE_VERSION } from './persist'

export type SlideInput = Omit<Slide, 'id' | 'sortOrder'>

interface SlidesState {
  slides: Slide[]
  add: (input: SlideInput) => Slide
  update: (id: string, patch: Partial<SlideInput>) => void
  remove: (id: string) => void
  move: (id: string, direction: -1 | 1) => void
  replaceAll: (slides: Slide[]) => void
  reset: () => void
}

const normalise = (list: Slide[]) =>
  [...list].sort((a, b) => a.sortOrder - b.sortOrder).map((s, i) => ({ ...s, sortOrder: i + 1 }))

export const useSlidesStore = create<SlidesState>()(
  persist(
    (set, get) => ({
      slides: normalise(seed.slides),
      add: (input) => {
        const slide: Slide = { ...input, id: newId('slide'), sortOrder: get().slides.length + 1 }
        set({ slides: normalise([...get().slides, slide]) })
        return slide
      },
      update: (id, patch) =>
        set({ slides: get().slides.map((s) => (s.id === id ? { ...s, ...patch } : s)) }),
      remove: (id) => set({ slides: normalise(get().slides.filter((s) => s.id !== id)) }),
      move: (id, direction) => {
        const list = normalise(get().slides)
        const index = list.findIndex((s) => s.id === id)
        const target = index + direction
        if (index < 0 || target < 0 || target >= list.length) return
        const a = list[index]
        const b = list[target]
        list[index] = { ...b, sortOrder: a.sortOrder }
        list[target] = { ...a, sortOrder: b.sortOrder }
        set({ slides: normalise(list) })
      },
      replaceAll: (slides) => set({ slides: normalise(slides) }),
      reset: () => set({ slides: normalise(seed.slides) }),
    }),
    { name: storageKey('slides'), version: STORAGE_VERSION, storage: jsonStorage() },
  ),
)
