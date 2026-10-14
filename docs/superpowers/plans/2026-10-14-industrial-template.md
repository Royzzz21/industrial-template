# Industrial Products Website Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive React + Vite + Tailwind industrial-products website template with a frontend-only admin CMS (Zustand + localStorage) seeded with realistic data.

**Architecture:** Single Vite SPA. Domain data (categories, products, slides, settings, enquiries, quote basket, auth) lives in one Zustand store per domain, each persisted to localStorage and hydrated from seed JSON. Public pages read stores through selector hooks; admin pages call store actions through forms built with react-hook-form + zod. No backend.

**Tech Stack:** React 18, TypeScript, Vite 5, Tailwind 3, react-router-dom 6, Zustand 4, embla-carousel-react, react-hook-form, zod, lucide-react, Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-14-industrial-template-design.md`

## Global Constraints

- Node 24 / npm 11 on the dev machine; project must run with `npm install && npm run dev`.
- Package name `industrial-template`; app title from settings (seed "Northline Industrial Supply").
- Tailwind tokens: `steel #14283A`, `graphite #2B3A45`, `concrete #EEF1F3`, `safety #F26A1B`.
- Fonts: Barlow Condensed (600/700) for headings, Barlow (400/500/600) for body, via Google Fonts link in `index.html`.
- Headlines sentence case, left-aligned. No all-caps eyebrow labels. No scroll-reveal animations.
- localStorage keys `northline:<domain>`, version 1.
- Admin demo credentials seeded as `admin@northline.example` / `northline2026`.
- Every `<img>` has `alt`; below-the-fold images use `loading="lazy"`.
- All interactive elements keyboard reachable with visible focus (`focus-visible:ring-2 ring-safety`).
- Carousel autoplay off when `prefers-reduced-motion: reduce`.

## Review Focus

1. Product slug collision on create/edit (two products named the same) → slug must be de-duplicated (`-2`, `-3`) and the form must not save a duplicate. Test in Task 4.
2. Deleting a category that products still reference → must be refused with a count. Test in Task 4.
3. Quote basket quantity set to 0 or a non-number → treated as remove / clamped to 1..999. Test in Task 4.
4. Importing a JSON file with a wrong shape or missing store → rejected with messages, existing data untouched. Test in Task 4.
5. Filters in the URL that reference a category slug that no longer exists → page shows the empty state with a clear-filters button rather than crashing. Test in Task 7.

---

### Task 1: Project scaffold, Tailwind, fonts, test runner

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `tailwind.config.ts`, `postcss.config.js`, `index.html`, `src/main.tsx`, `src/app/App.tsx`, `src/styles/index.css`, `src/test/setup.ts`, `.gitignore`, `.prettierrc`
- Test: `src/lib/cn.test.ts`

- [ ] **Step 1: Scaffold with Vite**

```bash
cd "/Users/gerold/Projects/GT/template website"
npm create vite@latest . -- --template react-ts   # answer "Ignore files and continue" if prompted
npm install
npm install react-router-dom zustand embla-carousel-react embla-carousel-autoplay react-hook-form zod @hookform/resolvers lucide-react clsx tailwind-merge
npm install -D tailwindcss@3 postcss autoprefixer @tailwindcss/forms vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event prettier
npx tailwindcss init -p --ts
```

- [ ] **Step 2: Configure Tailwind theme**

`tailwind.config.ts`:
```ts
import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        steel: { DEFAULT: '#14283A', 50: '#F3F5F7', 100: '#E3E8EC', 200: '#C5CED6', 300: '#9BAAB7', 400: '#6B7F91', 500: '#44596C', 600: '#2E4256', 700: '#213447', 800: '#14283A', 900: '#0C1A27' },
        graphite: '#2B3A45',
        concrete: '#EEF1F3',
        safety: { DEFAULT: '#F26A1B', 600: '#D9560E', 100: '#FDE6D8' },
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'Arial Narrow', 'sans-serif'],
        sans: ['Barlow', 'Arial', 'sans-serif'],
      },
      maxWidth: { content: '1200px' },
    },
  },
  plugins: [forms],
} satisfies Config
```

- [ ] **Step 3: index.html, CSS, test setup**

`index.html` head: charset, viewport, `<title>Northline Industrial Supply</title>`, Google Fonts link for `Barlow:wght@400;500;600&family=Barlow+Condensed:wght@600;700`, `<div id="root">`.

