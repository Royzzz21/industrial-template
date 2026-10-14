import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HeroCarousel } from './HeroCarousel'
import type { Slide } from '@/types'

const slides: Slide[] = [1, 2, 3].map((n) => ({
  id: `s${n}`,
  headline: `Headline ${n}`,
  text: `Text ${n}`,
  buttonLabel: `Button ${n}`,
  buttonHref: '/products',
  imageUrl: `https://example.com/${n}.jpg`,
  enabled: n !== 3,
  sortOrder: n,
}))

test('renders one dot per enabled slide with the first current', () => {
  render(
    <MemoryRouter>
      <HeroCarousel slides={slides} />
    </MemoryRouter>,
  )
  const dots = screen.getAllByRole('button', { name: /go to slide \d/i })
  expect(dots).toHaveLength(2)
  expect(dots[0]).toHaveAttribute('aria-current', 'true')
  expect(screen.getByRole('region', { name: /featured/i })).toHaveAttribute('aria-roledescription', 'carousel')
  expect(screen.queryByText('Headline 3')).not.toBeInTheDocument()
})

test('renders nothing when no slides are enabled', () => {
  const { container } = render(
    <MemoryRouter>
      <HeroCarousel slides={slides.map((s) => ({ ...s, enabled: false }))} />
    </MemoryRouter>,
  )
  expect(container).toBeEmptyDOMElement()
})

test('renders a single h1 even with several slides', () => {
  render(
    <MemoryRouter>
      <HeroCarousel slides={slides} />
    </MemoryRouter>,
  )
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
})

test('dot controls have a 24px hit target', () => {
  render(
    <MemoryRouter>
      <HeroCarousel slides={slides} />
    </MemoryRouter>,
  )
  for (const dot of screen.getAllByRole('button', { name: /go to slide/i })) {
    expect(dot.className).toMatch(/\bh-6\b/)
    expect(dot.className).toMatch(/\bw-6\b/)
  }
})
