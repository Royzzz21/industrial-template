# Final review: industrial products website template

Range: `759602e..8dde294` (15 commits, 158 files, +10,468)
Reviewer: fresh, read-only. No files in the working tree were modified.

## Verification run

| Command | Result |
|---|---|
| `npx vitest run` | 14 files, 56 tests, all pass |
| `npx tsc -b` | clean (exit 0) |
| `npm run build` | succeeds; public bundle 333 kB + stores chunk 263 kB (gz 106 + 82 kB); admin pages split into lazy chunks |
| `npm run lint` (oxlint) | 20 warnings, 0 errors (fast-refresh export warnings, two `set-state-in-effect`, impure `Date` in Footer) |
| Quota proof (scratchpad script, zustand 5.0.15 `persist` + `createJSONStorage` over a storage whose `setItem` throws `QuotaExceededError`) | the store action **throws**, in-memory state is updated, storage keeps the previous value |

Ledger rulings weighed: React 19 / Vite 8 instead of 18 / 5; Wikimedia Commons instead of Unsplash; 23 products / 8 featured; PHP prices; test-setup stubs; delete-dialog shows the reason immediately; `ScrollRestoration` keyed by pathname+search; lazy admin routes. All are reasonable and I did not re-litigate them. Two of them have side effects noted below (scroll key: Minor 9; lazy routes: none).

## Strengths

- Store layer is small and correct for the five Review Focus items. `uniqueSlug` is applied in both `add` and `update` with the product itself excluded from `taken` (`src/stores/useProductsStore.ts:26-30, 40-44`); category `remove` returns a counted reason (`src/stores/useCategoriesStore.ts:51-58`); `setQuantity` clamps 1..999 and removes on 0/NaN (`src/stores/useQuoteStore.ts:16, 31-38`); `importAll` validates with zod before touching any store and reports path-qualified messages (`src/stores/index.ts:35-56`); `applyFilters` returns `[]` for an unknown category slug (`src/features/products/useProductFilters.ts:25-29`) and the page shows the empty state with "Clear filters" (`src/pages/public/ProductsPage.tsx:50-59`).
- Tests exercise real stores and real DOM, not mocks: `stores.test.ts` covers every Review Focus item at the store level, and `CategoriesAdminPage.test.tsx`, `DataTools.test.tsx`, `QuoteForm.test.tsx`, `ProductForm.test.tsx` cover the UI paths with `user-event`.
- Enquiry items snapshot name/SKU (`src/features/quote/QuoteForm.tsx:27-32`), so history survives product edits as the spec requires.
- Accessibility basics are in place: labelled icon buttons everywhere, `aria-pressed` on filter and gallery buttons, `role="status"` result counts, native `<dialog>` with `showModal`, skip link, `focus-visible` ring globally (`src/styles/index.css:9`), `prefers-reduced-motion` disables autoplay and slide animation.
- Category delete dialog is built so the destructive button is simply absent when the delete is impossible, which is better than the plan's "show the reason after clicking Delete".
- Clean separation: pages compose features, features read stores via selectors, UI primitives know nothing about the domain. `Button` with `to` renders a `Link` so CTA styling is consistent.
- README and `docs/CUSTOMIZING.md` are accurate to the code I read; image licences are tracked in `docs/IMAGE-CREDITS.md`.

## Issues

### Critical (must fix)

**C1. localStorage quota exceeded is unhandled: the save throws, the UI goes silent, the data is lost on reload (spec §6.6 not implemented)**

