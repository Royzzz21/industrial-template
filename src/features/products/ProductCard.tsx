import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import type { Category, Product } from '@/types'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useQuoteStore } from '@/stores'
import { StockBadge } from './StockBadge'

export function ProductCard({ product, category }: { product: Product; category?: Category }) {
  const add = useQuoteStore((s) => s.add)
  const toast = useToast()
  const href = `/products/${product.slug}`
  const specs = product.specs.slice(0, 2)

  const onAdd = () => {
    add(product.id, 1)
    toast.show({ title: 'Added to your quote', description: product.name, tone: 'success' })
  }

  return (
    <article className="flex h-full flex-col rounded border border-steel-200 bg-white transition-colors hover:border-steel-400">
      <Link to={href} className="block aspect-[4/3] overflow-hidden rounded-t bg-steel-100" tabIndex={-1} aria-hidden="true">
        <img src={product.images[0]} alt="" loading="lazy" className="h-full w-full object-cover" />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-medium text-steel-400">{category?.name ?? ''}</p>
          <StockBadge status={product.stock} />
        </div>
        <h3 className="mt-1 font-display text-xl font-semibold leading-tight">
          <Link to={href} className="hover:text-safety-600">
            {product.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-xs text-steel-400">{product.sku}</p>
        <dl className="mt-3 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-sm">
          {specs.map((s) => (
            <div key={s.label} className="contents">
              <dt className="text-steel-500">{s.label}</dt>
              <dd className="text-graphite">{s.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="text-sm font-semibold text-steel">{product.priceLabel || 'Price on request'}</span>
          <Button size="sm" variant="outline" onClick={onAdd} aria-label={`Add to quote: ${product.name}`}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add to quote
          </Button>
        </div>
      </div>
    </article>
  )
}
