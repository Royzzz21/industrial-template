import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { CheckCircle2, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/cn'

type Tone = 'success' | 'error' | 'info'
interface Toast { id: number; title: string; description?: string; tone: Tone }
interface ToastInput { title: string; description?: string; tone?: Tone }

const ToastContext = createContext<{ show: (t: ToastInput) => void } | null>(null)

const icons: Record<Tone, typeof Info> = { success: CheckCircle2, error: XCircle, info: Info }
const toneClasses: Record<Tone, string> = {
  success: 'border-emerald-300 text-emerald-800',
  error: 'border-red-300 text-red-800',
  info: 'border-steel-300 text-steel',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const show = useCallback((t: ToastInput) => {
    const id = Date.now() + Math.random()
    setToasts((list) => [...list, { id, tone: 'info', ...t }])
    window.setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 4000)
  }, [])
  const value = useMemo(() => ({ show }), [show])
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-4" role="status" aria-live="polite">
        {toasts.map((t) => {
          const Icon = icons[t.tone]
          return (
            <div key={t.id} className={cn('pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded border bg-white px-4 py-3 shadow-lg', toneClasses[t.tone])}>
              <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <div className="text-sm">
                <p className="font-semibold">{t.title}</p>
                {t.description && <p className="text-graphite">{t.description}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) return { show: () => undefined }
  return ctx
}