`src/styles/index.css`:
```css
@tailwind base; @tailwind components; @tailwind utilities;
@layer base { html { @apply scroll-smooth; } body { @apply font-sans text-graphite bg-white antialiased; } h1,h2,h3,h4 { @apply font-display text-steel; } }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
```

`vite.config.ts` adds `test: { environment: 'jsdom', setupFiles: './src/test/setup.ts', globals: true }` (use `/// <reference types="vitest" />`). `src/test/setup.ts` imports `@testing-library/jest-dom/vitest`.

`src/lib/cn.ts`: `export const cn = (...i: ClassValue[]) => twMerge(clsx(i))`.

- [ ] **Step 4: Smoke test**

`src/lib/cn.test.ts`:
```ts
import { cn } from './cn'
test('merges tailwind classes', () => { expect(cn('p-2', 'p-4')).toBe('p-4') })
```
Run `npx vitest run` → PASS. Run `npm run build` → succeeds.

- [ ] **Step 5: Commit** `chore: scaffold vite react ts tailwind`

---

### Task 2: Domain types and seed data

**Files:**
- Create: `src/types/index.ts`, `src/data/seed/categories.json`, `src/data/seed/products.json`, `src/data/seed/slides.json`, `src/data/seed/settings.json`, `src/data/seed/testimonials.json`, `src/data/seed/index.ts`
- Test: `src/data/seed/seed.test.ts`

**Produces:** types exactly as in spec §6.3 plus `Testimonial { id; quote; name; role; company }`; `seed` object `{ categories, products, slides, settings, testimonials }`.

- [ ] **Step 1: Write the failing test**

```ts
import { seed } from './index'
test('seed integrity', () => {
  expect(seed.categories).toHaveLength(6)
  expect(seed.products.length).toBeGreaterThanOrEqual(18)
  const catIds = new Set(seed.categories.map(c => c.id))
  for (const p of seed.products) expect(catIds.has(p.categoryId)).toBe(true)
  expect(new Set(seed.products.map(p => p.slug)).size).toBe(seed.products.length)
  expect(seed.slides.filter(s => s.enabled).length).toBeGreaterThanOrEqual(3)
  expect(seed.products.filter(p => p.featured).length).toBeGreaterThanOrEqual(6)
})
```

- [ ] **Step 2: Run** → FAIL (module missing)

- [ ] **Step 3: Write types and seed data**

Categories: Generators, Air compressors, Pumps & motors, Welding equipment, Material handling, Power tools. Each with Unsplash photo.
Products: 3 per category, realistic names (e.g. "Northline NG-65 diesel generator 65 kVA", "Atlas Copco GA 15 rotary screw compressor"), SKUs like `GEN-NG65`, 4–7 specs, 1–3 images, mix of stock states, 6 featured, `priceLabel` on some.
Slides: 4 (generators, compressors, forklifts, welding) with headline ≤ 8 words, text ≤ 20 words, button to `/products?category=...`.
Settings: company, about (3 paragraphs, 4 stats, 4 certifications, 2 images), admin credentials.
Testimonials: 3.

`src/data/seed/index.ts` re-exports typed JSON (`as Product[]` etc.).

- [ ] **Step 4: Run** → PASS
- [ ] **Step 5: Commit** `feat: domain types and seed data`

---

### Task 3: Utility library

**Files:**
- Create: `src/lib/slugify.ts`, `src/lib/id.ts`, `src/lib/format.ts`, `src/lib/fileToDataUrl.ts`
- Test: `src/lib/lib.test.ts`

**Produces:** `slugify(s): string`, `uniqueSlug(base, taken: string[]): string`, `newId(prefix): string`, `newReference(date?: Date): string` ("NL-YYYYMMDD-XXXX"), `formatDate(iso): string`, `stockLabel(s: StockStatus): string`, `fileToDataUrl(file): Promise<string>`.

- [ ] **Step 1: Tests**

```ts
test('slugify', () => expect(slugify('Atlas Copco GA 15 / Rotary!')).toBe('atlas-copco-ga-15-rotary'))
test('uniqueSlug', () => expect(uniqueSlug('ng-65', ['ng-65', 'ng-65-2'])).toBe('ng-65-3'))
test('reference', () => expect(newReference(new Date('2026-10-14'))).toMatch(/^NL-20261014-[A-Z0-9]{4}$/))
test('stockLabel', () => expect(stockLabel('on_order')).toBe('On order'))
```
- [ ] **Step 2: Run → FAIL. Step 3: implement. Step 4: Run → PASS. Step 5: Commit** `feat: lib utilities`

