import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import type { Category } from '@/types'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Table, Td, Th } from '@/components/ui/Table'
import { useToast } from '@/components/ui/Toast'
import { AdminPage } from '@/components/layout/AdminPage'
import { CategoryForm } from '@/features/admin/CategoryForm'
import { useCategoriesStore, useProductsStore } from '@/stores'

type Modal = { kind: 'closed' } | { kind: 'edit'; category?: Category } | { kind: 'delete'; category: Category; reason?: string }

export function CategoriesAdminPage() {
  const categories = useCategoriesStore((s) => s.categories)
  const remove = useCategoriesStore((s) => s.remove)
  const products = useProductsStore((s) => s.products)
  const [modal, setModal] = useState<Modal>({ kind: 'closed' })
  const toast = useToast()

  const countFor = (id: string) => products.filter((p) => p.categoryId === id).length
  const close = () => setModal({ kind: 'closed' })

  const onDelete = () => {
    if (modal.kind !== 'delete') return
    const r = remove(modal.category.id)
    if (r.ok) {
      toast.show({ title: 'Category deleted', description: modal.category.name, tone: 'success' })
      close()
    } else {
      setModal({ ...modal, reason: r.reason })
    }
  }

  return (
    <AdminPage
      title="Categories"
      lead="Categories group products on the site and in the product filters."
      action={
        <Button onClick={() => setModal({ kind: 'edit' })}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          New category
        </Button>
      }
    >
      <Table>
        <thead>
          <tr>
            <Th>Category</Th>
            <Th>Slug</Th>
            <Th>Products</Th>
            <Th>Order</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="hover:bg-steel-50/60">
              <Td>
                <div className="flex items-center gap-3">
                  <span className="h-10 w-14 shrink-0 overflow-hidden rounded bg-steel-100">{c.imageUrl && <img src={c.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />}</span>
                  <span className="font-medium text-steel">{c.name}</span>
                </div>
              </Td>
              <Td className="text-steel-500">{c.slug}</Td>
              <Td>{countFor(c.id)}</Td>
              <Td>{c.sortOrder}</Td>
              <Td className="text-right">
                <div className="inline-flex gap-1">
                  <button type="button" aria-label={`Edit ${c.name}`} onClick={() => setModal({ kind: 'edit', category: c })} className="grid h-8 w-8 place-items-center rounded text-steel-500 hover:bg-steel-100 hover:text-steel">
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button type="button" aria-label={`Delete ${c.name}`} onClick={() => {
                      const n = countFor(c.id)
                      setModal({ kind: 'delete', category: c, reason: n > 0 ? `${n} product${n === 1 ? '' : 's'} use this category` : undefined })
                    }} className="grid h-8 w-8 place-items-center rounded text-steel-500 hover:bg-red-50 hover:text-red-700">
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Dialog open={modal.kind === 'edit'} onClose={close} title={modal.kind === 'edit' && modal.category ? 'Edit category' : 'New category'}>
        {modal.kind === 'edit' && (
          <CategoryForm
            key={modal.category?.id ?? 'new'}
            category={modal.category}
            onCancel={close}
            onSaved={() => {
              toast.show({ title: 'Category saved', tone: 'success' })
              close()
            }}
          />
        )}
      </Dialog>

      <Dialog
        open={modal.kind === 'delete'}
        onClose={close}
        title="Delete category"
        size="sm"
        footer={
          modal.kind === 'delete' && modal.reason ? (
            <Button variant="ghost" onClick={close}>
              Close
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={close}>
                Cancel
              </Button>
              <Button variant="danger" onClick={onDelete}>
                Delete
              </Button>
            </>
          )
        }
      >
        {modal.kind === 'delete' &&
          (modal.reason ? (
            <p role="alert" className="text-sm">
              Cannot delete <strong>{modal.category.name}</strong>: {modal.reason}. Move or delete those products first.
            </p>
          ) : (
            <p className="text-sm">
              Delete <strong>{modal.category.name}</strong>? Products will keep their category until reassigned.
            </p>
          ))}
      </Dialog>
    </AdminPage>
  )
}
