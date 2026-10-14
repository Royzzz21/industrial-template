import type { Enquiry } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { formatDateTime } from '@/lib/format'

interface Props {
  enquiry: Enquiry | null
  onClose: () => void
  onToggleStatus: (e: Enquiry) => void
  onDelete: (e: Enquiry) => void
}

export function EnquiryDrawer({ enquiry, onClose, onToggleStatus, onDelete }: Props) {
  return (
    <Drawer open={enquiry !== null} onClose={onClose} title={enquiry?.reference ?? 'Enquiry'}>
      {enquiry && (
        <div className="space-y-5 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={enquiry.status === 'new' ? 'accent' : 'neutral'}>{enquiry.status === 'new' ? 'New' : 'Handled'}</Badge>
            <span className="text-steel-500">{formatDateTime(enquiry.createdAt)}</span>
          </div>
          <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1">
            <dt className="text-steel-500">Name</dt>
            <dd className="font-medium text-steel">{enquiry.name}</dd>
            <dt className="text-steel-500">Company</dt>
            <dd>{enquiry.company}</dd>
            <dt className="text-steel-500">Email</dt>
            <dd>
              <a href={`mailto:${enquiry.email}`} className="text-steel underline-offset-2 hover:underline">
                {enquiry.email}
              </a>
            </dd>
            <dt className="text-steel-500">Phone</dt>
            <dd>
              <a href={`tel:${enquiry.phone}`} className="text-steel underline-offset-2 hover:underline">
                {enquiry.phone}
              </a>
            </dd>
          </dl>
          <div>
            <h3 className="text-lg">Message</h3>
            <p className="mt-1 whitespace-pre-line rounded border border-steel-200 bg-concrete p-3">{enquiry.message}</p>
          </div>
          <div>
            <h3 className="text-lg">Products requested</h3>
            {enquiry.items.length === 0 ? (
              <p className="mt-1 text-steel-500">No products attached.</p>
            ) : (
              <table className="mt-1 w-full">
                <thead>
                  <tr className="text-left text-xs text-steel-500">
                    <th className="py-1 font-medium">Product</th>
                    <th className="py-1 font-medium">SKU</th>
                    <th className="py-1 text-right font-medium">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiry.items.map((i) => (
                    <tr key={i.productId} className="border-t border-steel-100">
                      <td className="py-1.5 pr-2">{i.name}</td>
                      <td className="py-1.5 pr-2 text-steel-500">{i.sku}</td>
                      <td className="py-1.5 text-right">{i.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex flex-wrap gap-2 border-t border-steel-100 pt-4">
            <Button variant="outline" onClick={() => onToggleStatus(enquiry)}>
              {enquiry.status === 'new' ? 'Mark as handled' : 'Mark as new'}
            </Button>
            <Button variant="danger" onClick={() => onDelete(enquiry)}>
              Delete
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  )
}
