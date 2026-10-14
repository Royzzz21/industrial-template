import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-safety text-white hover:bg-safety-600 border border-transparent',
  secondary: 'bg-steel text-white hover:bg-steel-700 border border-transparent',
  outline: 'bg-white text-steel border border-steel-300 hover:border-steel hover:bg-steel-50',
  ghost: 'bg-transparent text-steel hover:bg-steel-100 border border-transparent',
  danger: 'bg-red-600 text-white hover:bg-red-700 border border-transparent',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
}

export const buttonClasses = (variant: Variant = 'primary', size: Size = 'md', className?: string) =>
  cn(
    'inline-flex items-center justify-center rounded font-medium leading-none whitespace-nowrap transition-colors',
    'disabled:opacity-50 disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    className,
  )

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined }
type LinkProps = CommonProps & { to: string; onClick?: () => void; 'aria-label'?: string }

export const Button = forwardRef<HTMLButtonElement, ButtonProps | LinkProps>(function Button(
  { variant = 'primary', size = 'md', className, children, ...rest },
  ref,
) {
  const classes = buttonClasses(variant, size, className)
  if ('to' in rest && typeof rest.to === 'string') {
    const { to, ...linkRest } = rest as LinkProps
    return (
      <Link to={to} className={classes} {...linkRest}>
        {children}
      </Link>
    )
  }
  const { type = 'button', ...buttonRest } = rest as ButtonProps
  return (
    <button ref={ref} type={type} className={classes} {...buttonRest}>
      {children}
    </button>
  )
})
