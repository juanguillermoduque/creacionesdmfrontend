import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { siteConfig } from '../config/site'
import { WhatsAppButton } from './WhatsAppButton'

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-black/5 bg-ivory/88 backdrop-blur-xl">
      <div className="section-shell flex h-[82px] items-center justify-between gap-5">
        <a href="#inicio" aria-label="Ir al inicio" className="flex items-center">
          <img
            src="/assets/creaciones-dm-logo.png"
            alt="Creaciones DM"
            className="h-[66px] w-[66px] rounded-full object-contain md:h-[78px] md:w-[78px]"
          />
        </a>

        <nav aria-label="Navegación principal" className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-bold text-ink transition hover:text-ink/60"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <WhatsAppButton message={siteConfig.defaultMessage} />
        </div>

        <button
          type="button"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-black/10 bg-white text-ink md:hidden"
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-black/10 bg-ivory px-4 py-4 md:hidden" aria-label="Menú móvil">
          <div className="mx-auto flex max-w-sm flex-col gap-2">
            {siteConfig.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-[8px] px-3 py-3 text-base font-bold text-ink hover:bg-white"
              >
                {item.label}
              </a>
            ))}
            <WhatsAppButton message={siteConfig.defaultMessage} className="mt-2 w-full" />
          </div>
        </nav>
      ) : null}
    </header>
  )
}
