import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input, inputClasses } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'
import { useSettingsStore } from '@/stores'

const schema = z.object({
  company: z.object({
    name: z.string().trim().min(1, 'Enter the company name'),
    tagline: z.string().trim(),
    logoText: z.string().trim().min(1, 'Enter the logo text'),
    email: z.string().trim().email('Enter a valid email'),
    phone: z.string().trim(),
    address: z.string().trim(),
    hours: z.string().trim(),
    social: z.array(z.object({ label: z.string().trim(), url: z.string().trim() })),
  }),
  about: z.object({
    intro: z.string(),
    stats: z.array(z.object({ label: z.string().trim(), value: z.string().trim() })),
    certifications: z.string(),
    images: z.string(),
  }),
  admin: z.object({
    email: z.string().trim().email('Enter a valid email'),
    password: z.string().min(6, 'Use at least 6 characters'),
  }),
})
type Values = z.infer<typeof schema>

const lines = (s: string) => s.split('\n').map((l) => l.trim()).filter(Boolean)

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded border border-steel-200 bg-white p-5">
      <h2 className="mb-4 text-2xl">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

export function SettingsForm() {
  const settings = useSettingsStore((s) => s.settings)
  const update = useSettingsStore((s) => s.update)
  const toast = useToast()
  const { register, handleSubmit, control, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      company: settings.company,
      about: {
        intro: settings.about.intro.join('\n\n'),
        stats: settings.about.stats,
        certifications: settings.about.certifications.join('\n'),
        images: settings.about.images.join('\n'),
      },
      admin: settings.admin,
    },
  })
  const social = useFieldArray({ control, name: 'company.social' })
  const stats = useFieldArray({ control, name: 'about.stats' })

  const onSubmit = (v: Values) => {
    update({
      company: v.company,
      about: {
        intro: v.about.intro.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
        stats: v.about.stats.filter((s) => s.label || s.value),
        certifications: lines(v.about.certifications),
        images: lines(v.about.images),
      },
      admin: v.admin,
    })
    toast.show({ title: 'Settings saved', tone: 'success' })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <Card title="Company">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Company name" error={errors.company?.name?.message} {...register('company.name')} />
          <Input label="Logo text" error={errors.company?.logoText?.message} {...register('company.logoText')} />
        </div>
        <Input label="Tagline" {...register('company.tagline')} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Email" type="email" error={errors.company?.email?.message} {...register('company.email')} />
          <Input label="Phone" {...register('company.phone')} />
        </div>
        <Input label="Address" {...register('company.address')} />
        <Input label="Business hours" {...register('company.hours')} />
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-steel">Social links</legend>
          <ul className="space-y-2">
            {social.fields.map((f, i) => (
              <li key={f.id} className="grid grid-cols-[1fr,2fr,auto] gap-2">
                <input aria-label={`Social label ${i + 1}`} placeholder="Label" className={inputClasses} {...register(`company.social.${i}.label`)} />
                <input aria-label={`Social URL ${i + 1}`} placeholder="https://…" className={inputClasses} {...register(`company.social.${i}.url`)} />
                <button type="button" aria-label={`Remove social link ${i + 1}`} onClick={() => social.remove(i)} className="grid h-10 w-8 place-items-center rounded text-steel-500 hover:bg-red-50 hover:text-red-700">
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => social.append({ label: '', url: '' })}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add link
          </Button>
        </fieldset>
      </Card>

      <Card title="About page">
        <Textarea label="Introduction" rows={8} {...register('about.intro')} />
        <p className="-mt-2 text-xs text-steel-500">Separate paragraphs with a blank line.</p>
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-steel">Stats</legend>
          <ul className="space-y-2">
            {stats.fields.map((f, i) => (
              <li key={f.id} className="grid grid-cols-[1fr,1fr,auto] gap-2">
                <input aria-label={`Stat value ${i + 1}`} placeholder="Value" className={inputClasses} {...register(`about.stats.${i}.value`)} />
                <input aria-label={`Stat label ${i + 1}`} placeholder="Label" className={inputClasses} {...register(`about.stats.${i}.label`)} />
                <button type="button" aria-label={`Remove stat ${i + 1}`} onClick={() => stats.remove(i)} className="grid h-10 w-8 place-items-center rounded text-steel-500 hover:bg-red-50 hover:text-red-700">
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => stats.append({ label: '', value: '' })}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add stat
          </Button>
        </fieldset>
        <Textarea label="Accreditations and partners" rows={4} {...register('about.certifications')} />
        <p className="-mt-2 text-xs text-steel-500">One per line.</p>
        <Textarea label="About page image URLs" rows={3} {...register('about.images')} />
        <p className="-mt-2 text-xs text-steel-500">One URL per line.</p>
      </Card>

      <Card title="Admin login">
        <p className="text-xs text-amber-900">Demo credentials stored in this browser. Replace with real authentication before production.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Admin email" type="email" autoComplete="off" error={errors.admin?.email?.message} {...register('admin.email')} />
          <Input label="Admin password" type="text" autoComplete="off" error={errors.admin?.password?.message} {...register('admin.password')} />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Save changes
        </Button>
      </div>
    </form>
  )
}
