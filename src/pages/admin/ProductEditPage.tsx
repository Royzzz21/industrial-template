import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toast'
import { AdminPage } from '@/components/layout/AdminPage'
import { ProductForm } from '@/features/admin/ProductForm'
import { useProductsStore } from '@/stores'

export function ProductEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const product = useProductsStore((s) => s.products.find((p) => p.id === id))
  const isNew = id === undefined

  if (!isNew && !product) {
    return (
      <AdminPage title="Product not found">
        <EmptyState title="This product does not exist" action={<Button to="/admin/products">Back to products</Button>} />
      </AdminPage>
    )
  }

  return (
    <AdminPage
      title={isNew ? 'New product' : product!.name}
      lead={isNew ? 'Fill in the details and save to publish it on the site.' : `SKU ${product!.sku}`}
      action={
        !isNew && (
          <Button to={`/products/${product!.slug}`} variant="outline" size="sm">
            View on site
          </Button>
        )
      }
    >
      <ProductForm
        key={product?.id ?? 'new'}
        product={product}
        onCancel={() => navigate('/admin/products')}
        onSaved={(saved) => {
          toast.show({ title: isNew ? 'Product created' : 'Product saved', description: saved.name, tone: 'success' })
          navigate('/admin/products')
        }}
      />
    </AdminPage>
  )
}
