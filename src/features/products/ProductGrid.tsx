import type { Category, Product } from '@/types'
import { ProductCard } from './ProductCard'

export function ProductGrid({ products, categories }: { products: Product[]; categories: Category[] }) {
  const byId = new Map(categories.map((c) => [c.id, c]))
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} category={byId.get(p.categoryId)} />
        </li>
      ))}
    </ul>
  )
}
