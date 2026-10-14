import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { Product, QuoteItem } from '@/types'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useProductsStore, useQuoteStore } from '@/stores'

function QuantityField({ item, product }: { item: QuoteItem; product: Product }) {
  const setQuantity = useQuoteStore((s) => s.setQuantity)
  const [draft, setDraft] = useState(String(item.quantity))
  useEffect(() => setDraft(String(item.quantity)), [item.quantity])

  const commit = () => {
    const n = Number(draft)
    if (draft.trim() === '' || !Number.isFinite(n) || n < 1) {
      setDraft(String(item.quantity))
      return
    }
    setQuantity(item.productId, n)
  }

  return (
    <div className="inline-flex items-center rounded border border-steel-300">
      <button type="button" aria-label={`Decrease quantity of ${product.name}`} onClick={() => setQuantity(item.productId, item.quantity - 1)} className="grid h-8 w-8 place-items-center hover:bg-steel-50">
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={999}
        value={draft}
        aria-label={`Quantity of ${product.name}`}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            commit()
          }
        }}
        className="h-8 w-14 border-0 border-x border-steel-300 p-0 text-center text-sm focus:ring-0"
      />
      <button type="button" aria-label={`Increase quantity of ${product.name}`} onClick={() => setQuantity(item.productId, item.quantity + 1)} className="grid h-8 w-8 place-items-center hover:bg-steel-50">
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}

export function QuoteBasketList() {
  const items = useQuoteStore((s) => s.items)
  const remove = useQuoteStore((s) => s.remove)
  const products = useProductsStore((s) => s.products)

  // Lines whose product was deleted or replaced by an import are dropped so
  // they cannot be stuck in the basket with no way to remove them.
  const orphans = items.filter((i) => !products.some((p) => p.id === i.productId))
  useEffect(() => {
    for (const o of orphans) remove(o.productId)
  }, [orphans, remove])

  const lines = items
    .map((i) => ({ item: i, product: products.find((p) => p.id === i.productId) }))
    .filter((l): l is { item: QuoteItem; product: Product } => Boolean(l.product))

  if (lines.length === 0) {
    return (
      <EmptyState
        title="Your quote list is empty"
        description="Add products from the catalogue and they will appear here with quantities you can adjust."
        action={<Button to="/products">Browse products</Button>}
      />
    )
  }

  return (
    <ul className="divide-y divide-steel-100 rounded border border-steel-200 bg-white">
      {lines.map(({ item, product }) => (
        <li key={item.productId} className="flex gap-3 p-3 sm:p-4">
          <Link to={`/products/${product.slug}`} className="block h-16 w-20 shrink-0 overflow-hidden rounded bg-steel-100" tabIndex={-1} aria-hidden="true">
            <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
          </Link>
          <div className="min-w-0 flex-1">
            <Link to={`/products/${product.slug}`} className="block font-medium leading-snug text-steel hover:text-safety-600">
              {product.name}
            </Link>
            <p className="text-xs text-steel-400">{product.sku}</p>
            <div className="mt-2 flex items-center gap-2">
              <QuantityField item={item} product={product} />
              <button type="button" onClick={() => remove(item.productId)} className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-steel-500 hover:bg-steel-50 hover:text-red-700">
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Remove
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
