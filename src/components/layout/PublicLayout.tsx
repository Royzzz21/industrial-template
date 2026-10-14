import { useEffect } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { useSettingsStore } from '@/stores'
import { Footer } from './Footer'
import { Header } from './Header'

export function PublicLayout() {
  const name = useSettingsStore((s) => s.settings.company.name)
  useEffect(() => {
    document.title = name
  }, [name])
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-steel">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration getKey={(location) => location.pathname + location.search} />
    </div>
  )
}
