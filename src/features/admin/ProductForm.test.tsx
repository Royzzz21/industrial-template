import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ProductForm } from './ProductForm'
import { useProductsStore } from '@/stores'
import { resetAll } from '@/stores'

beforeEach(() => resetAll())

test('typing a name auto-fills the slug until the slug is edited', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <ProductForm onSaved={() => undefined} />
    </MemoryRouter>,
  )
  await user.type(screen.getByLabelText(/^name/i), 'Test Pump')
  expect(screen.getByLabelText(/^slug/i)).toHaveValue('test-pump')
  await user.clear(screen.getByLabelText(/^slug/i))
  await user.type(screen.getByLabelText(/^slug/i), 'custom')
  await user.type(screen.getByLabelText(/^name/i), ' X')
  expect(screen.getByLabelText(/^slug/i)).toHaveValue('custom')
})

test('submitting a valid form creates the product in the store', async () => {
  const user = userEvent.setup()
  const onSaved = vi.fn()
  const before = useProductsStore.getState().products.length
  render(
    <MemoryRouter>
      <ProductForm onSaved={onSaved} />
    </MemoryRouter>,
  )
  await user.type(screen.getByLabelText(/^name/i), 'Test Pump')
  await user.type(screen.getByLabelText(/^sku/i), 'TST-1')
  await user.type(screen.getByLabelText(/^brand/i), 'Northline')
  await user.selectOptions(screen.getByLabelText(/^category/i), 'cat-pumps')
  await user.type(screen.getByLabelText(/short description/i), 'A pump')
  await user.type(screen.getByLabelText(/^spec label 1/i), 'Flow')
  await user.type(screen.getByLabelText(/^spec value 1/i), '10 m3/h')
  await user.click(screen.getByRole('button', { name: /save product/i }))
  expect(onSaved).toHaveBeenCalled()
  const products = useProductsStore.getState().products
  expect(products).toHaveLength(before + 1)
  expect(products[0]).toMatchObject({ name: 'Test Pump', slug: 'test-pump', sku: 'TST-1', categoryId: 'cat-pumps' })
})

test('shows an error when the required fields are empty', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <ProductForm onSaved={() => undefined} />
    </MemoryRouter>,
  )
  await user.click(screen.getByRole('button', { name: /save product/i }))
  expect(await screen.findByText('Enter a product name')).toBeInTheDocument()
})
