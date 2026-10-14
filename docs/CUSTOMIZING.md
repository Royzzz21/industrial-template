# Customizing the template

## 1. Company details

Everything about the company lives in `src/data/seed/settings.json`: name, tagline,
logo text, email, phone, address, hours, social links, the About page copy and stats,
and the demo admin login. Edit the file for a new build, or change it in
**Admin → Settings** for the current browser.

## 2. Catalogue

- `src/data/seed/categories.json`: six categories. Each needs a unique `slug`.
- `src/data/seed/products.json`: products reference a category by `categoryId`.
  Fields: `name`, `slug`, `sku`, `brand`, `shortDescription`, `description`,
  `images[]`, `specs[]` (first two show on cards), `stock`
  (`in_stock | on_order | enquire`), optional `priceLabel` and `datasheetUrl`,
  `featured` (shown on the home page, first six).
- `src/data/seed/slides.json`: hero slides, ordered by `sortOrder`.
- `src/data/seed/testimonials.json`: three quotes.

The admin edits the same data and stores it under `localStorage` keys prefixed
`northline:`. **Admin → Data → Export** downloads the current state as JSON, which
can be pasted back into the seed files to make it the new default.

## 3. Colours and type

`tailwind.config.ts` defines the palette: `steel` (dark blue), `graphite` (text),
`concrete` (light sections) and `safety` (orange accent). Change the hex values and
every component follows. Fonts are loaded in `index.html` from Google Fonts;
`font-display` is Barlow Condensed and `font-sans` is Barlow.

## 4. Copy on the home page

Capabilities, industries and process steps are in `src/features/home/content.ts`.

## 5. Images

Seed photos are hot-linked from Wikimedia Commons (see `IMAGE-CREDITS.md`). Replace
them with the client's own photos, either as URLs or files in `public/images/`.
Admin uploads are stored as data URLs in the browser, so keep them under 1 MB.

## 6. Deployment

`npm run build` produces static files in `dist/`. Host them on any static host
(Netlify, Vercel, S3 + CloudFront, nginx). Because the app uses client-side routing,
configure the host to serve `index.html` for unknown paths.
