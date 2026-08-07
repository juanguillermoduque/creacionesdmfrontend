import { CheckCircle2 } from 'lucide-react'
import { siteConfig } from '../config/site'
import { WhatsAppButton } from './WhatsAppButton'

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-[112px]">
      <div className="paint-swoop yellow-swoop right-[-7rem] top-28 h-[21rem] w-[24rem] rotate-[-9deg]" />
      <div className="paint-swoop blue-swoop bottom-[-8rem] right-[20%] h-[17rem] w-[26rem] rotate-[-10deg]" />
      <div className="paint-swoop rose-swoop left-[39%] top-[52%] h-56 w-56" />

      <div className="section-shell relative grid min-h-[690px] items-center gap-8 pb-10 md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative z-10 max-w-xl">
          <h1 className="font-display text-[54px] font-black leading-[0.98] text-ink md:text-[82px]">
            {siteConfig.hero.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <span className="brush-underline block text-mint">{siteConfig.hero.highlighted}</span>
          </h1>
          <p className="mt-9 max-w-md text-[17px] leading-7 text-ink md:text-[18px]">
            {siteConfig.hero.body}
          </p>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <WhatsAppButton
              message="Hola, Creaciones DM. Quiero cotizar productos personalizados."
              className="px-7"
            />
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-ink/70">
              <CheckCircle2 aria-hidden="true" size={17} />
              {siteConfig.hero.reassurance}
            </span>
          </div>
        </div>

        <div className="relative z-10">
          <img
            src="/assets/hero-products.png"
            alt="Camiseta, mug, tote bag y botilito personalizados con brochazos pastel"
            width="1536"
            height="1024"
            className="ml-auto w-full max-w-[760px] rounded-[8px] object-cover shadow-product"
            fetchPriority="high"
          />
          <div className="absolute -left-6 top-1/2 hidden text-ink md:block" aria-hidden="true">
            <span className="block h-[4px] w-7 rotate-[-28deg] rounded-full bg-ink" />
            <span className="mt-3 block h-[4px] w-8 rounded-full bg-ink" />
            <span className="mt-3 block h-[4px] w-7 rotate-[28deg] rounded-full bg-ink" />
          </div>
        </div>
      </div>
    </section>
  )
}
