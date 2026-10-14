import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QuoteBasketList } from './QuoteBasketList'
import { seed } from '@/data/seed'
import { resetAll, useQuoteStore } from '@/stores'

beforeEach(() => resetAll())

test('clearing the quantity field while typing does not remove the line', async () => {
  const user = userEvent.setup()
  const product = seed.products[0]
  useQuoteStore.getState().add(product.id, 3)
  render(
    <MemoryRouter>
      <QuoteBasketList />
    </MemoryRouter>,
  )
  const input = screen.getByLabelText(`Quantity of ${product.name}`)
  await user.clear(input)
  expect(useQuoteStore.getState().items).toEqual([{ productId: product.id, quantity: 3 }])
  await user.type(input, '5')
  await user.tab()
  expect(useQuoteStore.getState().items).toEqual([{ productId: product.id, quantity: 5 }])
})

test('basket lines for products that no longer exist are pruned', () => {
  useQuoteStore.getState().add('ghost-product', 2)
  useQuoteStore.getState().add(seed.products[1].id, 1)
  render(
    <MemoryRouter>
      <QuoteBasketList />
    </MemoryRouter>,
  )
  expect(useQuoteStore.getState().items).toEqual([{ productId: seed.products[1].id, quantity: 1 }])
})
