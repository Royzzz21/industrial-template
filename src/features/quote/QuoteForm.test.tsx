import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QuoteForm } from './QuoteForm'
import { seed } from '@/data/seed'
import { useEnquiriesStore, useQuoteStore } from '@/stores'

beforeEach(() => {
  useEnquiriesStore.getState().reset()
  useQuoteStore.getState().clear()
})

test('shows validation messages on an empty submit', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <QuoteForm />
    </MemoryRouter>,
  )
  await user.click(screen.getByRole('button', { name: /send quote request/i }))
  expect(await screen.findByText('Enter your name')).toBeInTheDocument()
  expect(screen.getByText('Enter a valid email')).toBeInTheDocument()
  expect(useEnquiriesStore.getState().enquiries).toHaveLength(0)
})

test('valid submit stores an enquiry with basket items, clears the basket and shows the reference', async () => {
  const user = userEvent.setup()
  const product = seed.products[0]
  useQuoteStore.getState().add(product.id, 2)
  render(
    <MemoryRouter>
      <QuoteForm />
    </MemoryRouter>,
  )
  await user.type(screen.getByLabelText(/full name/i), 'Ramon Villanueva')
  await user.type(screen.getByLabelText(/company/i), 'Laguna Cold Chain')
  await user.type(screen.getByLabelText(/email/i), 'ramon@example.com')
  await user.type(screen.getByLabelText(/phone/i), '09171234567')
  await user.type(screen.getByLabelText(/message/i), 'Need a standby set for a 180 kW load.')
  await user.click(screen.getByLabelText(/agree/i))
  await user.click(screen.getByRole('button', { name: /send quote request/i }))

  expect(await screen.findByText(/NL-\d{8}-[A-Z0-9]{4}/)).toBeInTheDocument()
  const [enquiry] = useEnquiriesStore.getState().enquiries
  expect(enquiry.items).toEqual([{ productId: product.id, name: product.name, sku: product.sku, quantity: 2 }])
  expect(useQuoteStore.getState().items).toHaveLength(0)
})
