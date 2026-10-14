import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { inputClasses } from './Input'
import { FieldError } from './FieldError'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea({ label, error, id, className, ...rest }, ref) {
  const inputId = id ?? rest.name ?? label.toLowerCase().replace(/\s+/g, '-')
  const errorId = `${inputId}-error`
  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-steel">
        {label}
      </label>
      <textarea
        ref={ref}
        id={inputId}
        rows={5}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={inputClasses}
        {...rest}
      />
      <FieldError id={errorId} message={error} />
    </div>
  )
})
