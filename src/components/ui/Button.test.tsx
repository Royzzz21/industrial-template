import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Button } from './Button'

test('renders a link when `to` is given', () => {
  render(
    <MemoryRouter>
      <Button to="/products">Browse</Button>
    </MemoryRouter>,
  )
  expect(screen.getByRole('link', { name: 'Browse' })).toHaveAttribute('href', '/products')
})

test('renders a button otherwise and forwards disabled', () => {
  render(<Button disabled>Save</Button>)
  expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
})
