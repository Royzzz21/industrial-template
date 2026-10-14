import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { useCategoriesStore, useSettingsStore } from '@/stores'
import { Container } from './Container'
import { Logo } from './Logo'
import { NAV_LINKS } from './navLinks'

export function Footer() {
  const company = useSettingsStore((s) => s.settings.company)
  const categories = useCategoriesStore((s) => s.categories)
  const year = new Date().getFullYear()
  return (
    <footer className="bg-steel text-steel-200">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-6">{company.tagline}. Equipment sized for the job, delivered and supported.</p>
          <ul className="mt-4 flex gap-4 text-sm">
            {company.social.map((s) => (
              <li key={s.label}>
                <a href={s.url} className="hover:text-white" target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg text-white">Company</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/admin" className="hover:text-white">
                Admin
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg text-white">Products</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`/products?category=${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg text-white">Contact</h3>
          <ul className="mt-3 space-y-3 text-sm">
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <a href={`tel:${company.phone.replace(/\s+/g, '')}`} className="hover:text-white">
                {company.phone}
              </a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <a href={`mailto:${company.email}`} className="hover:text-white">
                {company.email}
              </a>
            </li>
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{company.address}</span>
            </li>
            <li className="pl-6 text-steel-300">{company.hours}</li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-steel-700">
        <Container className="flex flex-col gap-2 py-4 text-xs text-steel-300 sm:flex-row sm:justify-between">
          <p>
            © {year} {company.name}. All rights reserved.
          </p>
          <p>Prices and availability confirmed on quotation.</p>
        </Container>
      </div>
    </footer>
  )
}
