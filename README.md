# Industrial products website template

A customizable website template for industrial equipment suppliers, with a built-in
admin CMS. Built with React 19, Vite, TypeScript, Tailwind CSS and Zustand. No backend:
all content lives in seed JSON files and, once edited in the admin, in the browser's
local storage.

Demo company: **Northline Industrial Supply** (fictional).

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest unit and component tests
npm run build      # static output in dist/
npm run preview    # serve the build locally
```

## What is included

Public site

- Home with a full-bleed hero carousel, category grid, featured products,
  capabilities, process steps, testimonials and a call to action
- Products listing with search, category and availability filters and sorting,
  all reflected in the URL so links are shareable
- Product detail with gallery, specifications table, datasheet link and related products
- Quote basket: "Add to quote" from any card or detail page, quantities editable on the
  contact page, submitted as an enquiry with a reference number
- About and Contact pages driven by site settings

Admin at `/admin`

- Demo login is seeded in `src/data/seed/settings.json` (change it there or in Admin → Settings)
- Dashboard, Products (create, edit, delete, image upload, specs editor),
  Categories, Carousel slides (reorder, enable), Enquiries inbox, Site settings,
  and Data tools (export JSON, import JSON, reset to seed)

## Customizing

See [docs/CUSTOMIZING.md](docs/CUSTOMIZING.md) for company details, seed data,
colours, fonts and deployment. Image sources and licences are listed in
[docs/IMAGE-CREDITS.md](docs/IMAGE-CREDITS.md).

## Project structure

```
src/
  app/          router, protected route, App
  components/   ui primitives (Button, Dialog, Table, Toast…) and layout (Header, Footer, AdminShell)
  features/     carousel, products, quote, home sections, admin forms
  pages/        public/ and admin/ route components
  stores/       one Zustand store per domain, persisted to localStorage
  data/seed/    categories, products, slides, settings, testimonials
  lib/          slugify, ids, formatting, file helpers
  types/        domain types
docs/           design spec, implementation plan, screenshots, customization guide
```

## Before going live

This template is frontend-only by design. Before using it for a real business:

1. Replace the demo authentication with a real backend or hosted auth.
2. Connect the quote form to an email or CRM service.
3. Replace the Wikimedia Commons placeholder photos with the client's own.
4. Move product data to a database or headless CMS if more than one person edits it.
