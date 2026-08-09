import { siteConfig } from '../config/site'
import { WhatsAppButton } from './WhatsAppButton'

const socialLinks = [
  {
    label: 'Facebook',
    href: siteConfig.social.facebook,
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M14 8.4h2.2V5.1c-.38-.05-1.68-.16-3.2-.16-3.16 0-5.32 1.93-5.32 5.46v3.08H4.5v3.7h3.18V24h3.9v-6.82h3.24l.52-3.7h-3.76v-2.72c0-1.07.3-2.36 2.42-2.36Z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: siteConfig.social.instagram,
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5Zm8.75 2.2a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM12 7.25A4.75 4.75 0 1 1 12 16.75 4.75 4.75 0 0 1 12 7.25Zm0 2A2.75 2.75 0 1 0 12 14.75 2.75 2.75 0 0 0 12 9.25Z" />
      </svg>
    ),
  },
].filter((item) => Boolean(item.href))

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white" id="footer">
      <div className="section-shell grid gap-9 py-9 md:grid-cols-[1.1fr_0.7fr_0.8fr_1.2fr]">
        <div>
          <img
            src="/assets/creaciones-dm-logo.png"
            alt="Creaciones DM"
            width="150"
            height="150"
            className="h-32 w-32 rounded-full object-contain"
          />
        </div>

        <div>
          <h2 className="text-sm font-extrabold text-ink">Enlaces</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-ink/75">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-ink">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-extrabold text-ink">Productos</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-ink/75">
            {siteConfig.featuredProducts.map((product) => (
              <li key={product}>{product}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-extrabold text-ink">Creaciones DM</h2>
          <p className="mt-3 max-w-xs text-sm leading-6 text-ink/75">{siteConfig.description}</p>
          <p className="mt-3 text-sm font-semibold text-ink/75">{siteConfig.email}</p>
          <p className="mt-2 text-sm text-ink/70">Hecho en Colombia con dedicación.</p>
          {socialLinks.length ? (
            <div className="mt-4 flex flex-wrap gap-2" aria-label="Redes sociales">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Abrir ${social.label} de Creaciones DM`}
                  className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-black/10 bg-white px-3 text-sm font-extrabold text-ink transition hover:border-mint hover:bg-ivory"
                >
                  {social.icon}
                  {social.label}
                </a>
              ))}
            </div>
          ) : null}
          <WhatsAppButton message={siteConfig.defaultMessage} className="mt-4" />
        </div>
      </div>
      <div className="border-t border-black/5">
        <div className="section-shell flex flex-col justify-between gap-2 py-4 text-xs text-ink/65 md:flex-row">
          <p>© {year} Creaciones DM. Todos los derechos reservados.</p>
          <p>Hecho en Colombia</p>
        </div>
      </div>
    </footer>
  )
}
