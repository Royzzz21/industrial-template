import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { Category } from '@/types'
import { Button } from '@/components/ui/Button'
import { inputClasses } from '@/components/ui/Input'
import { STOCK_OPTIONS } from '@/lib/format'
import { cn } from '@/lib/cn'
import type { ProductFilters as Filters } from './useProductFilters'

interface Props {
  filters: Filters
  categories: Category[]
  counts: Record<string, number>
  total: number
  activeCount: number
  onChange: (key: keyof Filters, value: string) => void
  onClear: () => void
}

export function ProductFilters({ filters, categories, counts, total, activeCount, onChange, onClear }: Props) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState(filters.q)
  useEffect(() => setQ(filters.q), [filters.q])

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onChange('q', q)
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <Button variant="outline" size="sm" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="filter-panel">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters{activeCount > 0 ? ` (${activeCount})` : ''}
        </Button>
        {activeCount > 0 && (
          <button type="button" onClick={onClear} className="text-sm text-steel-500 underline">
            Clear all
          </button>
        )}
      </div>

      <div id="filter-panel" className={cn('space-y-6', open ? 'block' : 'hidden lg:block')}>
        <form role="search" onSubmit={submitSearch} className="relative">
          <label htmlFor="product-search" className="mb-1 block text-sm font-medium text-steel">
            Search
          </label>
          <div className="relative">
            <input
              id="product-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Name, SKU or brand"
              className={cn(inputClasses, 'pr-10')}
            />
            <button type="submit" aria-label="Search" className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1.5 text-steel-400 hover:text-steel">
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </form>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-steel">Category</legend>
          <ul className="space-y-1 text-sm">
            <li>
              <button
                type="button"
                onClick={() => onChange('category', '')}
                className={cn('flex w-full justify-between rounded px-2 py-1.5 text-left hover:bg-steel-50', !filters.category && 'bg-steel-100 font-medium text-steel')}
                aria-pressed={!filters.category}
              >
                <span>All products</span>
                <span className="text-steel-400">{total}</span>
              </button>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onChange('category', c.slug)}
                  className={cn('flex w-full justify-between rounded px-2 py-1.5 text-left hover:bg-steel-50', filters.category === c.slug && 'bg-steel-100 font-medium text-steel')}
                  aria-pressed={filters.category === c.slug}
                >
                  <span>{c.name}</span>
                  <span className="text-steel-400">{counts[c.id] ?? 0}</span>
                </button>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-steel">Availability</legend>
          <ul className="space-y-1.5 text-sm">
            <li>
              <label className="flex items-center gap-2">
                <input type="radio" name="availability" checked={!filters.availability} onChange={() => onChange('availability', '')} className="text-safety focus:ring-safety" />
                Any
              </label>
            </li>
            {STOCK_OPTIONS.map((o) => (
              <li key={o.value}>
                <label className="flex items-center gap-2">
                  <input type="radio" name="availability" checked={filters.availability === o.value} onChange={() => onChange('availability', o.value)} className="text-safety focus:ring-safety" />
                  {o.label}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear} className="hidden lg:inline-flex">
            <X className="h-4 w-4" aria-hidden="true" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  )
}
