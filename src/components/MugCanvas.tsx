import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CanvasTexture,
  CatmullRomCurve3,
  DoubleSide,
  Group,
  SRGBColorSpace,
  Texture,
  TubeGeometry,
  Vector3,
} from 'three'

export type TextureTransform = {
  offsetX: number
  offsetY: number
  scale: number
}

type MugCanvasProps = {
  imageUrl: string | null
  transform: TextureTransform
  isVisible: boolean
}

type PrintMode = 'front' | 'wrap'

type MugTextureResult = {
  mode: PrintMode
  texture: Texture
}

function drawBrushPreview(context: CanvasRenderingContext2D, width: number, height: number) {
  context.save()
  context.translate(width * 0.5, height * 0.5)
  context.rotate(-0.16)
  context.fillStyle = '#9EDFD1'
  context.globalAlpha = 0.82
  context.fillRect(-520, -56, 1040, 120)
  context.fillStyle = '#F4E59A'
  context.globalAlpha = 0.75
  context.fillRect(-420, -180, 760, 92)
  context.fillStyle = '#F3BFAF'
  context.globalAlpha = 0.55
  context.fillRect(-380, 116, 760, 92)
  context.restore()
  context.globalAlpha = 1
}

function drawContainedImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  area: { x: number; y: number; width: number; height: number },
  transform: TextureTransform,
  horizontalFactor: number,
) {
  const ratio = Math.min(
    (area.width * transform.scale) / image.width,
    (area.height * transform.scale) / image.height,
  )
  const drawWidth = image.width * ratio
  const drawHeight = image.height * ratio
  const x = area.x + area.width * (0.5 + transform.offsetX * horizontalFactor) - drawWidth / 2
  const y = area.y + area.height * (0.5 - transform.offsetY) - drawHeight / 2

  context.drawImage(image, x, y, drawWidth, drawHeight)
}

function drawCoveredImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  area: { x: number; y: number; width: number; height: number },
  transform: TextureTransform,
) {
  const ratio = Math.max(
    (area.width * transform.scale) / image.width,
    (area.height * transform.scale) / image.height,
  )
  const drawWidth = image.width * ratio
  const drawHeight = image.height * ratio
  const x = area.x + area.width * (0.5 + transform.offsetX * 0.35) - drawWidth / 2
  const y = area.y + area.height * (0.5 - transform.offsetY) - drawHeight / 2

  context.drawImage(image, x, y, drawWidth, drawHeight)
}

function makeTexture(image: HTMLImageElement | null, transform: TextureTransform): MugTextureResult | null {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const context = canvas.getContext('2d')
  if (!context) return null

  context.clearRect(0, 0, canvas.width, canvas.height)

  const mode: PrintMode = image && image.width / image.height >= 1.55 ? 'wrap' : 'front'

  if (!image) {
    drawBrushPreview(context, canvas.width, canvas.height)
  } else if (mode === 'wrap') {
    context.save()
    context.beginPath()
    context.roundRect(canvas.width * 0.01, canvas.height * 0.04, canvas.width * 0.98, canvas.height * 0.92, 30)
    context.clip()
    drawCoveredImage(
      context,
      image,
      {
        x: canvas.width * 0.01,
        y: canvas.height * 0.04,
        width: canvas.width * 0.98,
        height: canvas.height * 0.92,
      },
      transform,
    )
    context.restore()
  } else {
    context.save()
    context.beginPath()
    context.roundRect(canvas.width * 0.08, canvas.height * 0.13, canvas.width * 0.84, canvas.height * 0.74, 48)
    context.clip()
    drawContainedImage(
      context,
      image,
      {
        x: canvas.width * 0.08,
        y: canvas.height * 0.13,
        width: canvas.width * 0.84,
        height: canvas.height * 0.74,
      },
      transform,
      0.7,
    )
    context.restore()
  }

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true
  return { mode, texture }
}

function useMugTexture(imageUrl: string | null, transform: TextureTransform) {
  const textureRef = useRef<Texture | null>(null)
  const [textureResult, setTextureResult] = useState<MugTextureResult | null>(() => makeTexture(null, transform))
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    setFailed(false)

    function commit(nextTextureResult: MugTextureResult | null) {
      if (!nextTextureResult || cancelled) {
        nextTextureResult?.texture.dispose()
        return
      }

      textureRef.current?.dispose()
      textureRef.current = nextTextureResult.texture
      setTextureResult(nextTextureResult)
      setLoading(false)
    }

    if (!imageUrl) {
      setLoading(false)
      commit(makeTexture(null, transform))
      return () => {
        cancelled = true
      }
    }

    setLoading(true)
    const image = new Image()
    image.onload = () => commit(makeTexture(image, transform))
    image.onerror = () => {
      setLoading(false)
      setFailed(true)
    }
    image.src = imageUrl

    return () => {
      cancelled = true
    }
  }, [imageUrl, transform])

  useEffect(() => {
    return () => textureRef.current?.dispose()
  }, [])

  return { texture: textureResult?.texture ?? null, mode: textureResult?.mode ?? 'front', loading, failed }
}

