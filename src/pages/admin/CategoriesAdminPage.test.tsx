import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { CategoriesAdminPage } from './CategoriesAdminPage'
import { resetAll, useCategoriesStore } from '@/stores'

beforeEach(() => resetAll())

test('deleting a category that products use shows the reason and keeps the row', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <CategoriesAdminPage />
    </MemoryRouter>,
  )
  await user.click(screen.getByRole('button', { name: /delete generators/i }))
  expect(await screen.findByText(/products use this category/i)).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /^delete$/i })).not.toBeInTheDocument()
  expect(useCategoriesStore.getState().categories.find((c) => c.slug === 'generators')).toBeTruthy()
})

test('an unused category can be deleted after confirming', async () => {
  const user = userEvent.setup()
  useCategoriesStore.getState().add({ name: 'Spares', description: '', imageUrl: '', sortOrder: 9 })
  render(
    <MemoryRouter>
      <CategoriesAdminPage />
    </MemoryRouter>,
  )
  await user.click(screen.getByRole('button', { name: /delete spares/i }))
  await user.click(await screen.findByRole('button', { name: /^delete$/i }))
  expect(useCategoriesStore.getState().categories.find((c) => c.slug === 'spares')).toBeUndefined()
})
