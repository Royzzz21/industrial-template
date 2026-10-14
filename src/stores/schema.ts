import { z } from 'zod'

const stock = z.enum(['in_stock', 'on_order', 'enquire'])

export const categorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  imageUrl: z.string(),
  sortOrder: z.number(),
})

export const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  sku: z.string().min(1),
  brand: z.string(),
  categoryId: z.string().min(1),
  shortDescription: z.string(),
  description: z.string(),
  images: z.array(z.string()),
  specs: z.array(z.object({ label: z.string(), value: z.string() })),
  stock,
  priceLabel: z.string().optional(),
  datasheetUrl: z.string().optional(),
  featured: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const slideSchema = z.object({
  id: z.string().min(1),
  headline: z.string().min(1),
  text: z.string(),
  buttonLabel: z.string(),
  buttonHref: z.string(),
  imageUrl: z.string(),
  enabled: z.boolean(),
  sortOrder: z.number(),
})

export const settingsSchema = z.object({
  company: z.object({
    name: z.string().min(1),
    tagline: z.string(),
    logoText: z.string().min(1),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    hours: z.string(),
    social: z.array(z.object({ label: z.string(), url: z.string() })),
  }),
  about: z.object({
    intro: z.array(z.string()),
    stats: z.array(z.object({ label: z.string(), value: z.string() })),
    certifications: z.array(z.string()),
    images: z.array(z.string()),
  }),
  admin: z.object({ email: z.string().min(1), password: z.string().min(1) }),
})

export const enquirySchema = z.object({
  id: z.string().min(1),
  reference: z.string(),
  createdAt: z.string(),
  status: z.enum(['new', 'handled']),
  name: z.string(),
  company: z.string(),
  email: z.string(),
  phone: z.string(),
  message: z.string(),
  items: z.array(
    z.object({ productId: z.string(), name: z.string(), sku: z.string(), quantity: z.number() }),
  ),
})

export const exportSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  categories: z.array(categorySchema),
  products: z.array(productSchema),
  slides: z.array(slideSchema),
  settings: settingsSchema,
  enquiries: z.array(enquirySchema),
})

export type ExportFile = z.infer<typeof exportSchema>
