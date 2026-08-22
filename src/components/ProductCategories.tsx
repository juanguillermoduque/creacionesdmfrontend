import { CalendarDays, Coffee, Heart, Search, Sparkles, UsersRound, Wrench } from 'lucide-react'
import { useMemo, useState } from 'react'
import { openWhatsApp } from '../lib/whatsapp'

type CatalogGroup = 'todos' | 'profesiones' | 'temporada' | 'familia' | 'editable'

type CatalogItem = {
  title: string
  group: Exclude<CatalogGroup, 'todos'>
  count: string
  image: string
  alt: string
  description: string
  tags: string[]
  source: string
  message: string
}

const filters: { id: CatalogGroup; label: string }[] = [
  { id: 'todos', label: 'Todo' },
  { id: 'profesiones', label: 'Profesiones' },
  { id: 'temporada', label: 'Temporada' },
  { id: 'familia', label: 'Familia y amor' },
  { id: 'editable', label: 'Editables' },
]

const catalogItems: CatalogItem[] = [
  {
    title: 'Tazas por profesiones',
    group: 'profesiones',
    count: '445 diseños detectados',
    image: '/assets/catalog/tazas-profesiones-abogado.jpg',
    alt: 'Mug personalizado para abogado con diseño profesional',
    description:
      'Colección amplia para abogados, chefs, médicos, administradores, barberos, docentes, bomberos y muchos oficios más.',
    tags: ['PSD', 'JPG/PNG', 'Por oficio'],
    source: 'Tazas Profesiones 01 al 445',
    message:
      'Hola, Creaciones DM. Quiero ver el catálogo de tazas personalizadas por profesiones y cotizar una opción.',
  },
  {
    title: 'Oficios especiales',
    group: 'profesiones',
    count: 'Packs por rol',
    image: '/assets/catalog/tazas-profesiones-bombero.jpg',
    alt: 'Diseño de taza personalizada para bombero',
    description:
      'Packs especiales para maestro, motero, piloto, enfermería, terapeuta de lenguaje, carabinero, conductor y otros roles.',
    tags: ['Packs', 'Profesiones', 'Personalizable'],
    source: 'PRIMERA, SEGUNDA, TERCERA, CUARTA y QUINTA',
    message:
      'Hola, Creaciones DM. Quiero cotizar un mug personalizado para un oficio o profesión especial.',
  },
  {
    title: 'Navidad personalizada',
    group: 'temporada',
    count: '90+ piezas y plantillas',
    image: '/assets/catalog/tazas-navidad.jpg',
    alt: 'Mockup de mugs personalizados de Navidad con foto familiar',
    description:
      'Diseños navideños para fotos familiares, nombres, frases, detalles empresariales y regalos de temporada.',
    tags: ['Navidad', 'Fotos', 'Temporada'],
    source: 'PACK TAZONES NAVIDAD #4, #5 y 3 tazas navidad',
    message:
      'Hola, Creaciones DM. Quiero ver opciones de mugs navideños personalizados.',
  },
  {
    title: 'Amor y collage',
    group: 'familia',
    count: '15 diseños editables',
    image: '/assets/catalog/tazas-amor-collage.jpg',
    alt: 'Diseño de taza personalizada de amor y collage con fotos',
    description:
      'Plantillas para parejas, aniversarios, fechas especiales y regalos con varias fotos en composición tipo collage.',
    tags: ['Collage', 'Parejas', 'Fotos'],
    source: 'PACK AMOR COLLAGE',
    message:
      'Hola, Creaciones DM. Quiero cotizar una taza personalizada de amor o collage con fotos.',
  },
  {
    title: 'Abuelos y familia',
    group: 'familia',
    count: '10 diseños base',
    image: '/assets/catalog/tazas-abuelos.jpg',
    alt: 'Diseño de taza personalizada para abuelos',
    description:
      'Opciones emotivas para abuelos, familia y detalles con mensajes cercanos para fechas especiales.',
    tags: ['Familia', 'Abuelos', 'Regalos'],
    source: 'ABUELOS',
    message:
      'Hola, Creaciones DM. Quiero ver diseños de tazas personalizadas para abuelos o familia.',
  },
  {
    title: 'Tazas ilustradas y vectoriales',
    group: 'editable',
    count: '40+ diseños multi-formato',
    image: '/assets/catalog/tazas-ilustradas.jpg',
    alt: 'Diseño ilustrado para taza personalizada',
    description:
      'Recursos en PNG, SVG, AI, CDR, EPS, PDF y PSD para adaptar estilos gráficos a diferentes ideas de personalización.',
    tags: ['Vector', 'PNG', 'Diseño adaptable'],
    source: 'tazas-20260822T015227Z-1-001',
    message:
      'Hola, Creaciones DM. Quiero explorar diseños ilustrados para una taza personalizada.',
  },
]

