import { useRef, useState } from 'react'
import { Download, RotateCcw, Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { useToast } from '@/components/ui/Toast'
import { exportAll, importAll, resetAll } from '@/stores'

export function DataTools() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [confirmReset, setConfirmReset] = useState(false)
  const toast = useToast()

  const onExport = () => {
    const blob = new Blob([exportAll()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `northline-data-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    toast.show({ title: 'Export downloaded', tone: 'success' })
  }

  const onImport = async (file?: File) => {
    if (!file) return
    const text = await file.text()
    const result = importAll(text)
    if (result.ok) {
      setErrors([])
      toast.show({ title: 'Data imported', description: file.name, tone: 'success' })
    } else {
      setErrors(result.errors)
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const onReset = () => {
    resetAll()
    setConfirmReset(false)
    setErrors([])
    toast.show({ title: 'Seed data restored', tone: 'success' })
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <section className="rounded border border-steel-200 bg-white p-5">
        <Download className="h-6 w-6 text-steel" aria-hidden="true" />
        <h2 className="mt-3 text-2xl">Export</h2>
        <p className="mt-1 text-sm text-steel-500">Download products, categories, slides, settings and enquiries as one JSON file. Use it as a backup or to move data to another browser.</p>
        <Button className="mt-4" variant="outline" onClick={onExport}>
          Download JSON
        </Button>
      </section>

      <section className="rounded border border-steel-200 bg-white p-5">
        <Upload className="h-6 w-6 text-steel" aria-hidden="true" />
        <h2 className="mt-3 text-2xl">Import</h2>
        <p className="mt-1 text-sm text-steel-500">Replace everything with a file exported from this admin. The file is checked before anything changes.</p>
        <label className="mt-4 block">
          <span className="sr-only">Import JSON file</span>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            aria-label="Import JSON file"
            onChange={(e) => onImport(e.target.files?.[0])}
            className="block w-full text-sm text-steel-600 file:mr-3 file:rounded file:border file:border-steel-300 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium file:text-steel hover:file:bg-steel-50"
          />
        </label>
        {errors.length > 0 && (
          <div role="alert" className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <p className="font-semibold">The file was not imported.</p>
            <ul className="mt-1 list-inside list-disc space-y-0.5 text-xs">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="rounded border border-steel-200 bg-white p-5">
        <RotateCcw className="h-6 w-6 text-steel" aria-hidden="true" />
        <h2 className="mt-3 text-2xl">Reset</h2>
        <p className="mt-1 text-sm text-steel-500">Discard every change made in this browser and restore the demo catalogue. Enquiries are removed too.</p>
        <Button className="mt-4" variant="danger" onClick={() => setConfirmReset(true)}>
          Reset to seed data
        </Button>
      </section>

      <Dialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset all data"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onReset}>
              Reset
            </Button>
          </>
        }
      >
        <p className="text-sm">All products, categories, slides, settings and enquiries in this browser will be replaced with the demo data. Export first if you want to keep them.</p>
      </Dialog>
    </div>
  )
}
