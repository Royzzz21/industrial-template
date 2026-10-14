import { useState } from 'react'
import { cn } from '@/lib/cn'

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0)
  const list = images.length ? images : ['']
  return (
    <div>
      <div className="aspect-[4/3] overflow-hidden rounded border border-steel-200 bg-steel-100">
        {list[index] ? (
          <img src={list[index]} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-sm text-steel-400">No image</div>
        )}
      </div>
      {list.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto">
          {list.map((src, i) => (
            <li key={`${src}-${i}`}>
              <button
                type="button"
                aria-label={`Show image ${i + 1}`}
                aria-pressed={i === index}
                onClick={() => setIndex(i)}
                className={cn('block h-16 w-20 overflow-hidden rounded border-2 bg-steel-100', i === index ? 'border-safety' : 'border-transparent hover:border-steel-300')}
              >
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
