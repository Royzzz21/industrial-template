import type { ReactNode, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export function Table({ className, children, ...rest }: TableHTMLAttributes<HTMLTableElement> & { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded border border-steel-200 bg-white">
      <table className={cn('w-full min-w-[640px] text-left text-sm', className)} {...rest}>
        {children}
      </table>
    </div>
  )
}

export function Th({ className, children, ...rest }: ThHTMLAttributes<HTMLTableCellElement> & { children?: ReactNode }) {
  return (
    <th scope="col" className={cn('border-b border-steel-200 bg-steel-50 px-3 py-2 text-xs font-semibold text-steel-600', className)} {...rest}>
      {children}
    </th>
  )
}

export function Td({ className, children, ...rest }: TdHTMLAttributes<HTMLTableCellElement> & { children?: ReactNode }) {
  return (
    <td className={cn('border-b border-steel-100 px-3 py-2 align-middle', className)} {...rest}>
      {children}
    </td>
  )
}
