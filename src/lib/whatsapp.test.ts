import { describe, expect, it } from 'vitest'
import { buildWhatsAppUrl, normalizeWhatsAppNumber } from './whatsapp'

describe('whatsapp helpers', () => {
  it('normalizes phone numbers', () => {
    expect(normalizeWhatsAppNumber('+57 305 326 1275')).toBe('573053261275')
  })

  it('encodes quote messages', () => {
    expect(buildWhatsAppUrl('Hola, quiero cotizar mugs.')).toContain(
      'text=Hola%2C%20quiero%20cotizar%20mugs.',
    )
  })
})