---

### Task 4: Zustand stores with persist, export/import/reset

**Files:**
- Create: `src/stores/useCategoriesStore.ts`, `useProductsStore.ts`, `useSlidesStore.ts`, `useSettingsStore.ts`, `useQuoteStore.ts`, `useEnquiriesStore.ts`, `useAuthStore.ts`, `src/stores/index.ts`, `src/stores/schema.ts` (zod schemas for import)
- Test: `src/stores/stores.test.ts`

**Produces (exact):**
```ts
useCategoriesStore: { categories: Category[]; add(input: Omit<Category,'id'|'slug'> & {slug?: string}): Category; update(id, patch): void; remove(id): { ok: true } | { ok: false; reason: string }; reset(): void }
useProductsStore:   { products: Product[]; add(input: ProductInput): Product; update(id, patch: ProductInput): Product; remove(id): void; reset(): void }
  // ProductInput = Omit<Product,'id'|'createdAt'|'updatedAt'|'slug'> & { slug?: string }
useSlidesStore:     { slides: Slide[]; add; update; remove; move(id, dir: -1|1): void; reset }
useSettingsStore:   { settings: Settings; update(patch: Partial<Settings>): void; reset }
useQuoteStore:      { items: QuoteItem[]; add(productId, qty=1): void; setQuantity(productId, qty): void; remove(productId): void; clear(): void }
useEnquiriesStore:  { enquiries: Enquiry[]; add(input: Omit<Enquiry,'id'|'reference'|'createdAt'|'status'>): Enquiry; setStatus(id, status): void; remove(id): void; reset }
useAuthStore:       { isAuthenticated: boolean; login(email, password): boolean; logout(): void }
stores/index.ts:    exportAll(): string (JSON); importAll(json: string): { ok: true } | { ok: false; errors: string[] }; resetAll(): void
```
Rules: `remove` on categories refuses when any product references it (`reason: "3 products use this category"`). Product `add/update` run `uniqueSlug` against other products. `setQuantity` clamps to 1..999 and removes on 0 or NaN. `login` compares with `settings.admin`.

- [ ] **Step 1: Tests** (reset stores in `beforeEach` via `resetAll()`; `localStorage.clear()`)

```ts
test('product slug dedupes', () => { const a = add({...base, name:'NG-65'}); const b = add({...base, name:'NG-65'}); expect(b.slug).toBe(a.slug + '-2') })
test('category delete refused when in use', () => { expect(useCategoriesStore.getState().remove(catId)).toEqual({ ok:false, reason: expect.stringMatching(/products use/) }) })
test('quote quantity clamps and removes', () => { add('p1', 1); setQuantity('p1', 2000); expect(qty('p1')).toBe(999); setQuantity('p1', 0); expect(items()).toHaveLength(0) })
test('importAll rejects bad json', () => { const r = importAll('{"products": "nope"}'); expect(r.ok).toBe(false); expect(products().length).toBe(18) })
test('export/import round trip', () => { const s = exportAll(); resetAll(); expect(importAll(s).ok).toBe(true) })
test('login with seed credentials', () => { expect(login('admin@northline.example','northline2026')).toBe(true) })
```
- [ ] **Step 2: FAIL. Step 3: implement stores with `persist(..., { name: 'northline:products', version: 1 })`. Step 4: PASS. Step 5: Commit** `feat: zustand stores`

---

### Task 5: UI primitives and layout chrome

**Files:**
- Create: `src/components/ui/{Button,Badge,Input,Textarea,Select,Checkbox,Dialog,Drawer,Table,Toast,EmptyState,Spinner,FieldError}.tsx`, `src/components/ui/useToast.ts`
- Create: `src/components/layout/{Container,Section,PageHeader,Header,MobileNav,Footer}.tsx`
- Create: `src/app/router.tsx`, `src/app/App.tsx` (RouterProvider + ToastProvider), `src/pages/public/NotFoundPage.tsx`, `src/components/layout/PublicLayout.tsx`
- Test: `src/components/ui/Button.test.tsx`, `src/components/layout/Header.test.tsx`

