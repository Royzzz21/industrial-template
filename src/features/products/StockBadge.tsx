import type { StockStatus } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { stockLabel } from '@/lib/format'

const tone: Record<StockStatus, 'success' | 'warning' | 'neutral'> = {
  in_stock: 'success',
  on_order: 'warning',
  enquire: 'neutral',
}

export function StockBadge({ status }: { status: StockStatus }) {
  return <Badge tone={tone[status]}>{stockLabel(status)}</Badge>
}
