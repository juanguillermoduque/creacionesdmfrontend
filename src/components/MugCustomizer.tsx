import '@google/model-viewer'
import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { CloudUpload, Cuboid, ImageOff, RotateCcw, Trash2 } from 'lucide-react'
import { buildWhatsAppUrl } from '../lib/whatsapp'
import { MugCanvas } from './MugCanvas'
import type { TextureTransform } from './MugCanvas'

type MugCustomizerProps = {
  isVisible: boolean
}

const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxSize = 25 * 1024 * 1024

export default function MugCustomizer({ isVisible }: MugCustomizerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const modelViewerRef = useRef<HTMLElement & { activateAR?: () => Promise<void> }>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [arMessage, setArMessage] = useState('')
  const [arSupported, setArSupported] = useState(false)
  const [transform, setTransform] = useState<TextureTransform>({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  })

  useEffect(() => {
    let mounted = true

    async function detectAr() {
      const xr = navigator.xr
      const webXrSupported = xr ? await xr.isSessionSupported('immersive-ar').catch(() => false) : false
      const mobileAr = /Android|iPhone|iPad/i.test(navigator.userAgent)
      if (mounted) setArSupported(webXrSupported || mobileAr)
    }

    detectAr()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl)
    }
  }, [imageUrl])

  function applyFile(file?: File) {
    if (!file) return

    if (!acceptedTypes.includes(file.type)) {
      setError('El archivo debe ser JPG, PNG o WebP.')
      return
    }

    if (file.size > maxSize) {
      setError('El archivo supera el máximo permitido de 25 MB.')
      return
    }

    setError('')
    setFileName(file.name)
    setTransform({ offsetX: 0, offsetY: 0, scale: 1 })
    setImageUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return URL.createObjectURL(file)
    })
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    applyFile(event.target.files?.[0])
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    applyFile(event.dataTransfer.files?.[0])
  }

  function resetDesign() {
    setTransform({ offsetX: 0, offsetY: 0, scale: 1 })
  }

  function removeDesign() {
    setImageUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return null
    })
    setFileName('')
    setError('')
    resetDesign()
    if (inputRef.current) inputRef.current.value = ''
  }

  async function openAr() {
    const isIos = /iPhone|iPad/i.test(navigator.userAgent)
    const isAndroid = /Android/i.test(navigator.userAgent)

    if (!arSupported) {
      setArMessage(
        'Este dispositivo no reporta soporte de realidad aumentada. Puedes seguir usando la vista 3D interactiva.',
      )
      return
    }

    try {
      await modelViewerRef.current?.activateAR?.()
      setArMessage(
        imageUrl
          ? 'AR abrió con el modelo base del mug. La textura personalizada permanece disponible en la vista 3D del sitio.'
          : 'AR abrió con el modelo base del mug.',
      )
    } catch {
      if (isAndroid) {
        const file = `${window.location.origin}/models/creaciones-dm-mug.glb`
        window.location.href = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
          file,
        )}&mode=ar_preferred&title=Creaciones%20DM%20Mug#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;end;`
        return
      }

      setArMessage(
        isIos
          ? 'iPhone requiere un archivo USDZ para AR Quick Look. Dejamos la vista 3D como alternativa y el modelo GLB para navegadores compatibles.'
          : 'No fue posible iniciar AR desde este navegador. La vista 3D interactiva sigue disponible.',
      )
    }
  }

  const quoteMessage = imageUrl
    ? 'Hola, Creaciones DM. Creé una vista previa de mi mug personalizado y quiero cotizarlo. Al abrir el chat adjuntaré mi diseño.'
    : 'Hola, Creaciones DM. Quiero cotizar un mug personalizado.'

  return (
    <>
      <div className="relative z-10 lg:col-span-2 lg:grid lg:grid-cols-[1.2fr_0.78fr] lg:gap-8">
        <div>
          <MugCanvas imageUrl={imageUrl} transform={transform} isVisible={isVisible} />

          <div className="mt-5 grid gap-4 rounded-[8px] border border-black/10 bg-white/80 p-4 backdrop-blur md:grid-cols-3">
            <label className="text-sm font-bold text-ink">
              Posición horizontal
              <input
                type="range"
                min="-0.38"
                max="0.38"
                step="0.01"
                value={transform.offsetX}
                onChange={(event) =>
                  setTransform((current) => ({ ...current, offsetX: Number(event.target.value) }))
                }
                className="mt-3 w-full accent-[#55c8b3]"
              />
            </label>
            <label className="text-sm font-bold text-ink">
              Posición vertical
              <input
                type="range"
                min="-0.3"
                max="0.3"
                step="0.01"
                value={transform.offsetY}
                onChange={(event) =>
                  setTransform((current) => ({ ...current, offsetY: Number(event.target.value) }))
                }
                className="mt-3 w-full accent-[#55c8b3]"
              />
            </label>
            <label className="text-sm font-bold text-ink">
              Escala
              <input
                type="range"
                min="0.45"
                max="2.2"
                step="0.01"
                value={transform.scale}
                onChange={(event) =>
                  setTransform((current) => ({ ...current, scale: Number(event.target.value) }))
                }
                className="mt-3 w-full accent-[#55c8b3]"
              />
            </label>
          </div>
        </div>

        <aside className="mt-8 lg:mt-0">
          <label
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click()
            }}
            className="flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-[8px] border-2 border-dashed border-mint bg-white/86 px-6 py-8 text-center transition hover:bg-white"
          >
            <CloudUpload aria-hidden="true" size={70} strokeWidth={1.5} className="text-[#55c8b3]" />
            <strong className="mt-5 text-lg font-extrabold text-ink">Sube tu diseño aquí</strong>
            <span className="mt-3 text-sm leading-6 text-ink/75">
              Arrastra tu archivo o haz clic para buscar.
              <br />
              JPG, PNG o WebP. Máx. 25 MB
            </span>
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleInput}
            />
          </label>

          {error ? (
            <p role="alert" className="mt-3 rounded-[8px] bg-[#fff2ef] px-4 py-3 text-sm font-semibold text-[#9b2f20]">
              {error}
            </p>
          ) : null}

          {fileName ? (
            <div className="mt-4 rounded-[8px] border border-black/10 bg-white px-4 py-3">
              <p className="text-sm font-bold text-ink">Diseño cargado</p>
              <p className="mt-1 truncate text-sm text-ink/70">{fileName}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex min-h-10 items-center gap-2 rounded-[8px] border border-black/10 px-3 text-sm font-bold text-ink hover:bg-ivory"
                >
                  <CloudUpload aria-hidden="true" size={17} />
                  Cambiar
                </button>
                <button
                  type="button"
                  onClick={resetDesign}
                  className="inline-flex min-h-10 items-center gap-2 rounded-[8px] border border-black/10 px-3 text-sm font-bold text-ink hover:bg-ivory"
                >
                  <RotateCcw aria-hidden="true" size={17} />
                  Restablecer
                </button>
                <button
                  type="button"
                  onClick={removeDesign}
                  className="inline-flex min-h-10 items-center gap-2 rounded-[8px] border border-black/10 px-3 text-sm font-bold text-ink hover:bg-ivory"
                >
                  <Trash2 aria-hidden="true" size={17} />
                  Eliminar
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex items-start gap-3 rounded-[8px] border border-black/10 bg-white px-4 py-3 text-sm text-ink/70">
              <ImageOff aria-hidden="true" className="mt-0.5 shrink-0" size={18} />
              <p>Mientras subes tu archivo, el mug muestra un diseño de ejemplo con la paleta de la marca.</p>
            </div>
          )}

          <button
            type="button"
            onClick={openAr}
            className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-[8px] bg-mint px-4 text-sm font-extrabold text-ink transition hover:bg-[#85d5c5]"
          >
            <Cuboid aria-hidden="true" size={24} />
            Ver en mi espacio
          </button>
          <p className="mt-3 text-center text-sm leading-6 text-ink/70">
            Usa la cámara de tu celular para verlo en tu entorno.
          </p>
          {arMessage ? <p className="mt-3 rounded-[8px] bg-white px-4 py-3 text-sm text-ink/75">{arMessage}</p> : null}

          <a
            href={buildWhatsAppUrl(quoteMessage)}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-[8px] bg-ink px-5 text-sm font-extrabold text-white transition hover:bg-black"
          >
            Cotizar mi mug
          </a>
          <p className="mt-2 text-center text-xs leading-5 text-ink/60">
            WhatsApp no adjunta archivos automáticamente; podrás adjuntar tu diseño al abrir el chat.
          </p>
        </aside>
      </div>

      <model-viewer
        ref={modelViewerRef}
        src="/models/creaciones-dm-mug.glb"
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        exposure="1"
        shadow-intensity="0.8"
        className="ar-model-viewer"
      />
    </>
  )
}
