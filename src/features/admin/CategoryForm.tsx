import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Category } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { slugify } from '@/lib/slugify'
import { useCategoriesStore } from '@/stores'

const schema = z.object({
  name: z.string().trim().min(1, 'Enter a category name'),
  slug: z.string().trim(),
  description: z.string().trim(),
  imageUrl: z.string().trim(),
  sortOrder: z.number({ message: 'Enter a number' }).int().min(0),
})
type Values = z.infer<typeof schema>

export function CategoryForm({ category, onSaved, onCancel }: { category?: Category; onSaved: () => void; onCancel: () => void }) {
  const add = useCategoriesStore((s) => s.add)
  const update = useCategoriesStore((s) => s.update)
  const count = useCategoriesStore((s) => s.categories.length)
  const [slugTouched, setSlugTouched] = useState(Boolean(category))
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category?.name ?? '',
      slug: category?.slug ?? '',
      description: category?.description ?? '',
      imageUrl: category?.imageUrl ?? '',
      sortOrder: category?.sortOrder ?? count + 1,
    },
  })
  const name = watch('name')
  useEffect(() => {
    if (!slugTouched) setValue('slug', slugify(name ?? ''))
  }, [name, slugTouched, setValue])

  const onSubmit = (v: Values) => {
    const input = { ...v, slug: v.slug || undefined }
    if (category) update(category.id, input)
    else add(input)
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Input label="Name" error={errors.name?.message} {...register('name')} />
      <Input label="Slug" hint="Used in product filter links." {...register('slug', { onChange: () => setSlugTouched(true) })} />
      <Textarea label="Description" rows={3} {...register('description')} />
      <Input label="Image URL" {...register('imageUrl')} />
      <Input label="Sort order" type="number" min={0} className="max-w-[10rem]" error={errors.sortOrder?.message} {...register('sortOrder', { valueAsNumber: true })} />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save category</Button>
      </div>
    </form>
  )
}
