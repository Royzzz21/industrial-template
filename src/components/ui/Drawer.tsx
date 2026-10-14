import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  side?: 'left' | 'right'
}

export function Drawer({ open, onClose, title, children, side = 'right' }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-steel/60" />
      <div
        className={cn(
          'absolute top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl',
          side === 'right' ? 'right-0' : 'left-0',
        )}
      >
        <div className="flex items-center justify-between border-b border-steel-100 px-5 py-4">
          <h2 className="text-2xl">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close panel" className="rounded p-1 text-steel-400 hover:bg-steel-50 hover:text-steel">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  )
}
