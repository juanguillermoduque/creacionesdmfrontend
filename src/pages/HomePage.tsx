import { Benefits } from '../components/Benefits'
import { CorporateSubscription } from '../components/CorporateSubscription'
import { CustomerTypes } from '../components/CustomerTypes'
import { FinalCallToAction } from '../components/FinalCallToAction'
import { Hero } from '../components/Hero'
import { ProductCategories } from '../components/ProductCategories'
import { SeoContent } from '../components/SeoContent'

export function HomePage() {
  return (
    <>
      <Hero />
      <ProductCategories />
      <SeoContent />
      <CustomerTypes />
      <CorporateSubscription />
      <Benefits />
      <section id="nosotros" className="section-shell py-16 md:py-20">
        <div className="relative overflow-hidden rounded-[8px] border border-black/10 bg-white px-6 py-9 shadow-sm md:px-12">
          <div className="paint-swoop rose-swoop -left-16 -top-24 h-52 w-52" />
          <div className="relative max-w-3xl">
            <h2 className="font-display text-[32px] font-extrabold leading-[1.04] text-ink md:text-[44px]">
              En Creaciones DM transformamos ideas, recuerdos y marcas.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink/74">
              Trabajamos cada creación con dedicación, creatividad y atención al detalle para que
              cada producto conecte, sorprenda y permanezca.
            </p>
          </div>
        </div>
      </section>
      <FinalCallToAction />
    </>
  )
}
