import { CalendarCheck, Gift, UsersRound } from 'lucide-react'
import { siteConfig } from '../config/site'
import { WhatsAppButton } from './WhatsAppButton'

const icons = [Gift, CalendarCheck, UsersRound]

export function CorporateSubscription() {
  return (
    <section id="empresas" className="relative overflow-hidden bg-ivory py-14 md:py-18">
      <div className="paint-swoop yellow-swoop right-[-8rem] top-6 h-72 w-72 rotate-[-8deg]" />
      <div className="paint-swoop blue-swoop -left-20 bottom-[-10rem] h-72 w-[28rem] rotate-[10deg]" />

      <div className="section-shell relative grid items-center gap-9 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="max-w-xl">
          <h2 className="font-display text-[34px] font-black leading-[1.05] text-ink md:text-[50px]">
            {siteConfig.corporateSubscription.title}
          </h2>
          <p className="mt-5 text-base leading-7 text-ink/74">
            {siteConfig.corporateSubscription.body}
          </p>

          <div className="mt-8 grid gap-4">
            {siteConfig.corporateSubscription.points.map((point, index) => {
              const Icon = icons[index]
              return (
                <div key={point} className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-white text-ink shadow-sm">
                    <Icon aria-hidden="true" size={24} strokeWidth={1.7} />
                  </span>
                  <p className="pt-2 text-sm font-bold leading-6 text-ink">{point}</p>
                </div>
              )
            })}
          </div>

          <WhatsAppButton
            message={siteConfig.corporateSubscription.message}
            className="mt-9 px-7"
          >
            Cotizar plan mensual
          </WhatsAppButton>
          <p className="mt-3 max-w-md text-xs leading-5 text-ink/62">
            La cantidad, productos y frecuencia se definen contigo antes de iniciar. No se muestran
            precios fijos porque cada empresa puede necesitar una composición distinta.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-mint/70" />
          <img
            src="/assets/corporate-products.png"
            alt="Productos personalizados para empresas en una modalidad mensual de regalos"
            loading="lazy"
            width="1456"
            height="1088"
            className="relative rounded-[8px] object-cover shadow-product"
          />
        </div>
      </div>
    </section>
  )
}
