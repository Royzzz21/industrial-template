export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Returns `base` if free, otherwise `base-2`, `base-3`, … skipping taken slugs. */
export function uniqueSlug(base: string, taken: string[]): string {
  const set = new Set(taken)
  if (!set.has(base)) return base
  let n = 2
  while (set.has(`${base}-${n}`)) n += 1
  return `${base}-${n}`
}
