# Industrial Products Website Template — Design Spec

Date: 2026-10-14
Status: approved in chat, pending written review
Location: `/Users/gerold/Projects/GT/template website`

## 1. Purpose

A reusable, customizable website template for industrial equipment suppliers,
built from the single-file "Northline" sample. It will be shown to Matt (client
reviewer) and later adapted per client. Two audiences:

- **Site visitors** (plant managers, procurement, contractors) who browse
  products and request quotations.
- **Site owners** (the client) who customize products, categories, carousel
  slides, company details and read incoming enquiries through an admin CMS,
  without touching code.

Success criteria:

1. Looks like a real supplier's business site: real photos, realistic product
   data, coherent brand.
2. Fully responsive from 360px phones to 1440px+ desktops.
3. Everything a client would change is editable in `/admin` or in one seed file.
4. Runs as static files (no server). `npm run build` output deploys anywhere.
5. Clean, conventional React + Vite + Tailwind codebase a developer can extend.

## 2. Scope

### In scope

- Public pages: Home, Products, Product detail, About, Contact / Request a quote.
- Quote basket ("Add to quote") feeding the contact form.
- Admin CMS: login, dashboard, products, categories, carousel slides, site
  settings, enquiries inbox, data export/import/reset.
- Seed data: 6 categories, 18 products, 4 slides, 3 testimonials, site settings.
- Tests for stores and quote basket; manual responsive check.

### Out of scope (explicitly deferred)

- Real authentication, user roles, password reset.
- Backend/API, database, email sending.
- Payments, cart checkout, pricing engine.
- Multi-language, SEO beyond basic meta tags, analytics.

## 3. Brand and visual design

- **Company (fictional):** Northline Industrial Supply. All company data lives in
  `src/data/seed/settings.json` and is editable in admin → Settings.
- **Palette** (Tailwind theme tokens):
  - `steel` `#14283A` (primary dark, header/footer/hero overlays)
  - `graphite` `#2B3A45` (body text, secondary dark)
  - `concrete` `#EEF1F3` (section backgrounds)
  - `safety` `#F26A1B` (accent: primary buttons, in-stock badges, active states)
  - white `#FFFFFF`
  - Supporting greys generated as `steel-50..900` shades.
- **Type:** Google Fonts. `Barlow Condensed` 600/700 for headlines and display
  numbers; `Barlow` 400/500/600 for body and UI. Headlines sentence case,
  left-aligned. No all-caps eyebrow labels, no single-word colour accents in
  headlines.
- **Layout:** 12-column grid, max content width 1200px, 24px gutters on mobile.
  Text left-aligned throughout. Section rhythm 64px desktop / 40px mobile.
- **The one bold element:** the full-bleed hero carousel. Everything else is
  calm: flat photo cards with a 4px radius, 1px `steel-200` borders, no drop
  shadows except on dialogs and the sticky header.
- **Motion:** only the carousel autoplay and action feedback (menu open,
  basket add confirmation). No scroll-reveal animations. Respects
  `prefers-reduced-motion` (autoplay off, instant slide changes).

## 4. Public site

### 4.1 Layout chrome

- **Header** (sticky): logo text from settings, nav (Home, Products, About,
  Contact), quote basket button with item count, "Request a quote" primary
  button. Mobile: hamburger opens a full-width panel; closes on route change,
  Escape, or outside click.
- **Footer:** company blurb, quick links, product categories, contact details
  and business hours from settings, copyright line, small "Admin" link.

### 4.2 Home `/`

1. **Hero carousel** (Embla Carousel): 4 slides from the slides store.
   Each slide: background photo with steel gradient overlay, headline (Barlow
   Condensed, up to ~60px), supporting line, one button (label + link).
   Controls: prev/next arrows, dot indicators, autoplay 6s, pause on hover and
   focus, swipe on touch, arrow keys when focused, `aria-roledescription=
   "carousel"` with slide labels. Autoplay disabled under reduced motion.
2. **Industries strip:** "Serving manufacturing, construction, mining, utilities,
   agriculture, logistics" as a single row (wraps on mobile).
3. **Category grid:** 6 category cards (photo, name, product count) linking to
   the filtered Products page.
4. **Featured products:** up to 6 products flagged `featured`, same card as the
   Products page.
5. **Capabilities:** 4 items with icons: nationwide delivery, manufacturer
   warranty, technical support, genuine spare parts. Text from a constants file.
6. **How it works:** 4 numbered steps (enquire, quote, deliver, support). This
   content is a real sequence, so numbering is appropriate.
7. **Testimonials:** 3 quotes (name, company, role) from seed data.
8. **CTA band:** "Tell us what your site needs" with button to Contact.

### 4.3 Products `/products`

- Query-string driven filters so links are shareable: `?category=`, `?q=`,
  `?availability=`, `?sort=`.
- Left sidebar (desktop) / collapsible panel (mobile): search, category list
  with counts, availability (in stock, on order, enquire), sort (name, newest,
  featured first).
