export type StockStatus = 'in_stock' | 'on_order' | 'enquire'

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string
  sortOrder: number
}

export interface Spec {
  label: string
  value: string
}

export interface Product {
  id: string
  name: string
  slug: string
  sku: string
  brand: string
  categoryId: string
  shortDescription: string
  description: string
  images: string[]
  specs: Spec[]
  stock: StockStatus
  priceLabel?: string
  datasheetUrl?: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface Slide {
  id: string
  headline: string
  text: string
  buttonLabel: string
  buttonHref: string
  imageUrl: string
  enabled: boolean
  sortOrder: number
}

export interface QuoteItem {
  productId: string
  quantity: number
}

export interface EnquiryItem {
  productId: string
  name: string
  sku: string
  quantity: number
}

export type EnquiryStatus = 'new' | 'handled'

export interface Enquiry {
  id: string
  reference: string
  createdAt: string
  status: EnquiryStatus
  name: string
  company: string
  email: string
  phone: string
  message: string
  items: EnquiryItem[]
}

export interface SocialLink {
  label: string
  url: string
}

export interface Stat {
  label: string
  value: string
}

export interface Settings {
  company: {
    name: string
    tagline: string
    logoText: string
    email: string
    phone: string
    address: string
    hours: string
    social: SocialLink[]
  }
  about: {
    intro: string[]
    stats: Stat[]
    certifications: string[]
    images: string[]
  }
  admin: {
    email: string
    password: string
  }
}

export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  company: string
}
