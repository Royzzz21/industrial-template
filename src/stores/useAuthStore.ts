import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { jsonStorage, storageKey, STORAGE_VERSION } from './persist'
import { useSettingsStore } from './useSettingsStore'

interface AuthState {
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (email, password) => {
        const admin = useSettingsStore.getState().settings.admin
        const ok = email.trim().toLowerCase() === admin.email.toLowerCase() && password === admin.password
        set({ isAuthenticated: ok })
        return ok
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    { name: storageKey('auth'), version: STORAGE_VERSION, storage: jsonStorage() },
  ),
)