- Grid: 1 column at <480px, 2 at ≥480px, 3 at ≥1024px.
- **Product card:** photo (4:3), category label, name, SKU, two "key specs"
  (first two spec rows), stock badge, "Add to quote" button, card links to
  detail.
- Empty state: "No products match these filters" with a clear-filters button.

### 4.4 Product detail `/products/:slug`

- Breadcrumb (Home / Products / Category / Product).
- Gallery: main image + thumbnails (products have 1–3 image URLs).
- Name, SKU, brand, category, stock badge, short description.
- Quantity input + "Add to quote" (adds to basket, shows inline confirmation).
- Specifications table (key/value rows).
- Downloads: datasheet placeholder link if `datasheetUrl` set.
- Related products: up to 4 from the same category.
- 404 state if slug unknown.

### 4.5 About `/about`

- Intro paragraphs, 4 stats (years trading, products stocked, delivery regions,
  support hours), two facility photos, certifications list (ISO 9001 etc. as
  placeholders), CTA band. Copy lives in `src/data/seed/settings.json` under
  `about`, editable in admin → Settings.

### 4.6 Contact / Request a quote `/contact`

- Two columns (stack on mobile):
  - **Quote basket:** lines with product name, SKU, quantity stepper, remove;
    empty state with link to Products.
  - **Form** (react-hook-form + zod): name, company, email, phone, message,
    consent checkbox. Validation messages inline. Submit stores an `Enquiry`
    (items + form fields + timestamp) in the enquiries store, clears the basket,
    shows a confirmation panel with a reference number `NL-YYYYMMDD-XXXX`.
- Contact details, business hours, map placeholder image.
- Clear note that the demo does not send email.

## 5. Admin CMS `/admin`

All admin routes are under `/admin` inside an `AdminShell` layout (sidebar nav,
top bar with "View site" and "Log out").

### 5.1 Auth (demo)

- `/admin/login`: email + password checked against `settings.admin`
  (seed: `admin@northline.example` / `northline2026`). Credentials editable in
  Settings. Session flag persisted in the `auth` store. Protected routes
  redirect to login. Clearly labelled "demo authentication — replace with a
  real backend before production".

### 5.2 Dashboard `/admin`

- Cards: products, categories, slides, unread enquiries. Recent enquiries list.

### 5.3 Products `/admin/products`, `/admin/products/new`, `/admin/products/:id`

- Table: thumbnail, name, SKU, category, stock, featured, updated; search box;
  category filter.
- Form fields: name, slug (auto from name, editable, unique), SKU, brand,
  category (select), short description, long description, images (list of
  URLs with an "upload file" option that reads the file to a data URL; max ~1MB
  each with a warning), specifications (key/value rows, add/remove/reorder),
  stock status (`in_stock | on_order | enquire`), price display (optional free
  text, e.g. "From $2,450" or empty = "Price on request"), datasheet URL,
  featured flag.
- Delete with confirmation dialog.

### 5.4 Categories `/admin/categories`

- Table + inline form dialog: name, slug, description, image URL, sort order.
  Delete blocked if products reference the category (shows count).

### 5.5 Slides `/admin/slides`

- List with move up/down ordering, enable/disable toggle, edit dialog:
  headline, text, button label, button link, image URL/upload.

### 5.6 Settings `/admin/settings`

- Company: name, tagline, logo text, email, phone, address, hours, social links.
- About page copy and stats.
- Admin credentials.
- Saved with one "Save changes" button; toast "Settings saved".

### 5.7 Enquiries `/admin/enquiries`

- Table: reference, date, name, company, items count, status (new/handled).
  Detail drawer shows full enquiry. "Mark as handled" toggle. Delete.

### 5.8 Data `/admin/data`

- Export all stores as one JSON file (download).
- Import JSON (validated with zod; replaces stores after confirmation).
- Reset to seed data (confirmation dialog).

## 6. Architecture

### 6.1 Stack

| Concern | Choice |
|---|---|
| Framework | React 18 + TypeScript, Vite 5 |
| Styling | Tailwind CSS 3, `@tailwindcss/forms` |
| Routing | react-router-dom 6 (data-less, `createBrowserRouter`) |
| State | Zustand 4 with `persist` middleware (localStorage) |
| Carousel | embla-carousel-react + autoplay plugin |
| Forms | react-hook-form + zod + @hookform/resolvers |
| Icons | lucide-react |
| Testing | Vitest, @testing-library/react, jsdom |
| Lint/format | ESLint (vite template), Prettier |

### 6.2 Folder structure

