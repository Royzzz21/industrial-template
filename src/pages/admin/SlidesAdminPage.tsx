import { useState } from 'react'
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react'
import type { Slide } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { useToast } from '@/components/ui/Toast'
import { AdminPage } from '@/components/layout/AdminPage'
import { SlideForm } from '@/features/admin/SlideForm'
import { useSlidesStore } from '@/stores'

type Modal = { kind: 'closed' } | { kind: 'edit'; slide?: Slide } | { kind: 'delete'; slide: Slide }

export function SlidesAdminPage() {
  const slides = useSlidesStore((s) => s.slides)
  const move = useSlidesStore((s) => s.move)
  const update = useSlidesStore((s) => s.update)
  const remove = useSlidesStore((s) => s.remove)
  const [modal, setModal] = useState<Modal>({ kind: 'closed' })
  const toast = useToast()
  const close = () => setModal({ kind: 'closed' })

  return (
    <AdminPage
      title="Carousel slides"
      lead="Slides play on the home page in this order. Disabled slides stay here but are not shown."
      action={
        <Button onClick={() => setModal({ kind: 'edit' })}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          New slide
        </Button>
      }
    >
      <ol className="space-y-3">
        {slides.map((s, i) => (
          <li key={s.id} className="flex flex-col gap-3 rounded border border-steel-200 bg-white p-3 sm:flex-row sm:items-center">
            <span className="h-20 w-full shrink-0 overflow-hidden rounded bg-steel-100 sm:w-32">
              <img src={s.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display text-lg font-semibold text-steel">{s.headline}</span>
                <Badge tone={s.enabled ? 'success' : 'neutral'}>{s.enabled ? 'Shown' : 'Hidden'}</Badge>
              </div>
              <p className="mt-1 truncate text-sm text-steel-500">{s.text}</p>
              <p className="mt-1 text-xs text-steel-400">
                Button: {s.buttonLabel || '—'} → {s.buttonHref || '—'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" aria-label={`Move ${s.headline} up`} disabled={i === 0} onClick={() => move(s.id, -1)} className="grid h-9 w-9 place-items-center rounded text-steel-500 hover:bg-steel-100 disabled:opacity-30">
                <ArrowUp className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" aria-label={`Move ${s.headline} down`} disabled={i === slides.length - 1} onClick={() => move(s.id, 1)} className="grid h-9 w-9 place-items-center rounded text-steel-500 hover:bg-steel-100 disabled:opacity-30">
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </button>
              <label className="ml-2 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={s.enabled} onChange={(e) => update(s.id, { enabled: e.target.checked })} className="rounded border-steel-300 text-safety focus:ring-safety" />
                Enabled
              </label>
              <button type="button" aria-label={`Edit ${s.headline}`} onClick={() => setModal({ kind: 'edit', slide: s })} className="ml-2 grid h-9 w-9 place-items-center rounded text-steel-500 hover:bg-steel-100 hover:text-steel">
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" aria-label={`Delete ${s.headline}`} onClick={() => setModal({ kind: 'delete', slide: s })} className="grid h-9 w-9 place-items-center rounded text-steel-500 hover:bg-red-50 hover:text-red-700">
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ol>

      <Dialog open={modal.kind === 'edit'} onClose={close} title={modal.kind === 'edit' && modal.slide ? 'Edit slide' : 'New slide'}>
        {modal.kind === 'edit' && (
          <SlideForm
            key={modal.slide?.id ?? 'new'}
            slide={modal.slide}
            onCancel={close}
            onSaved={() => {
              toast.show({ title: 'Slide saved', tone: 'success' })
              close()
            }}
          />
        )}
      </Dialog>
      <Dialog
        open={modal.kind === 'delete'}
        onClose={close}
        title="Delete slide"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (modal.kind === 'delete') remove(modal.slide.id)
                toast.show({ title: 'Slide deleted', tone: 'success' })
                close()
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        {modal.kind === 'delete' && (
          <p className="text-sm">
            Delete the slide <strong>{modal.slide.headline}</strong>?
          </p>
        )}
      </Dialog>
    </AdminPage>
  )
}