- Files: `src/stores/persist.ts:8` (plain `createJSONStorage(() => localStorage)`, no try/catch); every store's `set` call, e.g. `src/stores/useProductsStore.ts:34, 47`; `src/features/admin/ImageListEditor.tsx:21-25` (warns on >1 MB but appends the data URL anyway); `src/features/admin/ProductForm.tsx:58-59` (`update()`/`add()` called before `onSaved`).
- No code anywhere references `QuotaExceededError`, "Storage full", or wraps `setItem` (grep confirmed). The spec requires a toast "Storage full. Remove large uploaded images or export and reset data." with state kept in memory.
- Failing scenario (reachable in a normal demo): admin opens a product, clicks "Upload image", picks three phone photos (2 to 4 MB each; the toast says "Image is large" but still adds them), clicks "Save product". `localStorage.setItem` throws `QuotaExceededError` inside zustand's persist wrapper. Proven with zustand 5.0.15: the exception propagates out of `useProductsStore.getState().update()`, so `onSaved` never runs: no toast, no navigation, no error message. The in-memory store *was* updated (the product list now shows the edit if the admin navigates away by hand), but storage still holds the old value, so on reload the work is gone. react-hook-form rethrows the error as an unhandled promise rejection in the console only.
- Fix: wrap storage in a safe adapter, e.g. in `persist.ts` return a `StateStorage` whose `setItem` catches, detects quota errors (`e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014`), and notifies a tiny subscriber (`onStorageError`) that `App.tsx` turns into the spec's toast. Optionally also refuse to append uploads over a hard cap (say 2 MB) rather than only warning. Add a test that stubs `localStorage.setItem` to throw and asserts the toast text and that `getState()` still has the edit.

### Important (should fix)

**I1. Clearing the quantity field on the contact page deletes the basket line**

- File: `src/features/quote/QuoteBasketList.tsx:50` (`onChange={(e) => setQuantity(item.productId, Number(e.target.value))}`), relying on `src/stores/useQuoteStore.ts:31-35` removing on 0.
- Scenario: a visitor has "NG-65 generator x 1" in the basket and wants 12. They click into the quantity box, press Backspace to clear "1" (value becomes `""`, `Number("")` is `0`), and the line vanishes from the list instantly. Any non-numeric keystroke in a `type="number"` field also yields `""` and removes the line. Review Focus 3 was meant to make the store robust, not to make every keystroke destructive.
- Fix: keep a local string state for the input and commit on blur/Enter (or only call `setQuantity` when `e.target.value !== ''`), leaving removal to the Remove button and the minus stepper.

**I2. Login page prints the current admin password in plain text, including after the client changes it**

- File: `src/pages/admin/LoginPage.tsx:15, 55` (`Demo login: {admin.email} / {admin.password}` read live from the settings store).
- Scenario: README and the Settings page tell the client to change the credentials. They set a new password in Settings; the public `/admin/login` page (linked from the footer) now displays that new password to anyone. A reasonable person changing a password expects it not to appear on the login screen. Demo auth is in scope, but revealing the live secret defeats even the demo.
- Fix: show the seed credentials as static copy only when `admin` still equals the seed values, or move the hint to the README and keep the "Demo authentication" banner without credentials.

**I3. Basket items whose product was deleted are stuck: header badge counts them, the basket list hides them, the form miscounts them**

- Files: `src/components/layout/Header.tsx:15` (`selectQuoteCount` sums all items), `src/features/quote/QuoteBasketList.tsx:13-15` (filters out unknown products), `src/features/quote/QuoteForm.tsx:79` (`items.length` includes them), `src/stores/useProductsStore.ts:50` (`remove` does not touch the quote store), `src/stores/index.ts:35-56` (`importAll` replaces products but does not clear the quote; `resetAll` does).
- Scenario (same browser is both visitor and admin in this demo): add a product to the quote, go to admin, delete that product (or import a data file without it). Back on the site the header badge shows "1", the contact page says "Your quote list is empty", and the form footer says "1 product line will be attached" while the submitted enquiry contains 0 items. There is no control that removes the orphan; it persists until an enquiry is submitted or storage is cleared.
- Fix: derive the badge count from resolved lines (or prune orphans in `useProductsStore.remove`, `replaceAll` and `importAll`).

**I4. Document title is static; plan says the app title comes from settings, and no page sets its own**

- Files: `index.html:12` is the only `<title>`; no `document.title` anywhere in `src`.
- Scenario: the client renames the company in Settings; every tab still reads "Northline Industrial Supply". Product detail, Products, Contact and Admin pages all share that one title, so browser history and tabs are indistinguishable. Plan Global Constraints: "app title from settings".
- Fix: a small `useDocumentTitle(parts)` hook in `PageHeader`/pages that composes `page | settings.company.name`.

