import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container } from '@/components/layout/Container'
import { Section, SectionHeading } from '@/components/layout/Section'
import { ImageGallery } from '@/features/products/ImageGallery'
import { ProductGrid } from '@/features/products/ProductGrid'
import { SpecTable } from '@/features/products/SpecTable'
import { StockBadge } from '@/features/products/StockBadge'
import { NotFoundPage } from '@/pages/public/NotFoundPage'
import { useCategoriesStore, useProductsStore, useQuoteStore } from '@/stores'

export function ProductDetailPage() {
  const { slug } = useParams()
  const products = useProductsStore((s) => s.products)
  const categories = useCategoriesStore((s) => s.categories)
  const add = useQuoteStore((s) => s.add)
  const toast = useToast()
  const [qty, setQty] = useState(1)

  const product = products.find((p) => p.slug === slug)
  const category = categories.find((c) => c.id === product?.categoryId)
  const related = useMemo(
    () => (product ? products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 3) : []),
    [products, product],
  )

  if (!product) return <NotFoundPage />

  const onAdd = () => {
    add(product.id, qty)
    toast.show({ title: 'Added to your quote', description: `${qty} × ${product.name}`, tone: 'success' })
  }

  return (
    <>
      <Container className="pt-6 lg:pt-8">
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Products', to: '/products' },
            ...(category ? [{ label: category.name, to: `/products?category=${category.slug}` }] : []),
            { label: product.name },
          ]}
        />
      </Container>
      <Container className="grid gap-8 pb-10 lg:grid-cols-2 lg:gap-12 lg:pb-16">
        <ImageGallery images={product.images} alt={product.name} />
        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-steel-500">
            <span>{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{product.sku}</span>
            <StockBadge status={product.stock} />
          </div>
          <h1 className="mt-2 text-3xl leading-tight sm:text-4xl lg:text-5xl">{product.name}</h1>
          <p className="mt-4 text-base leading-7 text-graphite">{product.shortDescription}</p>
          <p className="mt-5 font-display text-2xl font-semibold text-steel">{product.priceLabel || 'Price on request'}</p>

          <div className="mt-6 flex flex-wrap items-end gap-3 rounded border border-steel-200 bg-concrete p-4">
            <div>
              <label htmlFor="qty" className="mb-1 block text-sm font-medium text-steel">
                Quantity
              </label>
              <input
                id="qty"
                type="number"
                min={1}
                max={999}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Math.min(999, Number(e.target.value) || 1)))}
                className="w-24 rounded border-steel-300 focus:border-steel focus:ring-safety sm:text-sm"
              />
            </div>
            <Button onClick={onAdd} size="lg">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add to quote
            </Button>
            <p className="basis-full text-xs text-steel-500">No payment is taken. We reply with a written quotation and lead times.</p>
          </div>

          {product.datasheetUrl && (
            <a href={product.datasheetUrl} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-steel underline-offset-4 hover:underline">
              <Download className="h-4 w-4" aria-hidden="true" />
              Download datasheet (PDF)
            </a>
          )}
        </div>
      </Container>

      <Section tone="concrete">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl">About this product</h2>
            <p className="mt-4 whitespace-pre-line text-base leading-7 text-graphite">{product.description}</p>
          </div>
          <div>
            <h2 className="text-3xl">Specifications</h2>
            <div className="mt-4 rounded border border-steel-200 bg-white px-4">
              <SpecTable specs={product.specs} />
            </div>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section>
          <SectionHeading title="Related products" action={category && <Button to={`/products?category=${category.slug}`} variant="outline">All {category.name.toLowerCase()}</Button>} />
          <ProductGrid products={related} categories={categories} />
        </Section>
      )}
    </>
  )
}
