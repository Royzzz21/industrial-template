import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().trim().min(1, 'Enter a product name'),
  slug: z.string().trim(),
  sku: z.string().trim().min(1, 'Enter a SKU'),
  brand: z.string().trim(),
  categoryId: z.string().min(1, 'Choose a category'),
  shortDescription: z.string().trim().min(1, 'Enter a short description'),
  description: z.string().trim(),
  images: z.array(z.object({ url: z.string().trim() })),
  specs: z.array(z.object({ label: z.string().trim(), value: z.string().trim() })),
  stock: z.enum(['in_stock', 'on_order', 'enquire']),
  priceLabel: z.string().trim(),
  datasheetUrl: z.string().trim(),
  featured: z.boolean(),
})

export type ProductFormValues = z.infer<typeof productSchema>