Button variants: `primary` (safety bg, white text), `secondary` (steel bg), `outline`, `ghost`, `danger`; sizes `sm|md|lg`; `asChild`-free: accept `to` prop to render `<Link>`.
Dialog: uses native `<dialog>` with `showModal`, Escape closes, focus trapped by browser; props `open, onClose, title, children, footer`.
Toast: context + `useToast().show({ title, tone: 'success'|'error'|'info' })`, auto-dismiss 4s, `role="status"`.
Header: sticky, logo text from settings, nav links with `NavLink` active style (safety underline), quote basket button (lucide `ClipboardList`) with count badge from `useQuoteStore`, "Request a quote" primary button → `/contact`. Below `md`: hamburger toggles `MobileNav` panel; closes on route change (useLocation effect), Escape, outside click.
Footer: 4 columns on desktop, stacked on mobile; data from settings and categories store; small `Admin` link.

- [ ] Tests: Button renders a Link when `to` given; Header shows basket count "2" after adding two items and toggles mobile nav with `aria-expanded`.
- [ ] Commit `feat: ui primitives and layout`

---

### Task 6: Home page with hero carousel

**Files:**
- Create: `src/features/carousel/HeroCarousel.tsx`, `src/features/products/{ProductCard,StockBadge,ProductGrid}.tsx`, `src/features/home/{IndustriesStrip,CategoryGrid,Capabilities,ProcessSteps,Testimonials,CtaBand}.tsx`, `src/pages/public/HomePage.tsx`
- Test: `src/features/carousel/HeroCarousel.test.tsx`, `src/features/products/ProductCard.test.tsx`

HeroCarousel: Embla with `loop: true`, Autoplay plugin `{ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true }` only when `!matchMedia('(prefers-reduced-motion: reduce)').matches`. Slide: `<div class="relative h-[70vh] min-h-[480px] max-h-[720px]">` with `<img>` (first slide `loading="eager"`, others lazy), overlay `bg-gradient-to-r from-steel/90 via-steel/60 to-steel/10`, content container: `h1 font-display text-5xl md:text-7xl text-white max-w-3xl`, paragraph `text-steel-100 max-w-xl`, Button `to={slide.buttonHref}`. Controls: prev/next buttons (`aria-label="Previous slide"`), dots `aria-label="Go to slide N"` with `aria-current`. Root `role="region" aria-roledescription="carousel" aria-label="Featured"`. Keyboard: ArrowLeft/ArrowRight on the region.

ProductCard props `{ product, category }`: 4:3 image box, category name, `h3` name (line-clamp-2), SKU in `text-steel-400`, first two specs as `dl`, `StockBadge`, price label or "Price on request", "Add to quote" Button `sm` that calls `useQuoteStore.add` and `toast`.

HomePage composition per spec §4.2; sections alternate white / concrete backgrounds.

- [ ] Tests: carousel renders N dots for N enabled slides and sets `aria-current` on the first; ProductCard shows 2 spec rows and badge text "In stock".
- [ ] Commit `feat: home page and hero carousel`

---

### Task 7: Products listing and product detail

**Files:**
- Create: `src/features/products/{useProductFilters.ts,ProductFilters.tsx,SpecTable.tsx,ImageGallery.tsx}.tsx`, `src/pages/public/{ProductsPage,ProductDetailPage}.tsx`
- Test: `src/features/products/useProductFilters.test.ts`

`useProductFilters()` reads/writes `useSearchParams` (`category`, `q`, `availability`, `sort`) and returns `{ filters, setFilter(key, value), clear(), results: Product[], counts: Record<categorySlug, number> }`. Pure helper `applyFilters(products, categories, filters)` is exported for tests. Unknown category slug → results empty (not a throw).

- [ ] Tests for `applyFilters`: category filter, text search on name/sku/brand, availability, sort `name|newest|featured`, unknown category → `[]`.
- [ ] Build pages per spec §4.3 and §4.4 (breadcrumb, gallery with thumbnails `aria-pressed`, quantity input, related products, inline 404).
- [ ] Commit `feat: products listing and detail`

---

### Task 8: About and Contact / quote pages

**Files:**
- Create: `src/pages/public/{AboutPage,ContactPage}.tsx`, `src/features/quote/{QuoteBasketList,QuoteForm,quoteSchema.ts}.tsx`
- Test: `src/features/quote/QuoteForm.test.tsx`

