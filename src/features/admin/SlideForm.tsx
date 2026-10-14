import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'
import { z } from 'zod'
import type { Slide } from '@/types'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'
import { fileToDataUrl } from '@/lib/fileToDataUrl'
import { useSlidesStore } from '@/stores'

const schema = z.object({
  headline: z.string().trim().min(1, 'Enter a headline'),
  text: z.string().trim(),
  buttonLabel: z.string().trim(),
  buttonHref: z.string().trim(),
  imageUrl: z.string().trim().min(1, 'Add a background image'),
  enabled: z.boolean(),
})
type Values = z.infer<typeof schema>

export function SlideForm({ slide, onSaved, onCancel }: { slide?: Slide; onSaved: () => void; onCancel: () => void }) {
  const add = useSlidesStore((s) => s.add)
  const update = useSlidesStore((s) => s.update)
  const fileRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      headline: slide?.headline ?? '',
      text: slide?.text ?? '',
      buttonLabel: slide?.buttonLabel ?? 'Browse products',
      buttonHref: slide?.buttonHref ?? '/products',
      imageUrl: slide?.imageUrl ?? '',
      enabled: slide?.enabled ?? true,
    },
  })
  const imageUrl = watch('imageUrl')

  const onFile = async (file?: File) => {
    if (!file) return
    if (file.size > 1_000_000) toast.show({ title: 'Image is large', description: 'Over 1 MB. Prefer a URL or a smaller file.', tone: 'error' })
    setValue('imageUrl', await fileToDataUrl(file), { shouldValidate: true })
  }

  const onSubmit = (v: Values) => {
    if (slide) update(slide.id, v)
    else add(v)
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Input label="Headline" hint="Keep it under about eight words." error={errors.headline?.message} {...register('headline')} />
      <Textarea label="Supporting text" rows={2} {...register('text')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Button label" {...register('buttonLabel')} />
        <Input label="Button link" hint="For example /products?category=generators" {...register('buttonHref')} />
      </div>
      <div>
        <Input label="Background image URL" error={errors.imageUrl?.message} {...register('imageUrl')} />
        <div className="mt-2 flex items-center gap-3">
          <span className="h-14 w-24 overflow-hidden rounded border border-steel-200 bg-steel-100">{imageUrl && <img src={imageUrl} alt="" className="h-full w-full object-cover" />}</span>
          <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" aria-hidden="true" />
            Upload image
          </Button>
          <input ref={fileRef} type="file" accept="image/*" className="sr-only" aria-label="Upload slide image" onChange={(e) => onFile(e.target.files?.[0])} />
        </div>
      </div>
      <Checkbox label="Show this slide" {...register('enabled')} />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save slide</Button>
      </div>
    </form>
  )
}
