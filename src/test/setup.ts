import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

// jsdom has no matchMedia; embla-carousel and our reduced-motion check need it.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList
}

// jsdom has no IntersectionObserver or ResizeObserver; embla-carousel uses both.
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
if (typeof window !== 'undefined') {
  if (!('IntersectionObserver' in window)) {
    Object.assign(window, { IntersectionObserver: NoopObserver })
  }
  if (!('ResizeObserver' in window)) {
    Object.assign(window, { ResizeObserver: NoopObserver })
  }
}
