import {
  Armchair,
  Badge,
  ChevronRight,
  Coffee,
  CupSoda,
  MoreHorizontal,
  Puzzle,
  Shirt,
  ShoppingBag,
} from 'lucide-react'
import { siteConfig } from '../config/site'
import { openWhatsApp } from '../lib/whatsapp'

const icons = [Coffee, Shirt, CupSoda, ShoppingBag, Badge, Armchair, Puzzle, MoreHorizontal]

export function ProductCategories() {
  return (
    <section id="productos" aria-label="Categorías de productos" className="border-y border-black/5 bg-white/70">
      <div className="section-shell flex items-stretch gap-2 overflow-x-auto py-5">
        {siteConfig.categories.map((category, index) => {
          const Icon = icons[index]
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => openWhatsApp(category.message)}
              className="group flex min-w-[118px] flex-1 flex-col items-center justify-center gap-2 rounded-[8px] px-3 py-3 text-center transition hover:bg-ivory"
            >
              <Icon aria-hidden="true" size={36} strokeWidth={1.55} className="text-ink" />
              <span className="text-sm font-bold leading-tight text-ink">{category.label}</span>
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => openWhatsApp(siteConfig.categories.at(-1)?.message ?? siteConfig.defaultMessage)}
          aria-label="Consultar más productos"
          className="my-auto hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-mint text-white transition hover:bg-[#85d5c5] md:flex"
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
