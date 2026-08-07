import { siteConfig } from '../config/site'

export function normalizeWhatsAppNumber(number = siteConfig.whatsappNumber) {
  return number.replace(/\D/g, '')
}

export function buildWhatsAppUrl(message = siteConfig.defaultMessage) {
  const phone = normalizeWhatsAppNumber()
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export function openWhatsApp(message: string) {
  window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer')
}