**I5. Spec §7 manual gate not evidenced**

- The ledger records Playwright captures at 375/768/1280 with no overflow or console errors (good), but the spec's "Lighthouse accessibility ≥ 95 on Home" and the keyboard pass are not mentioned. Two concrete things Lighthouse/axe will flag are listed in Minor 1 and Minor 2. Run it once and record the score in the ledger.

### Minor (nice to have)

1. **`aria-labelledby` points at IDs that do not exist** — `src/pages/public/HomePage.tsx:31, 38` reference `categories-title` / `featured-title`, but `SectionHeading` (`src/components/layout/Section.tsx:21-31`) never renders an `id`. axe reports `aria-valid-attr-value`. Pass an `id` through or drop the attributes.
2. **Multiple `<h1>` on Home** — every carousel slide renders an `h1` (`src/features/carousel/HeroCarousel.tsx:72`), so the home page has four. Use `h2` for slides 2..n or a single visually-hidden page `h1`.
3. **Duplicate `id="dialog-title"`** — `src/components/ui/Dialog.tsx:42, 45`. Pages mount two `Dialog`s at once (Categories, Slides, Products admin), so the DOM has duplicate IDs and `aria-labelledby` resolves to the first (wrong) one for the second dialog. Use `useId()`.
4. **Placeholder datasheet links go to `#`** — `src/data/seed/products.json:54, 280, 590`; rendered as "Download datasheet (PDF)" in `src/pages/public/ProductDetailPage.tsx:85-90`. Matt will click it and the page scrolls to the top. Point at a real sample PDF in `public/` or hide the link when the URL is `#`.
5. **Hard-coded brand copy outside settings** — `src/pages/public/HomePage.tsx:41` ("our Calamba warehouse"), `:51` ("Why buy from Northline"), `:34` ("Six product families"), `src/pages/public/AboutPage.tsx:24` (alt text "Northline workshop"), `src/components/layout/Footer.tsx:17` (fixed sentence appended to the editable tagline). Spec success criterion 3 says everything a client changes is in `/admin` or one seed file; these need a code edit. The category count will also be wrong as soon as the admin adds a seventh category.
6. **Oversized uploads are only warned, never refused** — `src/features/admin/ImageListEditor.tsx:21-25`, `src/features/admin/SlideForm.tsx:45-46`. With C1 fixed this becomes a UX nit; without it, this is the trigger.
7. **Slug can be empty** — a product named only with symbols (e.g. "###") slugifies to `""` (`src/lib/slugify.ts:1-8`), passes `productSchema` (`slug` has no `min`), and is saved with `slug: ""`, so its URL `/products/` resolves to the listing page. Fall back to the SKU or the id when the slug is empty.
8. **Silent slug rewrite** — when the admin types a slug that is taken, the store saves `-2` without telling them (`src/stores/useProductsStore.ts:30, 44`). Correct per Review Focus 1, but a toast "Slug changed to x-2 because x is in use" would avoid confusion.
9. **Every filter change scrolls to the top** — `ScrollRestoration` keyed by `pathname + search` (`src/components/layout/PublicLayout.tsx:16`) plus `setParams(next, { replace: true })` (`src/features/products/useProductFilters.ts:72`) means each category/availability click produces a new key and `window.scrollTo(0, 0)`. On mobile with the filter panel open this is a jump. Pass `preventScrollReset: true` in `setFilter` and `clear`.
10. **Product detail quantity box cannot be cleared while typing** — `src/pages/public/ProductDetailPage.tsx:74` snaps `""` to `1`, so Backspace then "5" yields 15. Same local-string pattern as I1.
11. **`tel:` link keeps spaces** in the enquiry drawer (`src/features/admin/EnquiryDrawer.tsx:36`) while Footer/Contact strip them.
12. **No `errorElement` on routes** (`src/app/router.tsx`) so any render error shows react-router's unstyled default page instead of the site's chrome.
13. **No persist `migrate`** — `STORAGE_VERSION = 1` with no `migrate` (`src/stores/persist.ts:4`); bumping the version later makes zustand `console.error` and silently discard the admin's data. Also, `settings` is replaced wholesale on hydrate, so adding a new field to `settings.json` later will be `undefined` for any browser that has saved settings once (`src/stores/useSettingsStore.ts:14-23`). Consider `merge: (persisted, current) => deepMerge(current, persisted)` for settings.
14. **Seed changes are shadowed after any admin edit** — inherent to spec §6.4, but `docs/CUSTOMIZING.md` should say "after editing in admin, use Data → Reset to see new seed data".
15. **Scaffold leftovers** — `src/assets/hero.png` (13 kB) and `src/assets/vite.svg` are unreferenced.
16. **Spec deviations not in the ledger** — related products capped at 3 not 4 (`src/pages/public/ProductDetailPage.tsx:27`); product grid goes to 2 columns at 640 px (`sm:`) rather than the spec's 480 px (`src/features/products/ProductGrid.tsx:7`); admin has no `ScrollRestoration`, so navigating between long admin pages keeps the previous scroll offset. All fine if intentional; record them.
17. **Wikimedia hot-linking** — 46 image URLs on `upload.wikimedia.org`. Commons tolerates hot-linking but rate-limits; a busy demo session can see 429s. CC BY-SA images also expect on-page attribution, which only exists in `docs/IMAGE-CREDITS.md`.
18. **Admin password field is `type="text"`** (`src/features/admin/SettingsForm.tsx:145`). Acceptable for a demo; pair with I2.

