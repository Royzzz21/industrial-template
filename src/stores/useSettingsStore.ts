import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Settings } from '@/types'
import { seed } from '@/data/seed'
import { jsonStorage, storageKey, STORAGE_VERSION } from './persist'

interface SettingsState {
  settings: Settings
  update: (patch: Partial<Settings>) => void
  replaceAll: (settings: Settings) => void
  reset: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: seed.settings,
      update: (patch) => set({ settings: { ...get().settings, ...patch } }),
      replaceAll: (settings) => set({ settings }),
      reset: () => set({ settings: seed.settings }),
    }),
    { name: storageKey('settings'), version: STORAGE_VERSION, storage: jsonStorage() },
  ),
)
