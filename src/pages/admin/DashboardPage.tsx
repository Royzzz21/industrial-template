import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { AdminPage } from '@/components/layout/AdminPage'
import { formatDateTime } from '@/lib/format'
import { useCategoriesStore, useEnquiriesStore, useProductsStore, useSlidesStore } from '@/stores'

export function DashboardPage() {
  const products = useProductsStore((s) => s.products)
  const categories = useCategoriesStore((s) => s.categories)
  const slides = useSlidesStore((s) => s.slides)
  const enquiries = useEnquiriesStore((s) => s.enquiries)
  const unread = enquiries.filter((e) => e.status === 'new').length

  const cards = [
    { label: 'Products', value: products.length, to: '/admin/products' },
    { label: 'Categories', value: categories.length, to: '/admin/categories' },
    { label: 'Carousel slides', value: slides.filter((s) => s.enabled).length, to: '/admin/slides' },
    { label: 'New enquiries', value: unread, to: '/admin/enquiries' },
  ]

  return (
    <AdminPage title="Dashboard" lead="A quick view of the catalogue and recent quote requests.">
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <li key={c.label}>
            <Link to={c.to} className="block rounded border border-steel-200 bg-white p-4 hover:border-steel-400">
              <p className="font-display text-4xl font-bold leading-none text-steel">{c.value}</p>
              <p className="mt-2 text-sm text-steel-500">{c.label}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 rounded border border-steel-200 bg-white">
        <div className="flex items-center justify-between border-b border-steel-100 px-4 py-3">
          <h2 className="text-2xl">Recent enquiries</h2>
          <Button to="/admin/enquiries" variant="outline" size="sm">
            View all
          </Button>
        </div>
        {enquiries.length === 0 ? (
          <p className="px-4 py-8 text-sm text-steel-500">No enquiries yet. Submit the quote form on the public site to see one here.</p>
        ) : (
          <ul className="divide-y divide-steel-100">
            {enquiries.slice(0, 5).map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm">
                <span className="font-mono text-xs text-steel-500">{e.reference}</span>
                <span className="font-medium text-steel">{e.name}</span>
                <span className="text-steel-500">{e.company}</span>
                <span className="text-steel-400">{e.items.length} line{e.items.length === 1 ? '' : 's'}</span>
                <span className="ml-auto text-xs text-steel-400">{formatDateTime(e.createdAt)}</span>
                <Badge tone={e.status === 'new' ? 'accent' : 'neutral'}>{e.status === 'new' ? 'New' : 'Handled'}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminPage>
  )
}