## Recommendations

- Centralise storage error handling in `persist.ts` (C1) and reuse it for a future "storage nearly full" indicator on the Data page (`navigator.storage.estimate()` is cheap).
- Treat the quote store as derived from products: expose `useQuoteLines()` that resolves items against products once, and have Header, basket list and form all read from it (fixes I3 in one place).
- Add `useDocumentTitle` and use it in `PageHeader`, `ProductDetailPage` and `AdminPage` (I4).
- Add two tests to lock the UI contracts the Review Focus tests do not reach: QuoteBasketList "clearing the input keeps the line" (I1) and a storage-full toast test (C1).
- Fix the `aria-labelledby`/duplicate-id items (Minor 1-3) before running Lighthouse; they are the likeliest reasons to miss the 95 target.

## Declined to judge

- Real manufacturer names in seed data (Atlas Copco, Cummins, DeWalt, Lincoln Electric) and the About copy "Authorised distributor for Cummins, Atlas Copco and Lincoln Electric": a content/legal call for Gerold and Matt, not a code defect.
- React 19 / Vite 8 / TS 6 / Vitest 5 / zod 4 / react-router 7 instead of the spec's pinned majors: ruled in the ledger; APIs used are identical and everything builds and passes.
- oxlint instead of ESLint: tooling swap outside the spec's intent; lint runs clean of errors.
- Demo authentication living entirely client-side, credentials in `settings.json`, session flag in localStorage: explicitly in scope as "demo" by spec §5.1 (I2 is about *displaying* the live password, not about the mechanism).
- Hero prev/next arrows hidden below `sm` (dots and swipe only on phones): a design choice consistent with the spec's "swipe on touch".
- Per-page `<meta description>`/Open Graph: spec lists "SEO beyond basic meta tags" as out of scope.
- Prices shown in PHP and the Calamba/Laguna setting: ruled in the ledger as matching the demo address.
- Fast-refresh and `set-state-in-effect` lint warnings: cosmetic, no runtime effect.

## Assessment

**Ready to merge? With fixes.**

The core is sound: all five Review Focus behaviours are implemented and tested at the store level, the build and type-check are clean, and the public site is coherent. The blocker is C1: the spec's one explicit storage-failure requirement is missing and the failure mode is silent data loss on exactly the feature (image upload) the admin is invited to use. I1 to I4 are each small, contained fixes; I1 and I2 are the two a client reviewer is most likely to hit in a first session.
