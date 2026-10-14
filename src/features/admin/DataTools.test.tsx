import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataTools } from './DataTools'
import { resetAll, useProductsStore } from '@/stores'
import { seed } from '@/data/seed'

beforeEach(() => resetAll())

test('importing an invalid file lists the errors and keeps the data', async () => {
  const user = userEvent.setup()
  render(<DataTools />)
  const file = new File(['{"products":"nope"}'], 'bad.json', { type: 'application/json' })
  await user.upload(screen.getByLabelText(/import json file/i), file)
  expect(await screen.findByRole('alert')).toHaveTextContent(/products/i)
  expect(useProductsStore.getState().products).toHaveLength(seed.products.length)
})

test('reset to seed data restores the catalogue after confirming', async () => {
  const user = userEvent.setup()
  useProductsStore.getState().remove(seed.products[0].id)
  expect(useProductsStore.getState().products).toHaveLength(seed.products.length - 1)
  render(<DataTools />)
  await user.click(screen.getByRole('button', { name: /reset to seed data/i }))
  await user.click(await screen.findByRole('button', { name: /^reset$/i }))
  expect(useProductsStore.getState().products).toHaveLength(seed.products.length)
})
