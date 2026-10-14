import { Container } from '@/components/layout/Container'
import { INDUSTRIES } from './content'

export function IndustriesStrip() {
  return (
    <div className="border-b border-steel-100 bg-white">
      <Container className="flex flex-wrap items-center gap-x-8 gap-y-2 py-4 text-sm">
        <span className="font-medium text-steel">Serving</span>
        <ul className="flex flex-wrap gap-x-6 gap-y-1 text-steel-500">
          {INDUSTRIES.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </Container>
    </div>
  )
}
