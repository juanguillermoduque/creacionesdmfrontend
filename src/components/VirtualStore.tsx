import { Filter, MessageCircle, Search, ShoppingBag, Sparkles, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { openWhatsApp } from '../lib/whatsapp'
import { CatalogSeoContent } from './CatalogSeoContent'

const initialVisibleCount = 36
const visibleCountStep = 36

type StoreCatalogItem = {
  id: string
  title: string
  productType: string
  occasion: string
  collection: string
  sourceType: string
  image: string
  alt: string
  width: number
  height: number
}

type StoreCatalogData = {
  items: StoreCatalogItem[]
  productTypes: string[]
  occasions: string[]
  collections: string[]
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function buildMessage(item: StoreCatalogItem) {
  return `Hola, Creaciones DM. Quiero cotizar este diseño del catálogo: ${item.title}. Tipo: ${item.productType}. Ocasión: ${item.occasion}.`
}

const primaryProductType = 'Mugs y tazas'

function getInitialSearchParam(key: string, fallback: string) {
  if (typeof window === 'undefined') return fallback

  return new URLSearchParams(window.location.search).get(key) ?? fallback
}

export function VirtualStore() {
  const [catalogData, setCatalogData] = useState<StoreCatalogData>({
    items: [],
    productTypes: [],
    occasions: [],
    collections: [],
  })
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState(() => getInitialSearchParam('buscar', ''))
  const [productType, setProductType] = useState(primaryProductType)
  const [occasion, setOccasion] = useState(() => getInitialSearchParam('ocasion', 'Todas'))
  const [collection, setCollection] = useState(() => getInitialSearchParam('coleccion', 'Todas'))
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount)

  useEffect(() => {
    let mounted = true

    fetch('/data/store-catalog.json')
      .then((response) => response.json())
      .then((data: StoreCatalogData) => {
        if (!mounted) return
        setCatalogData(data)
        setLoading(false)
      })
      .catch(() => {
        if (!mounted) return
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const filteredItems = useMemo(() => {
    const search = normalize(query.trim())

    return catalogData.items.filter((item) => {
      const matchesProductType = productType === 'Todos' || item.productType === productType
      const matchesOccasion = occasion === 'Todas' || item.occasion === occasion
      const matchesCollection = collection === 'Todas' || item.collection === collection
      const matchesSearch =
        !search ||
        normalize(`${item.title} ${item.productType} ${item.occasion} ${item.collection}`).includes(search)

      return matchesProductType && matchesOccasion && matchesCollection && matchesSearch
    })
  }, [catalogData.items, collection, occasion, productType, query])

  const visibleItems = filteredItems.slice(0, visibleCount)
  const hasFilters = query || occasion !== 'Todas' || collection !== 'Todas'

  function resetFilters() {
    setQuery('')
    setProductType(primaryProductType)
    setOccasion('Todas')
    setCollection('Todas')
    setVisibleCount(initialVisibleCount)
  }

  function updateProductType(value: string) {
    setProductType(value)
    setVisibleCount(initialVisibleCount)
  }

  function updateOccasion(value: string) {
    setOccasion(value)
    setVisibleCount(initialVisibleCount)
  }

  function updateCollection(value: string) {
    setCollection(value)
    setVisibleCount(initialVisibleCount)
  }

  function updateQuery(value: string) {
    setQuery(value)
    setVisibleCount(initialVisibleCount)
  }

  return (
    <section className="bg-white pb-16 pt-[120px] md:pb-20" aria-labelledby="catalog-title">
      <div className="section-shell">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.08em] text-mint">
              <ShoppingBag aria-hidden="true" size={18} />
              Tienda virtual
            </p>
            <h1 id="catalog-title" className="mt-3 font-display text-[38px] font-black leading-[1.05] text-ink md:text-[58px]">
              Explora todos los diseños disponibles.
            </h1>
          </div>
          <p className="max-w-2xl text-base leading-7 text-ink/74">
            Organizamos el material de la carpeta contenido en una vitrina scrolleable. Filtra por
            ocasión, colección o palabra clave y cotiza por WhatsApp el diseño que te guste.
          </p>
        </div>

        <div className="mt-8 grid gap-3 rounded-[8px] border border-black/10 bg-ivory p-4 md:grid-cols-2 lg:grid-cols-[1fr_0.42fr_0.42fr_0.42fr_auto] lg:items-end">
          <label className="block">
            <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em] text-ink/60">Buscar</span>
            <span className="relative block">
              <Search aria-hidden="true" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/45" />
              <input
                type="search"
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                placeholder="Ej: abogado, navidad, abuelos..."
                className="h-11 w-full rounded-[8px] border border-black/10 bg-white pl-10 pr-3 text-sm font-semibold text-ink outline-none transition placeholder:text-ink/45 focus:border-mint"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em] text-ink/60">Producto</span>
            <select
              value={productType}
              onChange={(event) => updateProductType(event.target.value)}
              className="h-11 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm font-extrabold text-ink outline-none transition focus:border-mint"
            >
              {(catalogData.productTypes.length ? catalogData.productTypes : [primaryProductType]).map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em] text-ink/60">Ocasión</span>
            <select
              value={occasion}
              onChange={(event) => updateOccasion(event.target.value)}
              className="h-11 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm font-extrabold text-ink outline-none transition focus:border-mint"
            >
              <option>Todas</option>
              {catalogData.occasions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em] text-ink/60">Colección</span>
            <select
              value={collection}
              onChange={(event) => updateCollection(event.target.value)}
              className="h-11 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm font-extrabold text-ink outline-none transition focus:border-mint"
            >
              <option>Todas</option>
              {catalogData.collections.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={resetFilters}
            disabled={!hasFilters}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-black/10 bg-white px-4 text-sm font-extrabold text-ink transition hover:border-mint disabled:cursor-not-allowed disabled:opacity-45"
          >
            <X aria-hidden="true" size={17} />
            Limpiar
          </button>
        </div>

        <div className="mt-5 flex flex-col justify-between gap-3 text-sm font-bold text-ink/68 md:flex-row md:items-center">
          <span className="inline-flex items-center gap-2">
            <Filter aria-hidden="true" size={17} />
            Mostrando {visibleItems.length} de {filteredItems.length} diseños
          </span>
          <span>{catalogData.items.length} piezas optimizadas desde packs, diseños e imágenes fuente.</span>
        </div>

        {loading ? (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Cargando catálogo">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="h-[360px] animate-pulse rounded-[8px] border border-black/10 bg-ivory" />
            ))}
          </div>
        ) : visibleItems.length ? (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleItems.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-[8px] border border-black/10 bg-ivory">
                <div className="aspect-square overflow-hidden bg-white p-2">
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    width={item.width}
                    height={item.height}
                    className="h-full w-full object-contain transition duration-300 hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="line-clamp-2 min-h-12 text-base font-black leading-6 text-ink">{item.title}</h2>
                      <p className="mt-1 text-xs font-extrabold text-mint">{item.occasion}</p>
                    </div>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-ink/70">
                      {item.sourceType}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-ink/64">
                      {item.productType}
                    </span>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-ink/64">
                      {item.collection}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openWhatsApp(buildMessage(item))}
                    className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-[8px] bg-mint px-3 text-sm font-extrabold text-ink transition hover:bg-[#85d5c5]"
                  >
                    <MessageCircle aria-hidden="true" size={17} />
                    Cotizar diseño
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-7 rounded-[8px] border border-black/10 bg-ivory px-5 py-8 text-center">
            <Sparkles aria-hidden="true" size={34} className="mx-auto text-mint" />
            <h2 className="mt-3 text-xl font-black text-ink">No encontramos diseños con esos filtros</h2>
            <p className="mt-2 text-sm leading-6 text-ink/70">Prueba con otra palabra clave u ocasión.</p>
          </div>
        )}

        {visibleItems.length < filteredItems.length ? (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((current) => current + visibleCountStep)}
              className="inline-flex min-h-12 items-center justify-center rounded-[8px] bg-ink px-6 text-sm font-extrabold text-white transition hover:bg-black"
            >
              Ver más diseños
            </button>
          </div>
        ) : null}

        <CatalogSeoContent />
      </div>
    </section>
  )
}
