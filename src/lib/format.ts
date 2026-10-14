import type { StockStatus } from '@/types'

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const STOCK_LABELS: Record<StockStatus, string> = {
  in_stock: 'In stock',
  on_order: 'On order',
  enquire: 'Enquire for availability',
}

export function stockLabel(status: StockStatus): string {
  return STOCK_LABELS[status]
}

export const STOCK_OPTIONS: { value: StockStatus; label: string }[] = (
  Object.keys(STOCK_LABELS) as StockStatus[]
).map((value) => ({ value, label: STOCK_LABELS[value] }))
