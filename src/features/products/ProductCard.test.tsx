import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ProductCard } from './ProductCard'
import { seed } from '@/data/seed'
import { useQuoteStore } from '@/stores'

const product = seed.products.find((p) => p.sku === 'GEN-NG65')!
const category = seed.categories.find((c) => c.id === product.categoryId)!

beforeEach(() => useQuoteStore.getState().clear())

test('shows name, sku, first two specs and the stock badge', () => {
  render(
    <MemoryRouter>
      <ProductCard product={product} category={category} />
    </MemoryRouter>,
  )
  expect(screen.getByRole('heading', { name: product.name })).toBeInTheDocument()
  expect(screen.getByText('GEN-NG65')).toBeInTheDocument()
  expect(screen.getByText('Prime power')).toBeInTheDocument()
  expect(screen.getByText('Standby power')).toBeInTheDocument()
  expect(screen.queryByText('Engine')).not.toBeInTheDocument()
  expect(screen.getByText('In stock')).toBeInTheDocument()
})

test('add to quote puts the product in the basket', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <ProductCard product={product} category={category} />
    </MemoryRouter>,
  )
  await user.click(screen.getByRole('button', { name: /add to quote/i }))
  expect(useQuoteStore.getState().items).toEqual([{ productId: product.id, quantity: 1 }])
})
