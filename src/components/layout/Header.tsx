import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ClipboardList, Menu, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { useProductsStore, useQuoteStore } from '@/stores'
import { Container } from './Container'
import { Logo } from './Logo'
import { MobileNav } from './MobileNav'
import { NAV_LINKS } from './navLinks'

export function Header() {
  const [open, setOpen] = useState(false)
  const items = useQuoteStore((s) => s.items)
  const products = useProductsStore((s) => s.products)
  const count = items.reduce((n, i) => (products.some((p) => p.id === i.productId) ? n + i.quantity : n), 0)
  const location = useLocation()
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open])

  return (
    <header ref={rootRef} className="sticky top-0 z-40 border-b border-steel-100 bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <Logo />
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-6 lg:gap-8">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    cn(
                      'inline-block border-b-2 py-1 text-sm font-medium transition-colors',
                      isActive ? 'border-safety text-steel' : 'border-transparent text-steel-500 hover:text-steel',
                    )
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/contact"
            aria-label={`Quote basket, ${count} item${count === 1 ? '' : 's'}`}
            className="relative grid h-10 w-10 place-items-center rounded text-steel hover:bg-steel-50"
          >
            <ClipboardList className="h-5 w-5" aria-hidden="true" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 min-w-[1.25rem] rounded-full bg-safety px-1 text-center text-[11px] font-semibold leading-5 text-white">
                {count}
              </span>
            )}
          </Link>
          <Button to="/contact" className="hidden sm:inline-flex">
            Request a quote
          </Button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded text-steel hover:bg-steel-50 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </Container>
      {open && <MobileNav id="mobile-nav" onNavigate={() => setOpen(false)} />}
    </header>
  )
}
