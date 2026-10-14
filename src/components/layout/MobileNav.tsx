import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { NAV_LINKS } from './navLinks'

export function MobileNav({ id, onNavigate }: { id: string; onNavigate: () => void }) {
  return (
    <nav id={id} aria-label="Mobile navigation" className="border-t border-steel-100 bg-white md:hidden">
      <ul className="flex flex-col px-4 py-2">
        {NAV_LINKS.map((l) => (
          <li key={l.to}>
            <NavLink
              to={l.to}
              end={l.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn('block border-l-4 py-3 pl-3 text-base font-medium', isActive ? 'border-safety text-steel' : 'border-transparent text-steel-600')
              }
            >
              {l.label}
            </NavLink>
          </li>
        ))}
        <li className="py-3">
          <Button to="/contact" onClick={onNavigate} className="w-full">
            Request a quote
          </Button>
        </li>
      </ul>
    </nav>
  )
}