function MugModel({
  mode,
  texture,
  autoRotate,
}: {
  mode: PrintMode
  texture: Texture | null
  autoRotate: boolean
}) {
  const groupRef = useRef<Group | null>(null)
  const handleGeometry = useMemo(() => {
    const curve = new CatmullRomCurve3([
      new Vector3(1.08, 0.44, 0.03),
      new Vector3(1.52, 0.35, 0.07),
      new Vector3(1.76, 0, 0.08),
      new Vector3(1.54, -0.38, 0.06),
      new Vector3(1.06, -0.5, 0.02),
    ])

    return new TubeGeometry(curve, 80, 0.052, 20, false)
  }, [])

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) groupRef.current.rotation.y += delta * 0.32
  })

  useEffect(() => {
    return () => handleGeometry.dispose()
  }, [handleGeometry])

  return (
    <group ref={groupRef} rotation={[0.08, -0.32, 0]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.04, 0.92, 1.5, 128, 1, true]} />
        <meshStandardMaterial color="#ffffff" roughness={0.36} metalness={0} side={DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry
          args={
            mode === 'wrap'
              ? [1.049, 0.929, 1.34, 128, 1, true]
              : [1.048, 0.928, 1.02, 96, 1, true, -0.95, 1.9]
          }
        />
        <meshStandardMaterial
          map={texture ?? undefined}
          transparent
          roughness={0.42}
          metalness={0}
          side={DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0.76, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.98, 0.055, 24, 128]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.73, 0]}>
        <cylinderGeometry args={[0.92, 0.82, 0.045, 96]} />
        <meshStandardMaterial color="#f4f4f2" roughness={0.54} />
      </mesh>
      <mesh position={[0, -0.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.78, 0.055, 20, 96]} />
        <meshStandardMaterial color="#ffffff" roughness={0.45} />
      </mesh>
      <group>
        <mesh geometry={handleGeometry}>
          <meshStandardMaterial color="#fafafa" roughness={0.42} />
        </mesh>
        <mesh position={[1.08, 0.44, 0.03]} scale={[1.15, 0.78, 0.72]}>
          <sphereGeometry args={[0.08, 24, 16]} />
          <meshStandardMaterial color="#fafafa" roughness={0.42} />
        </mesh>
        <mesh position={[1.06, -0.5, 0.02]} scale={[1.15, 0.78, 0.72]}>
          <sphereGeometry args={[0.08, 24, 16]} />
          <meshStandardMaterial color="#fafafa" roughness={0.42} />
        </mesh>
      </group>
    </group>
  )
}

export function MugCanvas({ imageUrl, transform, isVisible }: MugCanvasProps) {
  const { texture, mode, loading, failed } = useMugTexture(imageUrl, transform)

  return (
    <div className="relative h-[430px] overflow-hidden rounded-[8px] bg-white/55 md:h-[560px]">
      <Canvas
        frameloop={isVisible ? 'always' : 'demand'}
        camera={{ position: [0, 0.22, 5.7], fov: 34 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#ffffff']} />
        <ambientLight intensity={1.35} />
        <directionalLight position={[4, 5, 5]} intensity={1.5} />
        <spotLight position={[-4, 4, 3]} intensity={0.7} angle={0.45} penumbra={0.8} />
        <MugModel mode={mode} texture={texture} autoRotate={!imageUrl} />
        <mesh position={[0, -0.82, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.65, 80]} />
          <meshBasicMaterial transparent opacity={0.08} color="#191919" />
        </mesh>
        <OrbitControls
          enablePan={false}
          minDistance={3.2}
          maxDistance={5.4}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 1.75}
          makeDefault
        />
      </Canvas>

      {loading ? (
        <div className="absolute inset-x-4 top-4 rounded-[8px] bg-white/90 px-4 py-3 text-center text-sm font-bold text-ink shadow-sm">
          Aplicando tu diseño al mug...
        </div>
      ) : null}
      {failed ? (
        <div className="absolute inset-x-4 top-4 rounded-[8px] bg-[#fff2ef] px-4 py-3 text-center text-sm font-bold text-[#9b2f20] shadow-sm">
          No pudimos cargar la imagen en la textura. Prueba con otro archivo.
        </div>
      ) : null}
      {imageUrl && !loading && !failed ? (
        <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-extrabold text-ink shadow-sm">
          {mode === 'wrap' ? 'Modo envolvente' : 'Modo frontal'}
        </div>
      ) : null}
    </div>
  )
}
