import { createJSONStorage, type StateStorage } from 'zustand/middleware'

export const STORAGE_PREFIX = 'northline:'
export const STORAGE_VERSION = 1
/** Dispatched on `window` when a write to localStorage fails (usually quota). */
export const STORAGE_ERROR_EVENT = 'northline:storage-error'

export const storageKey = (domain: string) => `${STORAGE_PREFIX}${domain}`

/**
 * localStorage wrapper that never throws. A failed write keeps the in-memory
 * state intact and raises STORAGE_ERROR_EVENT so the UI can tell the user.
 */
const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name)
    } catch {
      return null
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value)
    } catch (error) {
      window.dispatchEvent(new CustomEvent(STORAGE_ERROR_EVENT, { detail: { name, error } }))
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name)
    } catch {
      /* ignore */
    }
  },
}

export const jsonStorage = () => createJSONStorage(() => safeStorage)
