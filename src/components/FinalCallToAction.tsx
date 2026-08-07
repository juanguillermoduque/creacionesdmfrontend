import { MessageCircle } from 'lucide-react'
import { siteConfig } from '../config/site'
import { WhatsAppButton } from './WhatsAppButton'

export function FinalCallToAction() {
  return (
    <section id="contacto" className="relative overflow-hidden py-12">
      <div className="paint-swoop mint-swoop left-[-5%] top-0 h-full w-[110%]" />
      <div className="section-shell relative flex flex-col items-center justify-between gap-6 py-8 text-center md:flex-row md:text-left">
        <div className="flex items-center gap-5">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white text-white">
            <MessageCircle aria-hidden="true" size={43} strokeWidth={2.2} />
          </span>
          <div>
            <h2 className="font-display text-[30px] font-black leading-tight text-ink md:text-[40px]">
              ¿Listo para crear algo increíble?
            </h2>
            <p className="mt-2 text-base text-ink">Cuéntanos tu idea y recibe asesoría sin compromiso.</p>
          </div>
        </div>
        <WhatsAppButton message={siteConfig.defaultMessage} dark className="px-7" />
      </div>
    </section>
  )
}
