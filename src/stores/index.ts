import { exportSchema, type ExportFile } from './schema'
import { useAuthStore } from './useAuthStore'
import { useCategoriesStore } from './useCategoriesStore'
import { useEnquiriesStore } from './useEnquiriesStore'
import { useProductsStore } from './useProductsStore'
import { useQuoteStore } from './useQuoteStore'
import { useSettingsStore } from './useSettingsStore'
import { useSlidesStore } from './useSlidesStore'

export {
  useAuthStore,
  useCategoriesStore,
  useEnquiriesStore,
  useProductsStore,
  useQuoteStore,
  useSettingsStore,
  useSlidesStore,
}

export type ImportResult = { ok: true } | { ok: false; errors: string[] }

export function exportAll(): string {
  const file: ExportFile = {
    version: 1,
    exportedAt: new Date().toISOString(),
    categories: useCategoriesStore.getState().categories,
    products: useProductsStore.getState().products,
    slides: useSlidesStore.getState().slides,
    settings: useSettingsStore.getState().settings,
    enquiries: useEnquiriesStore.getState().enquiries,
  }
  return JSON.stringify(file, null, 2)
}

export function importAll(json: string): ImportResult {
  let raw: unknown
  try {
    raw = JSON.parse(json)
  } catch {
    return { ok: false, errors: ['The file is not valid JSON.'] }
  }
  const parsed = exportSchema.safeParse(raw)
  if (!parsed.success) {
    const errors = parsed.error.issues
      .slice(0, 20)
      .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
    return { ok: false, errors }
  }
  const data = parsed.data
  useCategoriesStore.getState().replaceAll(data.categories)
  useProductsStore.getState().replaceAll(data.products)
  useSlidesStore.getState().replaceAll(data.slides)
  useSettingsStore.getState().replaceAll(data.settings)
  useEnquiriesStore.getState().replaceAll(data.enquiries)
  return { ok: true }
}

export function resetAll(): void {
  useCategoriesStore.getState().reset()
  useProductsStore.getState().reset()
  useSlidesStore.getState().reset()
  useSettingsStore.getState().reset()
  useEnquiriesStore.getState().reset()
  useQuoteStore.getState().clear()
  useAuthStore.getState().logout()
}
