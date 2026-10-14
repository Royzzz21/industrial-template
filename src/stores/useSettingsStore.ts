import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Settings } from '@/types'
import { seed } from '@/data/seed'
import { jsonStorage, storageKey } from './persist'

/** Bumped to 2 on 2026-10-14 when the demo login changed; v1 state keeps everything except the admin block. */
export const SETTINGS_STORAGE_VERSION = 2

export function migrateSettings(persisted: unknown, from: number): { settings: Settings } {
  const state = (persisted ?? {}) as Partial<{ settings: Settings }>
  const settings = state.settings ?? seed.settings
  if (from < 2) return { settings: { ...settings, admin: seed.settings.admin } }
  return { settings }
}

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
    { name: storageKey('settings'), version: SETTINGS_STORAGE_VERSION, storage: jsonStorage(), migrate: migrateSettings },
  ),
)
