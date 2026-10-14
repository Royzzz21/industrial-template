import { createJSONStorage } from 'zustand/middleware'

export const STORAGE_PREFIX = 'northline:'
export const STORAGE_VERSION = 1

export const storageKey = (domain: string) => `${STORAGE_PREFIX}${domain}`

export const jsonStorage = () => createJSONStorage(() => localStorage)
