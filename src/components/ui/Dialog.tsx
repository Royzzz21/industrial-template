import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' }

export function Dialog({ open, onClose, title, children, footer, size = 'md' }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) {
      if (typeof el.showModal === 'function') el.showModal()
      else el.setAttribute('open', '')
    } else if (!open && el.open) {
      if (typeof el.close === 'function') el.close()
      else el.removeAttribute('open')
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      className={cn(
        'w-[calc(100%-2rem)] rounded-md bg-white p-0 text-graphite shadow-xl backdrop:bg-steel/60',
        sizes[size],
      )}
      aria-labelledby="dialog-title"
    >
      <div className="flex items-start justify-between gap-4 border-b border-steel-100 px-5 py-4">
        <h2 id="dialog-title" className="text-2xl">
          {title}
        </h2>
        <button type="button" onClick={onClose} aria-label="Close" className="rounded p-1 text-steel-400 hover:bg-steel-50 hover:text-steel">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="px-5 py-4">{children}</div>
      {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-steel-100 px-5 py-3">{footer}</div>}
    </dialog>
  )
}
