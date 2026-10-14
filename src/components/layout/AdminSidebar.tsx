import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { useEnquiriesStore } from '@/stores'
import { ADMIN_NAV } from './adminNav'

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const unread = useEnquiriesStore((s) => s.enquiries.filter((e) => e.status === 'new').length)
  return (
    <nav aria-label="Admin navigation">
      <ul className="space-y-1">
        {ADMIN_NAV.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded px-3 py-2 text-sm font-medium',
                  isActive ? 'bg-steel-700 text-white' : 'text-steel-200 hover:bg-steel-700/60 hover:text-white',
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="flex-1">{label}</span>
              {label === 'Enquiries' && unread > 0 && (
                <span className="rounded-full bg-safety px-2 text-xs font-semibold leading-5 text-white">{unread}</span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
