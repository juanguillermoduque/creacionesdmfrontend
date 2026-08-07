import { WhatsAppButton } from './WhatsAppButton'

export function CustomerTypes() {
  return (
    <section className="border-y border-black/5 bg-white/70 py-12 md:py-16">
      <div className="section-shell grid gap-10 lg:grid-cols-2">
        <article className="grid items-center gap-6 md:grid-cols-[0.78fr_1fr]">
          <div>
            <h2 className="font-display text-[30px] font-black leading-[1.08] text-ink md:text-[38px]">
              <span className="brush-underline">Para personas</span>
              <br />y momentos especiales
            </h2>
            <p className="mt-7 text-sm leading-6 text-ink/74">
              Convierte tus recuerdos e ideas en regalos únicos para cumpleaños, bodas, fechas
              especiales y mucho más.
            </p>
            <WhatsAppButton
              message="Hola, Creaciones DM. Quiero personalizar un regalo para una ocasión especial."
              className="mt-7 border border-[#55c8b3] bg-transparent px-5 hover:bg-mint"
            >
              Personaliza para ti
            </WhatsAppButton>
          </div>
          <img
            src="/assets/personal-gifts.png"
            alt="Mug, cojín y portarretratos personalizados para regalos especiales"
            loading="lazy"
            width="1456"
            height="1088"
            className="rounded-[8px] object-cover shadow-product"
          />
        </article>

        <article className="grid items-center gap-6 md:grid-cols-[0.78fr_1fr]">
          <div>
            <h2 className="font-display text-[30px] font-black leading-[1.08] text-ink md:text-[38px]">
              Para empresas,
              <br />eventos y campañas
            </h2>
            <p className="mt-7 text-sm leading-6 text-ink/74">
              Potencia tu marca con productos personalizados para tu equipo, clientes, eventos y
              campañas.
            </p>
            <WhatsAppButton
              message="Hola, Creaciones DM. Quiero cotizar productos personalizados para empresa, evento o campaña."
              className="mt-7 border border-[#55c8b3] bg-transparent px-5 hover:bg-mint"
            >
              Personaliza tu marca
            </WhatsAppButton>
          </div>
          <img
            src="/assets/corporate-products.png"
            alt="Polo, gorra, mug y botilito con personalización corporativa"
            loading="lazy"
            width="1456"
            height="1088"
            className="rounded-[8px] object-cover shadow-product"
          />
        </article>
      </div>
    </section>
  )
}
