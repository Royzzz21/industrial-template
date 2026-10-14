const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function randomChars(length: number, alphabet = ALPHABET): string {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${randomChars(6, 'abcdefghijklmnopqrstuvwxyz0123456789')}`
}

/** Enquiry reference such as NL-20261014-7K3Q */
export function newReference(date: Date = new Date()): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `NL-${y}${m}${d}-${randomChars(4)}`
}
