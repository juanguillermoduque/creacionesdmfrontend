import { HelpCircle, SearchCheck, Sparkles } from 'lucide-react'
import { siteConfig } from '../config/site'
import { WhatsAppButton } from './WhatsAppButton'

const icons = [SearchCheck, Sparkles, HelpCircle]

export function SeoContent() {
  return (
    <section className="bg-white py-14 md:py-18" aria-labelledby="seo-content-title">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.86fr_1.14fr]">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-mint">Personalizados en Colombia</p>
          <h2 id="seo-content-title" className="mt-3 font-display text-[34px] font-black leading-[1.05] text-ink md:text-[48px]">
            Productos personalizados que se sienten hechos para cada persona.
          </h2>
          <p className="mt-5 text-base leading-7 text-ink/74">
            En Creaciones DM diseñamos y sublimamos regalos personalizados para cumpleaños,
            aniversarios, emprendimientos, equipos de trabajo, empresas, eventos y campañas. Si
            buscas mugs personalizados, camisetas estampadas, botilitos, tote bags, gorras,
            cojines o detalles corporativos, te acompañamos desde la idea hasta la entrega.
          </p>
          <WhatsAppButton message={siteConfig.defaultMessage} className="mt-7 px-7">
            Cotizar producto personalizado
          </WhatsAppButton>
        </div>

        <div className="grid gap-4">
          {siteConfig.seoHighlights.map((highlight, index) => {
            const Icon = icons[index]
            return (
              <article key={highlight.title} className="rounded-[8px] border border-black/10 bg-ivory px-5 py-5">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-white text-ink shadow-sm">
                    <Icon aria-hidden="true" size={24} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="text-lg font-extrabold leading-6 text-ink">{highlight.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-ink/72">{highlight.body}</p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      <div className="section-shell mt-12">
        <div className="grid gap-4 md:grid-cols-2">
          {siteConfig.faqs.map((faq) => (
            <details key={faq.question} className="group rounded-[8px] border border-black/10 bg-white px-5 py-4">
              <summary className="cursor-pointer text-base font-extrabold leading-6 text-ink">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm leading-6 text-ink/72">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
