import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useEnquiriesStore, useProductsStore, useQuoteStore } from '@/stores'
import { quoteSchema, type QuoteFormValues } from './quoteSchema'

export function QuoteForm() {
  const items = useQuoteStore((s) => s.items)
  const clear = useQuoteStore((s) => s.clear)
  const products = useProductsStore((s) => s.products)
  const addEnquiry = useEnquiriesStore((s) => s.add)
  const [reference, setReference] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({ resolver: zodResolver(quoteSchema), defaultValues: { consent: undefined as unknown as true } })

  const onSubmit = (values: QuoteFormValues) => {
    const snapshot = items
      .map((i) => {
        const p = products.find((x) => x.id === i.productId)
        return p ? { productId: p.id, name: p.name, sku: p.sku, quantity: i.quantity } : null
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
    const enquiry = addEnquiry({ ...values, items: snapshot })
    clear()
    reset()
    setReference(enquiry.reference)
  }

  if (reference) {
    return (
      <div className="rounded border border-emerald-200 bg-emerald-50 p-6" role="status">
        <CheckCircle2 className="h-8 w-8 text-emerald-700" aria-hidden="true" />
        <h3 className="mt-3 text-2xl">Quote request received</h3>
        <p className="mt-2 text-sm text-graphite">
          Your reference is <strong className="font-semibold">{reference}</strong>. An engineer will reply with a written quotation, usually within one working day.
        </p>
        <p className="mt-2 text-xs text-steel-500">This demo stores the enquiry in the admin inbox only. No email is sent.</p>
        <Button variant="outline" className="mt-4" onClick={() => setReference(null)}>
          Send another request
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Full name" autoComplete="name" error={errors.name?.message} {...register('name')} />
        <Input label="Company" autoComplete="organization" error={errors.company?.message} {...register('company')} />
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Input label="Phone" type="tel" autoComplete="tel" error={errors.phone?.message} {...register('phone')} />
      </div>
      <Textarea
        label="Message"
        placeholder="Application, site conditions, quantities and when you need it"
        error={errors.message?.message}
        {...register('message')}
      />
      <Checkbox
        label="I agree to be contacted about this request."
        error={errors.consent?.message}
        {...register('consent')}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          Send quote request
        </Button>
        <p className="text-xs text-steel-500">
          {items.length > 0 ? `${items.length} product line${items.length === 1 ? '' : 's'} will be attached.` : 'No products attached. You can still describe what you need.'}
        </p>
      </div>
    </form>
  )
}
