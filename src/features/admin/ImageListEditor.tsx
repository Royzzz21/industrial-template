import { useRef } from 'react'
import { useFieldArray, useWatch, type Control, type UseFormRegister } from 'react-hook-form'
import { Plus, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { inputClasses } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { fileToDataUrl } from '@/lib/fileToDataUrl'
import type { ProductFormValues } from './productSchema'

const MAX_UPLOAD_BYTES = 1_000_000

export function ImageListEditor({ control, register }: { control: Control<ProductFormValues>; register: UseFormRegister<ProductFormValues> }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'images' })
  const values = useWatch({ control, name: 'images' })
  const fileRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const onFiles = async (files: FileList | null) => {
    if (!files) return
    for (const file of Array.from(files)) {
      if (file.size > MAX_UPLOAD_BYTES) {
        toast.show({ title: 'Image is large', description: `${file.name} is over 1 MB. Browser storage is limited, so prefer a URL or a smaller file.`, tone: 'error' })
      }
      try {
        append({ url: await fileToDataUrl(file) })
      } catch {
        toast.show({ title: 'Could not read file', description: file.name, tone: 'error' })
      }
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <fieldset>
      <legend className="mb-1 text-sm font-medium text-steel">Images</legend>
      <p className="mb-3 text-xs text-steel-500">Paste image URLs or upload files. The first image is the main photo.</p>
      <ul className="space-y-2">
        {fields.map((f, i) => (
          <li key={f.id} className="flex items-center gap-2">
            <span className="h-12 w-16 shrink-0 overflow-hidden rounded border border-steel-200 bg-steel-100">
              {values?.[i]?.url ? <img src={values[i].url} alt="" className="h-full w-full object-cover" /> : null}
            </span>
            <input aria-label={`Image URL ${i + 1}`} placeholder="https://…" className={inputClasses} {...register(`images.${i}.url`)} />
            <button type="button" aria-label={`Remove image ${i + 1}`} onClick={() => remove(i)} className="grid h-10 w-8 shrink-0 place-items-center rounded text-steel-500 hover:bg-red-50 hover:text-red-700">
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => append({ url: '' })}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add URL
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
          <Upload className="h-4 w-4" aria-hidden="true" />
          Upload image
        </Button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="sr-only" aria-label="Upload image files" onChange={(e) => onFiles(e.target.files)} />
      </div>
    </fieldset>
  )
}
