import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { inputClasses } from '@/components/ui/Input'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { ProductFilters } from '@/features/products/ProductFilters'
import { ProductGrid } from '@/features/products/ProductGrid'
import { SORT_OPTIONS, useProductFilters } from '@/features/products/useProductFilters'
import { useProductsStore } from '@/stores'

export function ProductsPage() {
  const { filters, setFilter, clear, results, counts, categories, activeCount } = useProductFilters()
  const total = useProductsStore((s) => s.products.length)
  const activeCategory = categories.find((c) => c.slug === filters.category)

  return (
    <>
      <PageHeader
        title={activeCategory ? activeCategory.name : 'All products'}
        lead={activeCategory ? activeCategory.description : 'Browse the range, filter by category or availability, and add items to a quote request.'}
      />
      <Container className="grid gap-8 py-8 lg:grid-cols-[260px,1fr] lg:py-12">
        <aside aria-label="Product filters">
          <ProductFilters
            filters={filters}
            categories={categories}
            counts={counts}
            total={total}
            activeCount={activeCount}
            onChange={setFilter}
            onClear={clear}
          />
        </aside>
        <div>
          <h2 className="sr-only">Results</h2>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-steel-500" role="status">
              {results.length} of {total} products
            </p>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-steel-500">Sort</span>
              <select value={filters.sort} onChange={(e) => setFilter('sort', e.target.value)} className={`${inputClasses} w-auto py-1.5`} aria-label="Sort products">
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {results.length === 0 ? (
            <EmptyState
              title="No products match these filters"
              description="Try a different category or search term, or clear the filters to see the full range."
              action={
                <Button variant="outline" onClick={clear}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <ProductGrid products={results} categories={categories} />
          )}
        </div>
      </Container>
    </>
  )
}
