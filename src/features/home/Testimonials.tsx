import { Quote } from 'lucide-react'
import type { Testimonial } from '@/types'

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <ul className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {items.map((t) => (
        <li key={t.id} className="flex flex-col rounded border border-steel-200 bg-white p-6">
          <Quote className="h-6 w-6 text-safety" aria-hidden="true" />
          <blockquote className="mt-3 flex-1 text-base leading-7 text-graphite">“{t.quote}”</blockquote>
          <footer className="mt-4 text-sm">
            <p className="font-semibold text-steel">{t.name}</p>
            <p className="text-steel-500">
              {t.role}, {t.company}
            </p>
          </footer>
        </li>
      ))}
    </ul>
  )
}
