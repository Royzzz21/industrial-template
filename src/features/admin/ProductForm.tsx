import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Product } from '@/types'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { STOCK_OPTIONS } from '@/lib/format'
import { slugify } from '@/lib/slugify'
import { useCategoriesStore, useProductsStore } from '@/stores'
import { ImageListEditor } from './ImageListEditor'
import { productSchema, type ProductFormValues } from './productSchema'
import { SpecsEditor } from './SpecsEditor'

function toValues(p?: Product): ProductFormValues {
  return {
    name: p?.name ?? '',
    slug: p?.slug ?? '',
    sku: p?.sku ?? '',
    brand: p?.brand ?? '',
    categoryId: p?.categoryId ?? '',
    shortDescription: p?.shortDescription ?? '',
    description: p?.description ?? '',
    images: (p?.images ?? []).map((url) => ({ url })),
    specs: p?.specs ?? [{ label: '', value: '' }],
    stock: p?.stock ?? 'in_stock',
    priceLabel: p?.priceLabel ?? '',
    datasheetUrl: p?.datasheetUrl ?? '',
    featured: p?.featured ?? false,
  }
}

export function ProductForm({ product, onSaved, onCancel }: { product?: Product; onSaved: (saved: Product) => void; onCancel?: () => void }) {
  const categories = useCategoriesStore((s) => s.categories)
  const add = useProductsStore((s) => s.add)
  const update = useProductsStore((s) => s.update)
  const [slugTouched, setSlugTouched] = useState(Boolean(product))

  const form = useForm<ProductFormValues>({ resolver: zodResolver(productSchema), defaultValues: toValues(product) })
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = form
  const name = watch('name')

  useEffect(() => {
    if (!slugTouched) setValue('slug', slugify(name ?? ''))
  }, [name, slugTouched, setValue])

  const onSubmit = (v: ProductFormValues) => {
    const input = {
      ...v,
      slug: v.slug || undefined,
      images: v.images.map((i) => i.url).filter(Boolean),
      specs: v.specs.filter((s) => s.label || s.value),
      priceLabel: v.priceLabel || undefined,
      datasheetUrl: v.datasheetUrl || undefined,
    }
    const saved = product ? update(product.id, input) : add(input)
    onSaved(saved)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
      <div className="space-y-5 rounded border border-steel-200 bg-white p-5">
        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Input
          label="Slug"
          hint="Used in the product URL. Generated from the name until you edit it."
          error={errors.slug?.message}
          {...register('slug', { onChange: () => setSlugTouched(true) })}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="SKU" error={errors.sku?.message} {...register('sku')} />
          <Input label="Brand" error={errors.brand?.message} {...register('brand')} />
        </div>
        <Select
          label="Category"
          placeholder="Choose a category"
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          error={errors.categoryId?.message}
          {...register('categoryId')}
        />
        <Textarea label="Short description" rows={2} error={errors.shortDescription?.message} {...register('shortDescription')} />
        <Textarea label="Full description" rows={6} error={errors.description?.message} {...register('description')} />
        <SpecsEditor control={control} register={register} />
        <ImageListEditor control={control} register={register} />
      </div>
      <div className="space-y-5">
        <div className="space-y-5 rounded border border-steel-200 bg-white p-5">
          <Select label="Stock status" options={STOCK_OPTIONS} error={errors.stock?.message} {...register('stock')} />
          <Input label="Price label" hint="Shown on the card, for example “From ₱42,500”. Leave empty for “Price on request”." {...register('priceLabel')} />
          <Input label="Datasheet URL" hint="Link to a PDF, optional." {...register('datasheetUrl')} />
          <Checkbox label="Featured on the home page" {...register('featured')} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit">Save product</Button>
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
