import { siteConfig } from '../config/site'
import { WhatsAppButton } from './WhatsAppButton'

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
