import type { ReactNode } from 'react'
import { Container } from './Container'

export function PageHeader({ title, lead, children }: { title: string; lead?: string; children?: ReactNode }) {
  return (
    <div className="border-b border-steel-100 bg-concrete">
      <Container className="py-8 sm:py-12">
        {children}
        <h1 className="text-4xl leading-none sm:text-5xl">{title}</h1>
        {lead && <p className="mt-3 max-w-2xl text-base text-steel-500 sm:text-lg">{lead}</p>}
      </Container>
    </div>
  )
}