```
template website/
  index.html
  package.json  vite.config.ts  tailwind.config.ts  tsconfig.json
  public/            favicon, placeholder images
  docs/              this spec, README customization guide
  src/
    main.tsx
    app/
      App.tsx          RouterProvider + global providers
      router.tsx       route table (public + admin)
      ProtectedRoute.tsx
    components/
      ui/              Button, Badge, Input, Textarea, Select, Checkbox,
                       Dialog, Drawer, Table, Toast, EmptyState, Spinner
      layout/          Header, Footer, MobileNav, Container, Section,
                       PageHeader, AdminShell, AdminSidebar
    features/
      carousel/        HeroCarousel, useCarousel
      products/        ProductCard, ProductGrid, ProductFilters, SpecTable,
                       ImageGallery, StockBadge, useProductFilters
      quote/           QuoteBasketButton, QuoteBasketList, QuoteForm
      admin/           ProductForm, CategoryForm, SlideForm, SettingsForm,
                       SpecsEditor, ImageListEditor, EnquiryDrawer, DataTools
    pages/
      public/          HomePage, ProductsPage, ProductDetailPage, AboutPage,
                       ContactPage, NotFoundPage
      admin/           LoginPage, DashboardPage, ProductsAdminPage,
                       ProductEditPage, CategoriesAdminPage, SlidesAdminPage,
                       SettingsAdminPage, EnquiriesAdminPage, DataAdminPage
    stores/
      useProductsStore.ts   useCategoriesStore.ts  useSlidesStore.ts
      useSettingsStore.ts   useQuoteStore.ts       useEnquiriesStore.ts
      useAuthStore.ts       index.ts (export/import/reset helpers)
    data/seed/
      categories.json  products.json  slides.json  settings.json
      testimonials.json
    lib/
      slugify.ts  format.ts  id.ts  fileToDataUrl.ts  cn.ts
    types/
      index.ts        Product, Category, Slide, Settings, QuoteItem, Enquiry
    styles/
      index.css       Tailwind layers + font imports
```

### 6.3 Data model (TypeScript)

```ts
type StockStatus = 'in_stock' | 'on_order' | 'enquire';

interface Category { id: string; name: string; slug: string; description: string;
  imageUrl: string; sortOrder: number; }

interface Spec { label: string; value: string; }

interface Product { id: string; name: string; slug: string; sku: string; brand: string;
  categoryId: string; shortDescription: string; description: string;
  images: string[]; specs: Spec[]; stock: StockStatus; priceLabel?: string;
  datasheetUrl?: string; featured: boolean; createdAt: string; updatedAt: string; }

interface Slide { id: string; headline: string; text: string; buttonLabel: string;
  buttonHref: string; imageUrl: string; enabled: boolean; sortOrder: number; }

interface QuoteItem { productId: string; quantity: number; }

interface Enquiry { id: string; reference: string; createdAt: string;
  status: 'new' | 'handled'; name: string; company: string; email: string;
  phone: string; message: string; items: { productId: string; name: string;
  sku: string; quantity: number }[]; }

interface Settings { company: { name; tagline; logoText; email; phone; address;
  hours; social: { label; url }[] }; about: { intro: string[]; stats: { label;
  value }[]; certifications: string[]; images: string[] };
  admin: { email; password }; }
```

### 6.4 Stores

Each domain has one Zustand store with `persist` (key `northline:<domain>`,
version 1). Stores hydrate from seed JSON when storage is empty. Each store
exposes typed actions (`add`, `update`, `remove`, `reorder`, `reset`). Enquiry
items snapshot product name and SKU so history survives product edits.
`stores/index.ts` provides `exportAll()`, `importAll(json)` (zod-validated) and
`resetAll()`.

Derived data (filtered products, category counts, basket totals) is computed
with selectors/hooks, not stored.

### 6.5 Images

- Seed data uses Unsplash photo URLs with `?auto=format&fit=crop&w=1200&q=70`.
- Admin uploads convert files to data URLs via `fileToDataUrl`; warn above 1MB
  because localStorage is ~5MB total.
- All `<img>` have `alt`, `loading="lazy"` below the fold, fixed aspect boxes
  to avoid layout shift.

### 6.6 Error handling

- Unknown routes → NotFoundPage; unknown product slug → inline not-found.
- Import JSON failing validation → error list shown, nothing replaced.
- localStorage quota exceeded on save → toast "Storage full. Remove large
  uploaded images or export and reset data." Store state remains in memory.
- Form errors inline, in plain language, next to the field.

## 7. Testing

- **Unit (Vitest):** slugify, id/reference generation, each store's CRUD +
  reset, quote store add/increment/remove, `importAll` rejects bad JSON,
  product filter hook (category/search/availability/sort).
- **Component:** ProductCard renders specs and badge; QuoteForm shows
  validation errors and submits an enquiry; HeroCarousel renders slides and
  dot count.
- **Manual:** Chrome at 375, 768, 1280 widths; keyboard pass through header,
  carousel, filters, forms; Lighthouse accessibility ≥ 95 on Home.

## 8. Deliverables

1. Working app in `template website/` with `npm run dev`, `npm run build`,
   `npm test`.
2. `README.md` with setup, customization guide (settings, seed data, colours,
   fonts), admin demo credentials, and deployment notes (static hosting).
3. This spec and the implementation plan under `docs/superpowers/`.
