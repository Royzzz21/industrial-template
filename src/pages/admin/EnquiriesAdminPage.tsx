import { useState } from 'react'
import type { Enquiry } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Table, Td, Th } from '@/components/ui/Table'
import { useToast } from '@/components/ui/Toast'
import { AdminPage } from '@/components/layout/AdminPage'
import { EnquiryDrawer } from '@/features/admin/EnquiryDrawer'
import { formatDateTime } from '@/lib/format'
import { useEnquiriesStore } from '@/stores'

export function EnquiriesAdminPage() {
  const enquiries = useEnquiriesStore((s) => s.enquiries)
  const setStatus = useEnquiriesStore((s) => s.setStatus)
  const remove = useEnquiriesStore((s) => s.remove)
  const [openId, setOpenId] = useState<string | null>(null)
  const toast = useToast()
  const open = enquiries.find((e) => e.id === openId) ?? null

  const onToggle = (e: Enquiry) => setStatus(e.id, e.status === 'new' ? 'handled' : 'new')
  const onDelete = (e: Enquiry) => {
    remove(e.id)
    setOpenId(null)
    toast.show({ title: 'Enquiry deleted', description: e.reference, tone: 'success' })
  }

  return (
    <AdminPage title="Enquiries" lead="Quote requests submitted through the contact page.">
      {enquiries.length === 0 ? (
        <EmptyState title="No enquiries yet" description="Submit the quote form on the public site and it will appear here." />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Reference</Th>
              <Th>Date</Th>
              <Th>Name</Th>
              <Th>Company</Th>
              <Th>Lines</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((e) => (
              <tr key={e.id} className="cursor-pointer hover:bg-steel-50/60" onClick={() => setOpenId(e.id)}>
                <Td>
                  <button type="button" onClick={() => setOpenId(e.id)} className="font-mono text-xs text-steel underline-offset-2 hover:underline">
                    {e.reference}
                  </button>
                </Td>
                <Td className="whitespace-nowrap text-steel-500">{formatDateTime(e.createdAt)}</Td>
                <Td className="font-medium text-steel">{e.name}</Td>
                <Td>{e.company}</Td>
                <Td>{e.items.length}</Td>
                <Td>
                  <Badge tone={e.status === 'new' ? 'accent' : 'neutral'}>{e.status === 'new' ? 'New' : 'Handled'}</Badge>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <EnquiryDrawer enquiry={open} onClose={() => setOpenId(null)} onToggleStatus={onToggle} onDelete={onDelete} />
    </AdminPage>
  )
}
