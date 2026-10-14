import { CAPABILITIES } from './content'

export function Capabilities() {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {CAPABILITIES.map(({ icon: Icon, title, text }) => (
        <li key={title} className="border-t-2 border-safety pt-4">
          <Icon className="h-7 w-7 text-steel" aria-hidden="true" />
          <h3 className="mt-3 font-display text-xl font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-steel-500">{text}</p>
        </li>
      ))}
    </ul>
  )
}
