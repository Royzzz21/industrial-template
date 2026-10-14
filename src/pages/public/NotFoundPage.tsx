import { Button } from '@/components/ui/Button'
import { Section } from '@/components/layout/Section'

export function NotFoundPage() {
  return (
    <Section>
      <div className="mx-auto max-w-lg py-10 text-center">
        <h1 className="text-5xl">Page not found</h1>
        <p className="mt-4 text-steel-500">The link may be out of date, or the page has moved.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button to="/">Go to the home page</Button>
          <Button to="/products" variant="outline">
            Browse products
          </Button>
        </div>
      </div>
    </Section>
  )
}
