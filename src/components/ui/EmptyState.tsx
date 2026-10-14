import type { ReactNode } from 'react'

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="rounded border border-dashed border-steel-300 bg-steel-50 px-6 py-12 text-center">
      <h3 className="text-2xl">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-md text-sm text-steel-500">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}
