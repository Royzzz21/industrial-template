import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'success' | 'warning' | 'neutral' | 'info' | 'accent'

const tones: Record<Tone, string> = {
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  neutral: 'bg-steel-50 text-steel-600 border-steel-200',
  info: 'bg-sky-50 text-sky-800 border-sky-200',
  accent: 'bg-safety-100 text-safety-700 border-safety/30',
}

export function Badge({ tone = 'neutral', className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span className={cn('inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium leading-5', tones[tone], className)}>
      {children}
    </span>
  )
}
