import type { Spec } from '@/types'

export function SpecTable({ specs }: { specs: Spec[] }) {
  if (specs.length === 0) return null
  return (
    <table className="w-full text-sm">
      <caption className="sr-only">Specifications</caption>
      <tbody>
        {specs.map((s, i) => (
          <tr key={`${s.label}-${i}`} className="border-b border-steel-100">
            <th scope="row" className="w-2/5 py-2.5 pr-4 text-left font-medium text-steel-600 sm:w-1/3">
              {s.label}
            </th>
            <td className="py-2.5 text-graphite">{s.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
