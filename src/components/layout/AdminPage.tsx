import type { ReactNode } from 'react'

export function AdminPage({ title, lead, action, children }: { title: string; lead?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl">{title}</h1>
          {lead && <p className="mt-1 text-sm text-steel-500">{lead}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}
