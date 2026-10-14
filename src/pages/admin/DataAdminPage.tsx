import { AdminPage } from '@/components/layout/AdminPage'
import { DataTools } from '@/features/admin/DataTools'

export function DataAdminPage() {
  return (
    <AdminPage title="Data" lead="This demo keeps everything in the browser's local storage. Export, import or reset it here.">
      <DataTools />
    </AdminPage>
  )
}
