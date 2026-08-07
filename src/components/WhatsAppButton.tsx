import { MessageCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { buildWhatsAppUrl } from '../lib/whatsapp'

type WhatsAppButtonProps = {
  message: string
  children?: ReactNode
  dark?: boolean
  className?: string
}

export function WhatsAppButton({
  message,
  children = 'Cotizar por WhatsApp',
  dark = false,
  className = '',
}: WhatsAppButtonProps) {
  const palette = dark
    ? 'bg-ink text-white hover:bg-black'
    : 'bg-mint text-ink hover:bg-[#85d5c5]'

  return (
    <a
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] px-5 text-sm font-extrabold transition ${palette} ${className}`}
    >
      <MessageCircle aria-hidden="true" size={21} strokeWidth={2.4} />
      {children}
    </a>
  )
}
