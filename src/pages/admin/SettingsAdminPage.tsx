import { AdminPage } from '@/components/layout/AdminPage'
import { SettingsForm } from '@/features/admin/SettingsForm'
import { useSettingsStore } from '@/stores'

export function SettingsAdminPage() {
  const updatedKey = useSettingsStore((s) => s.settings.company.name + s.settings.admin.email)
  return (
    <AdminPage title="Settings" lead="Company details, About page content and the admin login.">
      <SettingsForm key={updatedKey} />
    </AdminPage>
  )
}
