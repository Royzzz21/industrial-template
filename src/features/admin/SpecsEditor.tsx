import { useFieldArray, type Control, type UseFormRegister } from 'react-hook-form'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { inputClasses } from '@/components/ui/Input'
import type { ProductFormValues } from './productSchema'

export function SpecsEditor({ control, register }: { control: Control<ProductFormValues>; register: UseFormRegister<ProductFormValues> }) {
  const { fields, append, remove, move } = useFieldArray({ control, name: 'specs' })
  return (
    <fieldset>
      <legend className="mb-1 text-sm font-medium text-steel">Specifications</legend>
      <p className="mb-3 text-xs text-steel-500">The first two rows appear on the product card.</p>
      <ul className="space-y-2">
        {fields.map((f, i) => (
          <li key={f.id} className="grid grid-cols-[1fr,1fr,auto] gap-2">
            <input aria-label={`Spec label ${i + 1}`} placeholder="Label" className={inputClasses} {...register(`specs.${i}.label`)} />
            <input aria-label={`Spec value ${i + 1}`} placeholder="Value" className={inputClasses} {...register(`specs.${i}.value`)} />
            <div className="flex gap-1">
              <button type="button" aria-label={`Move spec ${i + 1} up`} disabled={i === 0} onClick={() => move(i, i - 1)} className="grid h-10 w-8 place-items-center rounded text-steel-500 hover:bg-steel-50 disabled:opacity-30">
                <ArrowUp className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" aria-label={`Move spec ${i + 1} down`} disabled={i === fields.length - 1} onClick={() => move(i, i + 1)} className="grid h-10 w-8 place-items-center rounded text-steel-500 hover:bg-steel-50 disabled:opacity-30">
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" aria-label={`Remove spec ${i + 1}`} onClick={() => remove(i)} className="grid h-10 w-8 place-items-center rounded text-steel-500 hover:bg-red-50 hover:text-red-700">
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => append({ label: '', value: '' })}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add row
      </Button>
    </fieldset>
  )
}
