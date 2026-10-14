import { render } from '@testing-library/react'
import { Dialog } from './Dialog'

test('two dialogs on one page get distinct title ids', () => {
  const { container } = render(
    <>
      <Dialog open={false} onClose={() => undefined} title="One">
        a
      </Dialog>
      <Dialog open={false} onClose={() => undefined} title="Two">
        b
      </Dialog>
    </>,
  )
  const ids = Array.from(container.querySelectorAll('dialog')).map((d) => d.getAttribute('aria-labelledby'))
  expect(new Set(ids).size).toBe(2)
  for (const id of ids) expect(container.querySelector(`#${CSS.escape(id!)}`)).not.toBeNull()
})
