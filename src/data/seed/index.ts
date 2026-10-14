import type { Category, Product, Settings, Slide, Testimonial } from '@/types'
import categoriesJson from './categories.json'
import productsJson from './products.json'
import settingsJson from './settings.json'
import slidesJson from './slides.json'
import testimonialsJson from './testimonials.json'

export const seed = {
  categories: categoriesJson as Category[],
  products: productsJson as Product[],
  slides: slidesJson as Slide[],
  settings: settingsJson as Settings,
  testimonials: testimonialsJson as Testimonial[],
}
