import { PROCESS } from './content'

export function ProcessSteps() {
  return (
    <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {PROCESS.map((step, i) => (
        <li key={step.title} className="relative rounded border border-steel-700 bg-steel-700/40 p-5">
          <span className="font-display text-5xl font-bold leading-none text-safety" aria-hidden="true">
            {i + 1}
          </span>
          <h3 className="mt-3 font-display text-xl font-semibold text-white">
            <span className="sr-only">Step {i + 1}: </span>
            {step.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-steel-200">{step.text}</p>
        </li>
      ))}
    </ol>
  )
}