`quoteSchema = z.object({ name: z.string().min(2,'Enter your name'), company: z.string().min(1,'Enter your company'), email: z.string().email('Enter a valid email'), phone: z.string().min(6,'Enter a phone number'), message: z.string().min(10,'Tell us a little more'), consent: z.literal(true, { errorMap: () => ({ message: 'Please agree so we can reply' }) }) })`.
On submit: `useEnquiriesStore.add({ ...values, items: snapshot })`, `useQuoteStore.clear()`, show confirmation panel with reference.

- [ ] Test: submitting empty form shows "Enter your name"; valid submit creates one enquiry and shows text matching `/NL-\d{8}-/`.
- [ ] Commit `feat: about and contact pages`

---

### Task 9: Admin shell, auth, dashboard

**Files:**
- Create: `src/components/layout/{AdminShell,AdminSidebar}.tsx`, `src/app/ProtectedRoute.tsx`, `src/pages/admin/{LoginPage,DashboardPage}.tsx`
- Test: `src/app/ProtectedRoute.test.tsx`

Login form (react-hook-form), error "Email or password is incorrect". Banner on login page: "Demo authentication. Replace with a real backend before production." Sidebar links: Dashboard, Products, Categories, Slides, Enquiries, Settings, Data; top bar: "View site", "Log out". Mobile: sidebar becomes a drawer.

- [ ] Test: unauthenticated render of `/admin` redirects to `/admin/login`; after `login()` the dashboard heading renders.
- [ ] Commit `feat: admin shell and login`

---

### Task 10: Admin products CRUD

**Files:**
- Create: `src/features/admin/{ProductForm,SpecsEditor,ImageListEditor,productSchema.ts}.tsx`, `src/pages/admin/{ProductsAdminPage,ProductEditPage}.tsx`
- Test: `src/features/admin/ProductForm.test.tsx`

Form fields per spec §5.3. Slug auto-fills from name until the user edits slug (track `slugTouched`). ImageListEditor: list of URL inputs + "Upload image" file input → `fileToDataUrl`, warn via toast if `file.size > 1_000_000`. SpecsEditor: `useFieldArray` rows label/value with add/remove/move.

- [ ] Test: typing name "Test Pump" auto-fills slug "test-pump"; submitting creates a product in the store.
- [ ] Commit `feat: admin products`

---

### Task 11: Admin categories, slides, settings

**Files:**
- Create: `src/features/admin/{CategoryForm,SlideForm,SettingsForm}.tsx`, `src/pages/admin/{CategoriesAdminPage,SlidesAdminPage,SettingsAdminPage}.tsx`
- Test: `src/pages/admin/CategoriesAdminPage.test.tsx`

Category delete button shows dialog; if store returns `{ ok:false, reason }`, dialog shows the reason and no delete. Slides page: list with Move up/down (disabled at ends), Enabled toggle, Edit dialog. Settings: sections Company / About / Admin credentials; one Save button; toast "Settings saved".

- [ ] Test: deleting a category in use shows the reason text and keeps the row.
- [ ] Commit `feat: admin categories slides settings`

---

### Task 12: Admin enquiries and data tools

**Files:**
- Create: `src/features/admin/{EnquiryDrawer,DataTools}.tsx`, `src/pages/admin/{EnquiriesAdminPage,DataAdminPage}.tsx`
- Test: `src/features/admin/DataTools.test.tsx`

Export: `Blob` download `northline-data-YYYY-MM-DD.json`. Import: file input → text → `importAll`; on `ok:false` show error list; on success toast "Data imported". Reset: confirmation dialog → `resetAll()`.

- [ ] Test: import of invalid JSON renders the error list and keeps product count.
- [ ] Commit `feat: admin enquiries and data tools`

---

### Task 13: Router wiring, 404, README, final checks

**Files:**
- Modify: `src/app/router.tsx` (all routes), `README.md`, `docs/CUSTOMIZING.md`
- Manual: Chrome at 375 / 768 / 1280 widths, keyboard pass, Lighthouse.

- [ ] `npm run build`, `npx vitest run`, `npm run lint` all clean.
- [ ] Screenshots of Home, Products, Product detail, Contact, Admin products at 375 and 1280 saved to `docs/screenshots/`.
- [ ] Commit `docs: readme and customization guide`
