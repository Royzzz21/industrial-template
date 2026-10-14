import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Category } from '@/types'

export function CategoryGrid({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {categories.map((c) => (
        <li key={c.id}>
          <Link
            to={`/products?category=${c.slug}`}
            className="group relative block aspect-[4/3] overflow-hidden rounded bg-steel"
          >
            <img src={c.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-steel/90 via-steel/30 to-transparent" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
              <div>
                <h3 className="font-display text-2xl font-semibold leading-none text-white">{c.name}</h3>
                <p className="mt-1 text-sm text-steel-200">{counts[c.id] ?? 0} products</p>
              </div>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 transition-colors group-hover:bg-safety">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
