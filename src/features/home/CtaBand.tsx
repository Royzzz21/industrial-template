import { Button } from '@/components/ui/Button'
import { Container } from '@/components/layout/Container'
import { useSettingsStore } from '@/stores'

export function CtaBand() {
  const phone = useSettingsStore((s) => s.settings.company.phone)
  return (
    <div className="bg-safety text-white">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:py-12">
        <div>
          <h2 className="font-display text-3xl font-bold leading-none text-white sm:text-4xl">Tell us what your site needs</h2>
          <p className="mt-2 max-w-xl text-white/90">Send a quote request with the products and quantities, or call {phone} to talk to an engineer.</p>
        </div>
        <Button to="/contact" variant="secondary" size="lg" className="shrink-0">
          Request a quote
        </Button>
      </Container>
    </div>
  )
}
