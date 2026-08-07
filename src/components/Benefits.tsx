import { Headphones, Palette, Truck, Award } from 'lucide-react'

const benefits = [
  {
    title: 'Calidad que se nota',
    body: 'Materiales premium e impresión de alta definición.',
    icon: Award,
  },
  {
    title: 'Personalización total',
    body: 'Tu imaginas, nosotros lo hacemos realidad.',
    icon: Palette,
  },
  {
    title: 'Envíos a toda Colombia',
    body: 'Llegamos a donde estés, con seguridad.',
    icon: Truck,
  },
  {
    title: 'Asesoría cercana',
    body: 'Te acompañamos en todo el proceso.',
    icon: Headphones,
  },
]

export function Benefits() {
  return (
    <section className="bg-ivory py-8">
      <div className="section-shell grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit) => {
          const Icon = benefit.icon
          return (
            <article key={benefit.title} className="flex items-start gap-4 px-2 py-5">
              <Icon aria-hidden="true" size={42} strokeWidth={1.65} className="shrink-0 text-ink" />
              <div>
                <h2 className="text-base font-extrabold leading-5 text-ink">{benefit.title}</h2>
                <p className="mt-2 text-sm leading-6 text-ink/70">{benefit.body}</p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
