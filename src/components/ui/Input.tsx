import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { FieldError } from './FieldError'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export const inputClasses =
  'block w-full rounded border-steel-300 bg-white text-graphite shadow-none placeholder:text-steel-400 focus:border-steel focus:ring-safety sm:text-sm aria-[invalid=true]:border-red-500'

export const Input = forwardRef<HTMLInputElement, Props>(function Input({ label, error, hint, id, className, ...rest }, ref) {
  const inputId = id ?? rest.name ?? label.toLowerCase().replace(/\s+/g, '-')
  const errorId = `${inputId}-error`
  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-steel">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={inputClasses}
        {...rest}
      />
      {hint && !error && <p className="mt-1 text-xs text-steel-400">{hint}</p>}
      <FieldError id={errorId} message={error} />
    </div>
  )
})
