import { cn } from './cn'

test('merges conflicting tailwind classes, last wins', () => {
  expect(cn('p-2', 'p-4')).toBe('p-4')
})

test('drops falsy values', () => {
  const hidden: boolean = Math.random() > 2
  expect(cn('a', hidden && 'b', undefined, 'c')).toBe('a c')
})
