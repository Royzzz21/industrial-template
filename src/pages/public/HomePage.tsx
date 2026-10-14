import { useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { Section, SectionHeading } from '@/components/layout/Section'
import { HeroCarousel } from '@/features/carousel/HeroCarousel'
import { Capabilities } from '@/features/home/Capabilities'
import { CategoryGrid } from '@/features/home/CategoryGrid'
import { CtaBand } from '@/features/home/CtaBand'
import { IndustriesStrip } from '@/features/home/IndustriesStrip'
import { ProcessSteps } from '@/features/home/ProcessSteps'
import { Testimonials } from '@/features/home/Testimonials'
import { ProductGrid } from '@/features/products/ProductGrid'
import { seed } from '@/data/seed'
import { useCategoriesStore, useProductsStore, useSlidesStore } from '@/stores'

export function HomePage() {
  const slides = useSlidesStore((s) => s.slides)
  const categories = useCategoriesStore((s) => s.categories)
  const products = useProductsStore((s) => s.products)

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const p of products) c[p.categoryId] = (c[p.categoryId] ?? 0) + 1
    return c
  }, [products])
  const featured = useMemo(() => products.filter((p) => p.featured).slice(0, 6), [products])

  return (
    <>
      <HeroCarousel slides={slides} />
      <IndustriesStrip />
      <Section>
        <SectionHeading
          title="Equipment by category"
          lead="Six product families covering power, air, water, fabrication, lifting and hand tools."
        />
        <CategoryGrid categories={categories} counts={counts} />
      </Section>
      <Section tone="concrete">
        <SectionHeading
          title="Featured products"
          lead="Popular units kept in stock at our Calamba warehouse."
          action={
            <Button to="/products" variant="outline">
              View all products
            </Button>
          }
        />
        <ProductGrid products={featured} categories={categories} />
      </Section>
      <Section>
        <SectionHeading title="Why buy from Northline" />
        <Capabilities />
      </Section>
      <Section tone="steel">
        <h2 className="mb-8 text-3xl text-white sm:text-4xl">How an order works</h2>
        <ProcessSteps />
      </Section>
      <Section tone="concrete">
        <SectionHeading title="What customers say" />
        <Testimonials items={seed.testimonials} />
      </Section>
      <CtaBand />
    </>
  )
}
