import { Link } from 'react-router-dom'
import { useSettingsStore } from '@/stores'
import { cn } from '@/lib/cn'

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  const { logoText, tagline } = useSettingsStore((s) => s.settings.company)
  return (
    <Link to="/" className={cn('flex items-center gap-3', className)} aria-label={`${logoText} home`}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded bg-safety" aria-hidden="true">
        <svg viewBox="0 0 32 32" className="h-7 w-7">
          <path d="M8 24V8h4l8 11V8h4v16h-4L12 13v11H8z" fill="#14283A" />
        </svg>
      </span>
      <span className="leading-none">
        <span className={cn('block font-display text-2xl font-bold tracking-wide', light ? 'text-white' : 'text-steel')}>{logoText}</span>
        <span className={cn('mt-0.5 block text-[11px]', light ? 'text-steel-200' : 'text-steel-400')}>{tagline}</span>
      </span>
    </Link>
  )
}
