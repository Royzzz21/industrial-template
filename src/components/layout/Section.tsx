import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Container } from './Container'

interface Props extends HTMLAttributes<HTMLElement> {
  tone?: 'white' | 'concrete' | 'steel'
  children: ReactNode
  flush?: boolean
}

const tones = { white: 'bg-white', concrete: 'bg-concrete', steel: 'bg-steel text-white' }

export function Section({ tone = 'white', className, children, flush, ...rest }: Props) {
  return (
    <section className={cn(tones[tone], !flush && 'py-10 sm:py-14 lg:py-16', className)} {...rest}>
      <Container>{children}</Container>
    </section>
  )
}

export function SectionHeading({ title, lead, action }: { title: string; lead?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h2 className="text-3xl leading-tight sm:text-4xl">{title}</h2>
        {lead && <p className="mt-2 text-base text-steel-500">{lead}</p>}
      </div>
      {action}
    </div>
  )
}
