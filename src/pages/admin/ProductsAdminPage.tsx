import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import type { Product } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { inputClasses } from '@/components/ui/Input'
import { Table, Td, Th } from '@/components/ui/Table'
import { useToast } from '@/components/ui/Toast'
import { AdminPage } from '@/components/layout/AdminPage'
import { StockBadge } from '@/features/products/StockBadge'
import { formatDate } from '@/lib/format'
import { useCategoriesStore, useProductsStore } from '@/stores'

export function ProductsAdminPage() {
  const products = useProductsStore((s) => s.products)
  const remove = useProductsStore((s) => s.remove)
  const categories = useCategoriesStore((s) => s.categories)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [pending, setPending] = useState<Product | null>(null)
  const toast = useToast()

  const byId = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories])
  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    return products.filter(
      (p) => (!cat || p.categoryId === cat) && (!term || [p.name, p.sku, p.brand].some((s) => s.toLowerCase().includes(term))),
    )
  }, [products, q, cat])

  const confirmDelete = () => {
    if (!pending) return
    remove(pending.id)
    toast.show({ title: 'Product deleted', description: pending.name, tone: 'success' })
    setPending(null)
  }

  return (
    <AdminPage
      title="Products"
      lead={`${products.length} products in the catalogue.`}
      action={
        <Button to="/admin/products/new">
          <Plus className="h-4 w-4" aria-hidden="true" />
          New product
        </Button>
      }
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, SKU or brand" aria-label="Search products" className={`${inputClasses} sm:max-w-xs`} />
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Filter by category" className={`${inputClasses} sm:max-w-xs`}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {list.length === 0 ? (
        <EmptyState title="No products found" description="Try another search or add a new product." action={<Button to="/admin/products/new">New product</Button>} />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>Category</Th>
              <Th>Stock</Th>
              <Th>Featured</Th>
              <Th>Updated</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="hover:bg-steel-50/60">
                <Td>
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-14 shrink-0 overflow-hidden rounded bg-steel-100">
                      {p.images[0] && <img src={p.images[0]} alt="" loading="lazy" className="h-full w-full object-cover" />}
                    </span>
                    <div className="min-w-0">
                      <Link to={`/admin/products/${p.id}`} className="block truncate font-medium text-steel hover:underline">
                        {p.name}
                      </Link>
                      <p className="text-xs text-steel-400">{p.sku}</p>
                    </div>
                  </div>
                </Td>
                <Td>{byId.get(p.categoryId) ?? <Badge tone="warning">Missing</Badge>}</Td>
                <Td>
                  <StockBadge status={p.stock} />
                </Td>
                <Td>{p.featured ? <Badge tone="accent">Featured</Badge> : <span className="text-steel-400">—</span>}</Td>
                <Td className="whitespace-nowrap text-steel-500">{formatDate(p.updatedAt)}</Td>
                <Td className="text-right">
                  <div className="inline-flex gap-1">
                    <Link to={`/admin/products/${p.id}`} aria-label={`Edit ${p.name}`} className="grid h-8 w-8 place-items-center rounded text-steel-500 hover:bg-steel-100 hover:text-steel">
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <button type="button" aria-label={`Delete ${p.name}`} onClick={() => setPending(p)} className="grid h-8 w-8 place-items-center rounded text-steel-500 hover:bg-red-50 hover:text-red-700">
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Dialog
        open={pending !== null}
        onClose={() => setPending(null)}
        title="Delete product"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPending(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm">
          Delete <strong>{pending?.name}</strong>? This cannot be undone.
        </p>
      </Dialog>
    </AdminPage>
  )
}
