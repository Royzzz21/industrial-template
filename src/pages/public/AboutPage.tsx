import { BadgeCheck } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { Section } from '@/components/layout/Section'
import { CtaBand } from '@/features/home/CtaBand'
import { useSettingsStore } from '@/stores'

export function AboutPage() {
  const { company, about } = useSettingsStore((s) => s.settings)
  return (
    <>
      <PageHeader title={`About ${company.name}`} lead={company.tagline} />
      <Container className="grid gap-10 py-10 lg:grid-cols-[minmax(0,7fr),minmax(0,5fr)] lg:py-16">
        <div className="space-y-5 text-base leading-7 text-graphite">
          {about.intro.map((p, i) => (
            <p key={i} className={i === 0 ? 'text-lg leading-8 text-steel' : undefined}>
              {p}
            </p>
          ))}
        </div>
        <div className="grid gap-4">
          {about.images.map((src, i) => (
            <div key={src} className="aspect-[4/3] overflow-hidden rounded border border-steel-200 bg-steel-100">
              <img src={src} alt={i === 0 ? 'Northline workshop' : 'Northline engineer inspecting equipment'} loading="lazy" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </Container>
      <Section tone="steel">
        <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {about.stats.map((s) => (
            <div key={s.label} className="border-l-2 border-safety pl-4">
              <dd className="font-display text-5xl font-bold leading-none text-white">{s.value}</dd>
              <dt className="mt-2 text-sm text-steel-200">{s.label}</dt>
            </div>
          ))}
        </dl>
      </Section>
      <Section tone="concrete">
        <h2 className="text-3xl sm:text-4xl">Accreditations and partners</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {about.certifications.map((c) => (
            <li key={c} className="flex items-start gap-3 rounded border border-steel-200 bg-white p-4 text-sm">
              <BadgeCheck className="h-5 w-5 shrink-0 text-safety" aria-hidden="true" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand />
    </>
  )
}
