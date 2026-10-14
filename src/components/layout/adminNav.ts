import { Database, FolderTree, Images, Inbox, LayoutDashboard, Package, Settings } from 'lucide-react'

export const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/slides', label: 'Carousel slides', icon: Images },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/data', label: 'Data', icon: Database },
]
