import { ArrowRight, Search } from 'lucide-react'
import { catalogSeo } from '../generated/catalogSeo'

function buildCatalogSearchUrl(term: string) {
  return `/catalogo?buscar=${encodeURIComponent(term)}`
}

export function CatalogSeoContent() {
  return (
    <section id="busquedas-populares" className="mt-14 border-t border-black/10 pt-12" aria-labelledby="catalog-seo-title">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.08em] text-mint">
            <Search aria-hidden="true" size={18} />
            Búsquedas populares
          </p>
          <h2 id="catalog-seo-title" className="mt-3 font-display text-[32px] font-black leading-tight text-ink md:text-[44px]">
            {catalogSeo.headline}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-ink/74">
            En Creaciones DM reunimos {catalogSeo.totalDesigns} diseños para mugs y tazas personalizadas:
            opciones aquí toma, profesiones, Navidad, amor, abuelos, familia, frases, nombres y fotos.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {catalogSeo.sections.map((section) => (
            <article key={section.title} className="rounded-[8px] border border-black/10 bg-ivory p-5">
              <h3 className="text-lg font-black leading-6 text-ink">{section.title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink/70">{section.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {section.terms.map((term) => (
                  <a
                    key={term}
                    href={buildCatalogSearchUrl(term)}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-ink/72 transition hover:bg-mint hover:text-ink"
                  >
                    {term}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {catalogSeo.featuredSearches.slice(0, 30).map((search) => (
          <a
            key={search.label}
            href={search.url}
            className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-black/10 bg-white px-3 text-xs font-extrabold text-ink/72 transition hover:border-mint hover:text-ink"
          >
            {search.label}
            <ArrowRight aria-hidden="true" size={14} />
          </a>
        ))}
      </div>
    </section>
  )
}
