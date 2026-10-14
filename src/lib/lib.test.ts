import { slugify, uniqueSlug } from './slugify'
import { newId, newReference } from './id'
import { formatDate, stockLabel } from './format'

describe('slugify', () => {
  test('lowercases, strips punctuation and collapses separators', () => {
    expect(slugify('Atlas Copco GA 15 / Rotary!')).toBe('atlas-copco-ga-15-rotary')
  })
  test('handles accents and leading/trailing dashes', () => {
    expect(slugify('  Lüsqtoff Iron-140 (1) ')).toBe('lusqtoff-iron-140-1')
  })
  test('uniqueSlug appends the next free numeric suffix', () => {
    expect(uniqueSlug('ng-65', [])).toBe('ng-65')
    expect(uniqueSlug('ng-65', ['ng-65'])).toBe('ng-65-2')
    expect(uniqueSlug('ng-65', ['ng-65', 'ng-65-2'])).toBe('ng-65-3')
  })
})

describe('ids', () => {
  test('newId uses the prefix and is unique', () => {
    const a = newId('prod')
    expect(a).toMatch(/^prod-[a-z0-9]{8,}$/)
    expect(newId('prod')).not.toBe(a)
  })
  test('newReference formats NL-YYYYMMDD-XXXX', () => {
    expect(newReference(new Date('2026-10-14T03:00:00Z'))).toMatch(/^NL-20261014-[A-Z0-9]{4}$/)
  })
})

describe('format', () => {
  test('formatDate renders a readable date', () => {
    expect(formatDate('2026-10-14T03:00:00Z')).toBe('14 Oct 2026')
  })
  test('stockLabel maps every status', () => {
    expect(stockLabel('in_stock')).toBe('In stock')
    expect(stockLabel('on_order')).toBe('On order')
    expect(stockLabel('enquire')).toBe('Enquire for availability')
  })
})
