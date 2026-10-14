import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { FieldError } from './FieldError'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode
  error?: string
}

export const Checkbox = forwardRef<HTMLInputElement, Props>(function Checkbox({ label, error, id, className, ...rest }, ref) {
  const inputId = id ?? rest.name ?? 'checkbox'
  const errorId = `${inputId}-error`
  return (
    <div className={className}>
      <label htmlFor={inputId} className="flex items-start gap-3 text-sm text-graphite">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          className="mt-0.5 h-4 w-4 rounded border-steel-300 text-safety focus:ring-safety"
          {...rest}
        />
        <span>{label}</span>
      </label>
      <FieldError id={errorId} message={error} />
    </div>
  )
})
