import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { ExternalLink, LogOut, Menu } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { useAuthStore, useSettingsStore } from '@/stores'
import { AdminSidebar } from './AdminSidebar'
import { Logo } from './Logo'

export function AdminShell() {
  const [open, setOpen] = useState(false)
  const logout = useAuthStore((s) => s.logout)
  const name = useSettingsStore((s) => s.settings.company.logoText)
  const navigate = useNavigate()
  useEffect(() => {
    document.title = `Admin · ${name}`
  }, [name])

  const onLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-concrete">
      <aside className="hidden w-64 shrink-0 flex-col bg-steel p-4 lg:flex">
        <Logo light className="mb-6" />
        <AdminSidebar />
        <p className="mt-auto pt-6 text-xs text-steel-300">Demo CMS. Data is stored in this browser only.</p>
      </aside>
      <Drawer open={open} onClose={() => setOpen(false)} title={`${name} admin`} side="left">
        <div className="rounded bg-steel p-3">
          <AdminSidebar onNavigate={() => setOpen(false)} />
        </div>
      </Drawer>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-3 border-b border-steel-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Open admin menu" onClick={() => setOpen(true)} className="grid h-9 w-9 place-items-center rounded hover:bg-steel-50 lg:hidden">
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="font-display text-xl font-semibold text-steel">Admin</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link to="/" className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-steel hover:bg-steel-50">
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">View site</span>
            </Link>
            <button type="button" onClick={onLogout} className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-steel hover:bg-steel-50">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </header>
        <main id="main" className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
