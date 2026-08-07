import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Box, CloudUpload, RotateCw, ScanLine } from 'lucide-react'

const MugCustomizer = lazy(() => import('./MugCustomizer'))

export function MugCustomizerSection() {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '160px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const steps = [
    {
      title: 'Sube tu diseño',
      body: 'JPG, PNG o WebP',
      icon: CloudUpload,
    },
    {
      title: 'Ajusta y gira',
      body: 'Escala, posiciona y rota en 3D',
      icon: RotateCw,
    },
    {
      title: 'Míralo en tu espacio',
      body: 'Activa la realidad aumentada',
      icon: Box,
    },
  ]

  return (
    <section id="personaliza" ref={ref} className="relative overflow-hidden py-16 md:py-20">
      <div className="paint-swoop mint-swoop -left-20 top-0 h-[36rem] w-[30rem]" />

      <div className="section-shell relative grid gap-8 lg:grid-cols-[0.72fr_1.4fr_0.88fr]">
        <div className="relative z-10">
          <h2 className="font-display text-[36px] font-black leading-[1.05] text-ink md:text-[48px]">
            Pruébalo antes de pedirlo
          </h2>
          <p className="mt-5 max-w-sm text-base leading-7 text-ink">
            Sube tu imagen o diseño y míralo aplicado sobre nuestro mug. Ajústalo, gíralo y
            visualízalo en tu espacio con realidad aumentada.
          </p>

          <div className="mt-10 space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.title} className="grid grid-cols-[44px_56px_1fr] items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mint text-xl font-black text-white">
                    {index + 1}
                  </span>
                  <span className="flex h-14 w-14 items-center justify-center rounded-[8px] bg-white text-ink shadow-sm">
                    <Icon aria-hidden="true" size={27} strokeWidth={1.8} />
                  </span>
                  <span>
                    <strong className="block text-sm font-extrabold text-ink">{step.title}</strong>
                    <span className="block text-xs leading-5 text-ink/70">{step.body}</span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <Suspense
          fallback={
            <div className="flex min-h-[500px] items-center justify-center rounded-[8px] bg-white text-sm font-bold text-ink/70">
              Preparando personalizador 3D...
            </div>
          }
        >
          <MugCustomizer isVisible={visible} />
        </Suspense>

        <div className="hidden lg:block" aria-hidden="true">
          <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-ink/70">
            <ScanLine size={16} />
            Gira el mug
          </div>
        </div>
      </div>
    </section>
  )
}
