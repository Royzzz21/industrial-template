import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { QuoteBasketList } from '@/features/quote/QuoteBasketList'
import { QuoteForm } from '@/features/quote/QuoteForm'
import { useSettingsStore } from '@/stores'

export function ContactPage() {
  const company = useSettingsStore((s) => s.settings.company)
  return (
    <>
      <PageHeader title="Request a quote" lead="Review the products on your list, tell us about the job and we will reply with pricing and lead times." />
      <Container className="grid gap-10 py-8 lg:grid-cols-[minmax(0,5fr),minmax(0,7fr)] lg:py-12">
        <section aria-labelledby="basket-title">
          <h2 id="basket-title" className="text-2xl">
            Your quote list
          </h2>
          <div className="mt-4">
            <QuoteBasketList />
          </div>
          <div className="mt-8 rounded border border-steel-200 bg-concrete p-5">
            <h3 className="text-xl">Talk to us directly</h3>
            <ul className="mt-3 space-y-3 text-sm text-graphite">
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-steel-500" aria-hidden="true" />
                <a href={`tel:${company.phone.replace(/\s+/g, '')}`} className="hover:underline">
                  {company.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-steel-500" aria-hidden="true" />
                <a href={`mailto:${company.email}`} className="hover:underline">
                  {company.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-steel-500" aria-hidden="true" />
                <span>{company.address}</span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-steel-500" aria-hidden="true" />
                <span>{company.hours}</span>
              </li>
            </ul>
            <div className="mt-4 grid aspect-[16/9] place-items-center rounded border border-dashed border-steel-300 bg-white text-xs text-steel-400">
              Map embed placeholder. Paste a Google Maps iframe here.
            </div>
          </div>
        </section>
        <section aria-labelledby="form-title">
          <h2 id="form-title" className="text-2xl">
            Your details
          </h2>
          <div className="mt-4 rounded border border-steel-200 bg-white p-5 sm:p-6">
            <QuoteForm />
          </div>
        </section>
      </Container>
    </>
  )
}
