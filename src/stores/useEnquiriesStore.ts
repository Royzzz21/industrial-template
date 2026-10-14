import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Enquiry, EnquiryStatus } from '@/types'
import { newId, newReference } from '@/lib/id'
import { jsonStorage, storageKey, STORAGE_VERSION } from './persist'

export type EnquiryInput = Omit<Enquiry, 'id' | 'reference' | 'createdAt' | 'status'>

interface EnquiriesState {
  enquiries: Enquiry[]
  add: (input: EnquiryInput) => Enquiry
  setStatus: (id: string, status: EnquiryStatus) => void
  remove: (id: string) => void
  replaceAll: (enquiries: Enquiry[]) => void
  reset: () => void
}

export const useEnquiriesStore = create<EnquiriesState>()(
  persist(
    (set, get) => ({
      enquiries: [],
      add: (input) => {
        const enquiry: Enquiry = {
          ...input,
          id: newId('enq'),
          reference: newReference(),
          createdAt: new Date().toISOString(),
          status: 'new',
        }
        set({ enquiries: [enquiry, ...get().enquiries] })
        return enquiry
      },
      setStatus: (id, status) =>
        set({ enquiries: get().enquiries.map((e) => (e.id === id ? { ...e, status } : e)) }),
      remove: (id) => set({ enquiries: get().enquiries.filter((e) => e.id !== id) }),
      replaceAll: (enquiries) => set({ enquiries }),
      reset: () => set({ enquiries: [] }),
    }),
    { name: storageKey('enquiries'), version: STORAGE_VERSION, storage: jsonStorage() },
  ),
)