const groupIcon = {
  profesiones: Wrench,
  temporada: CalendarDays,
  familia: Heart,
  editable: Sparkles,
}

export function ProductCategories() {
  const [activeFilter, setActiveFilter] = useState<CatalogGroup>('todos')
  const visibleItems = useMemo(
    () => catalogItems.filter((item) => activeFilter === 'todos' || item.group === activeFilter),
    [activeFilter],
  )

  return (
    <section id="productos" className="border-y border-black/5 bg-white py-14 md:py-18" aria-labelledby="catalog-title">
      <div className="section-shell">
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.08em] text-mint">
              <Coffee aria-hidden="true" size={18} />
              Catálogo clasificado
            </p>
            <h2 id="catalog-title" className="mt-3 font-display text-[36px] font-black leading-[1.05] text-ink md:text-[52px]">
              Diseños listos para convertirlos en regalos personalizados.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-ink/74">
            Curamos los packs, mockups y diseños disponibles en colecciones fáciles de explorar.
            Esta primera selección organiza lo más útil como catálogo visual para cotizar rápido
            por WhatsApp.
          </p>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Filtrar catálogo">
          {filters.map((filter) => {
            const selected = activeFilter === filter.id
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                aria-pressed={selected}
                className={`shrink-0 rounded-[8px] border px-4 py-2 text-sm font-extrabold transition ${
                  selected
                    ? 'border-ink bg-ink text-white'
                    : 'border-black/10 bg-ivory text-ink hover:border-mint hover:bg-white'
                }`}
              >
                {filter.label}
              </button>
            )
          })}
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleItems.map((item) => {
            const Icon = groupIcon[item.group]
            return (
              <article key={item.title} className="overflow-hidden rounded-[8px] border border-black/10 bg-ivory">
                <div className="aspect-[4/3] overflow-hidden bg-white p-2">
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    width="1200"
                    height="900"
                    className="h-full w-full object-contain transition duration-300 hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black leading-6 text-ink">{item.title}</h3>
                      <p className="mt-1 text-sm font-extrabold text-mint">{item.count}</p>
                    </div>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-white text-ink shadow-sm">
                      <Icon aria-hidden="true" size={22} strokeWidth={1.8} />
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-ink/72">{item.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-ink/72">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-xs font-semibold leading-5 text-ink/55">Colección base: {item.source}</p>
                  <button
                    type="button"
                    onClick={() => openWhatsApp(item.message)}
                    className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-mint px-4 text-sm font-extrabold text-ink transition hover:bg-[#85d5c5]"
                  >
                    <Search aria-hidden="true" size={18} />
                    Consultar esta categoría
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[8px] border border-black/10 bg-white px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-ivory text-ink">
              <UsersRound aria-hidden="true" size={24} strokeWidth={1.8} />
            </span>
            <div>
              <h3 className="text-lg font-black text-ink">¿Buscas algo muy específico?</h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-ink/70">
                El archivo local trae muchos editables, mockups y recursos por profesión o temporada.
                Podemos buscar por nombre, oficio, fecha especial o estilo y enviarte opciones.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              openWhatsApp('Hola, Creaciones DM. Quiero buscar un diseño específico dentro del catálogo de productos personalizados.')
            }
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-[8px] bg-ink px-5 text-sm font-extrabold text-white transition hover:bg-black"
          >
            Pedir búsqueda
          </button>
        </div>
      </div>
    </section>
  )
}
