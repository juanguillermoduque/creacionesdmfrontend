import { ArrowRight, CalendarDays, Heart, ShoppingBag, Wrench } from 'lucide-react'

const previewCategories = [
  {
    title: 'Profesiones',
    body: 'Diseños por oficio, rol o profesión.',
    image: '/assets/catalog/tazas-profesiones-bombero.jpg',
    icon: Wrench,
  },
  {
    title: 'Navidad',
    body: 'Mockups de temporada con fotos y frases.',
    image: '/assets/catalog/tazas-navidad.jpg',
    icon: CalendarDays,
  },
  {
    title: 'Familia y amor',
    body: 'Opciones para parejas, abuelos y fechas especiales.',
    image: '/assets/catalog/tazas-amor-collage.jpg',
    icon: Heart,
  },
]

export function ProductCategories() {
  return (
    <section id="productos" className="border-y border-black/5 bg-white py-14 md:py-18" aria-labelledby="catalog-preview-title">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.08em] text-mint">
              <ShoppingBag aria-hidden="true" size={18} />
              Catálogo
            </p>
            <h2 id="catalog-preview-title" className="mt-3 font-display text-[36px] font-black leading-[1.05] text-ink md:text-[52px]">
              Una tienda virtual para explorar todos los mockups.
            </h2>
          </div>
          <div>
            <p className="max-w-2xl text-base leading-7 text-ink/74">
              La vitrina completa vive en una página aparte para que el inicio cargue rápido. Allí
              puedes buscar por palabra clave, filtrar por producto u ocasión y cotizar cada diseño
              por WhatsApp.
            </p>
            <a
              href="/catalogo"
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] bg-ink px-6 text-sm font-extrabold text-white transition hover:bg-black"
            >
              Ver catálogo completo
              <ArrowRight aria-hidden="true" size={18} />
            </a>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {previewCategories.map((category) => {
            const Icon = category.icon
            return (
              <article key={category.title} className="overflow-hidden rounded-[8px] border border-black/10 bg-ivory">
                <div className="aspect-[4/3] bg-white p-2">
                  <img
                    src={category.image}
                    alt={`${category.title} en el catálogo de Creaciones DM`}
                    loading="lazy"
                    width="1200"
                    height="900"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex items-start gap-4 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-white text-ink shadow-sm">
                    <Icon aria-hidden="true" size={22} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-ink">{category.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-ink/70">{category.body}</p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
