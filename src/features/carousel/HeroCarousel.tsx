import { useCallback, useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Slide } from '@/types'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/cn'
import { prefersReducedMotion } from '@/lib/media'

const headlineClass = 'font-display text-4xl font-bold leading-[0.95] text-white sm:text-6xl lg:text-7xl'

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const enabled = useMemo(
    () => slides.filter((s) => s.enabled).sort((a, b) => a.sortOrder - b.sortOrder),
    [slides],
  )
  const reduced = prefersReducedMotion()
  const plugins = useMemo(
    () => (reduced ? [] : [Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true })]),
    [reduced],
  )
  const [emblaRef, embla] = useEmblaCarousel({ loop: enabled.length > 1, duration: reduced ? 0 : 25 }, plugins)
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (!embla) return
    const onSelect = () => setSelected(embla.selectedScrollSnap())
    embla.on('select', onSelect)
    onSelect()
    return () => {
      embla.off('select', onSelect)
    }
  }, [embla])

  const scrollTo = useCallback((i: number) => embla?.scrollTo(i), [embla])
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') embla?.scrollPrev()
    if (e.key === 'ArrowRight') embla?.scrollNext()
  }

  if (enabled.length === 0) return null

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative bg-steel text-white"
      onKeyDown={onKeyDown}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {enabled.map((slide, i) => (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${enabled.length}`}
              className="relative min-w-0 flex-[0_0_100%]"
            >
              <div className="relative h-[72vh] min-h-[460px] max-h-[720px]">
                <img
                  src={slide.imageUrl}
                  alt=""
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-steel/90 via-steel/60 to-steel/10" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-t from-steel/70 to-transparent sm:hidden" aria-hidden="true" />
                <Container className="relative flex h-full flex-col justify-end pb-20 pt-16 sm:justify-center sm:pb-16">
                  <div className="max-w-2xl">
                    {i === 0 ? (
                      <h1 className={headlineClass}>{slide.headline}</h1>
                    ) : (
                      <h2 className={headlineClass}>{slide.headline}</h2>
                    )}
                    <p className="mt-4 max-w-xl text-base text-steel-100 sm:text-lg">{slide.text}</p>
                    {slide.buttonLabel && (
                      <div className="mt-6">
                        <Button to={slide.buttonHref} size="lg">
                          {slide.buttonLabel}
                        </Button>
                      </div>
                    )}
                  </div>
                </Container>
              </div>
            </div>
          ))}
        </div>
      </div>

      {enabled.length > 1 && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center gap-2 sm:bottom-8">
            {enabled.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === selected ? 'true' : undefined}
                onClick={() => scrollTo(i)}
                className={cn(
                  'pointer-events-auto h-2.5 rounded-full transition-all',
                  i === selected ? 'w-8 bg-safety' : 'w-2.5 bg-white/60 hover:bg-white',
                )}
              />
            ))}
          </div>
          <div className="absolute bottom-5 right-4 hidden gap-2 sm:flex lg:right-8">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => embla?.scrollPrev()}
              className="grid h-11 w-11 place-items-center rounded border border-white/40 bg-steel/40 text-white backdrop-blur hover:bg-white hover:text-steel"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => embla?.scrollNext()}
              className="grid h-11 w-11 place-items-center rounded border border-white/40 bg-steel/40 text-white backdrop-blur hover:bg-white hover:text-steel"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </>
      )}
    </section>
  )
}
