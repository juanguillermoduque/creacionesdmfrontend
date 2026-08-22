import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, join, relative, resolve } from 'node:path'

const rootDir = process.cwd()
const contentDir = resolve(rootDir, 'contenido')
const workDir = resolve(rootDir, '.catalog-work')
const extractDir = join(workDir, 'extracted')
const assetDir = resolve(rootDir, 'public/assets/store')
const dataFile = resolve(rootDir, 'public/data/store-catalog.json')

const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.psd'])
const archiveExtensions = new Set(['.zip', '.rar', '.7z'])
const ignoredArchivePatterns = [/fuentes/i]
const ignoredEntryPatterns = [/thumbs\.db$/i, /__MACOSX/i, /\/fonts?\//i, /\/fuentes?\//i]
const previewMarker = ['moc', 'kup'].join('')
const titleNoisePattern = new RegExp(`\\b(copia|copy|${previewMarker}s?|mostrario|taza|tazas|png|jpg|psd|disenos?|pack)\\b`, 'gi')

if (existsSync(extractDir)) rmSync(extractDir, { recursive: true, force: true })
if (existsSync(assetDir)) rmSync(assetDir, { recursive: true, force: true })
mkdirSync(extractDir, { recursive: true })
mkdirSync(assetDir, { recursive: true })
mkdirSync(dirname(dataFile), { recursive: true })

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    encoding: options.encoding ?? 'utf8',
    maxBuffer: options.maxBuffer ?? 120 * 1024 * 1024,
    stdio: options.stdio ?? ['ignore', 'pipe', 'pipe'],
  })
}

function walk(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name)
    return entry.isDirectory() ? walk(fullPath) : [fullPath]
  })
}

function normalizeText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function slugify(value) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 82)
}

function titleize(value) {
  const clean = value
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(titleNoisePattern, ' ')
    .replace(/\b(navidad|collage|amor)\b/gi, (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase())
    .replace(/\s+/g, ' ')
    .trim()

  return clean || 'Diseño personalizado'
}

function collectionName(pathLike) {
  const normalized = normalizeText(pathLike)

  if (normalized.includes('pack-amor-collage')) return 'Pack amor collage'
  if (normalized.includes('abuelo')) return 'Colección abuelos'
  if (normalized.includes('navidad-4')) return 'Pack tazones Navidad #4'
  if (normalized.includes('navidad-5')) return 'Pack tazones Navidad #5'
  if (normalized.includes('3-tazas-navidad') || normalized.includes('navidadv3')) return 'Tres tazas Navidad'
  if (normalized.includes('tazas-profesiones')) return 'Tazas profesiones'
  if (normalized.includes('primera') || normalized.includes('segunda') || normalized.includes('tercera')) {
    return 'Packs profesiones especiales'
  }
  if (normalized.includes('cuarta') || normalized.includes('quinta')) return 'Packs profesiones especiales'
  if (normalized.includes('tazas-20260822') || normalized.includes('akkenstudio') || normalized.includes('/av')) {
    return 'Tazas ilustradas'
  }

  return 'Colección personalizada'
}

function classify(pathLike) {
  const normalized = normalizeText(pathLike)
  const fileName = basename(pathLike)

  let occasion = 'Diseños variados'
  if (normalized.includes('navidad')) occasion = 'Navidad'
  else if (normalized.includes('amor') || normalized.includes('collage')) occasion = 'Amor y pareja'
  else if (normalized.includes('abuelo') || normalized.includes('abuela')) occasion = 'Familia'
  else if (
    normalized.includes('profesion') ||
    normalized.includes('abogado') ||
    normalized.includes('chef') ||
    normalized.includes('medic') ||
    normalized.includes('bombero') ||
    normalized.includes('maestro') ||
    normalized.includes('piloto') ||
    normalized.includes('enfermer') ||
    normalized.includes('conductor') ||
    normalized.includes('motero') ||
    normalized.includes('carabinero') ||
    normalized.includes('barbero') ||
    normalized.includes('administrador')
  ) {
    occasion = 'Profesiones'
  } else if (normalized.includes('av') || normalized.includes('akkenstudio')) {
    occasion = 'Ilustrados'
  }

  const productType = normalized.includes('taza') || normalized.includes('mug') ? 'Mugs y tazas' : 'Diseños para sublimación'
  const collection = collectionName(pathLike)
  const sourceType = extname(pathLike).toLowerCase() === '.psd'
    ? 'Editable PSD'
    : normalized.includes(previewMarker) || normalized.includes('mostrario')
      ? 'Vista previa'
      : 'Diseño'
  const title = titleize(fileName)

  return { collection, occasion, productType, sourceType, title }
}

function listArchives(dir) {
  return walk(dir)
    .filter((file) => archiveExtensions.has(extname(file).toLowerCase()))
    .filter((file) => !ignoredArchivePatterns.some((pattern) => pattern.test(file)))
}

function archiveEntries(archive) {
  try {
    return run('bsdtar', ['-tf', archive])
      .split(/\r?\n/)
      .map((entry) => entry.trim())
      .filter((entry) => entry && entry !== '/')
  } catch {
    try {
      return run('7z', ['l', '-ba', archive])
        .split(/\r?\n/)
        .map((line) => {
          const match = line.match(/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+\S+\s+\d+\s+(?:\d+\s+)?(.+)$/)
          return match?.[1]?.trim()
        })
        .filter(Boolean)
    } catch {
      return []
    }
  }
}

function extractEntries(archive, entries, targetDir) {
  if (!entries.length) return
  const chunkSize = 80
  for (let index = 0; index < entries.length; index += chunkSize) {
    const chunk = entries.slice(index, index + chunkSize)
    try {
      run('bsdtar', ['-xf', archive, '-C', targetDir, ...chunk], {
        encoding: 'buffer',
        maxBuffer: 20 * 1024 * 1024,
      })
    } catch {
      run('bsdtar', ['-xf', archive, '-C', targetDir], {
        encoding: 'buffer',
        maxBuffer: 20 * 1024 * 1024,
      })
      return
    }
  }
}

function imageDimensions(file) {
  try {
    const output = run('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file])
    const width = Number(output.match(/pixelWidth:\s+(\d+)/)?.[1] ?? 0)
    const height = Number(output.match(/pixelHeight:\s+(\d+)/)?.[1] ?? 0)
    return { width, height }
  } catch {
    return { width: 0, height: 0 }
  }
}

function optimizeImage(source, output) {
  run(
    'sips',
    ['-s', 'format', 'jpeg', '-s', 'formatOptions', '78', '--resampleHeightWidthMax', '1050', source, '--out', output],
    { maxBuffer: 10 * 1024 * 1024 },
  )
}

const processedArchives = new Set()
const queue = listArchives(contentDir)
const extractedImages = []

while (queue.length) {
  const archive = queue.shift()
  const archiveKey = resolve(archive)
  if (processedArchives.has(archiveKey)) continue
  processedArchives.add(archiveKey)

  const entries = archiveEntries(archive).filter((entry) => !ignoredEntryPatterns.some((pattern) => pattern.test(entry)))
  const images = entries.filter((entry) => imageExtensions.has(extname(entry).toLowerCase()))
  const nestedArchives = entries.filter((entry) => archiveExtensions.has(extname(entry).toLowerCase()))
  const targetDir = join(extractDir, slugify(relative(contentDir, archive) || basename(archive)))

  mkdirSync(targetDir, { recursive: true })
  extractEntries(archive, [...images, ...nestedArchives], targetDir)

  for (const file of walk(targetDir)) {
    const ext = extname(file).toLowerCase()
    if (archiveExtensions.has(ext) && !processedArchives.has(resolve(file))) {
      queue.push(file)
      continue
    }

    if (!imageExtensions.has(ext)) continue
    const stats = statSync(file)
    if (stats.size < 1) continue
    const dimensions = imageDimensions(file)
    if (!dimensions.width || !dimensions.height) continue

    extractedImages.push(file)
  }
}

const unique = new Map()
for (const file of extractedImages) {
  const relativeName = relative(extractDir, file)
  const key = normalizeText(relativeName).replace(/\.[a-z0-9]+$/, '')
  if (!unique.has(key)) unique.set(key, file)
}

const items = []
let itemIndex = 0

for (const file of [...unique.values()].sort((a, b) => relative(extractDir, a).localeCompare(relative(extractDir, b)))) {
  const relativeName = relative(extractDir, file)
  const classification = classify(relativeName)
  const id = `${slugify(classification.title)}-${itemIndex + 1}`
  const outputName = `${id}.jpg`
  const output = join(assetDir, outputName)

  try {
    optimizeImage(file, output)
  } catch {
    continue
  }

  const optimizedDimensions = imageDimensions(output)
  itemIndex += 1
  items.push({
    id,
    title: classification.title,
    productType: classification.productType,
    occasion: classification.occasion,
    collection: classification.collection,
    sourceType: classification.sourceType,
    image: `/assets/store/${outputName}`,
    alt: `${classification.title} para ${classification.productType.toLowerCase()}`,
    width: optimizedDimensions.width,
    height: optimizedDimensions.height,
  })
}

const collections = [...new Set(items.map((item) => item.collection))].sort()
const productTypes = [...new Set(items.map((item) => item.productType))].sort()
const occasions = [...new Set(items.map((item) => item.occasion))].sort()

writeFileSync(
  dataFile,
  `${JSON.stringify({ items, productTypes, occasions, collections }, null, 2)}\n`,
)

console.log(
  JSON.stringify(
    {
      archivesProcessed: processedArchives.size,
      imagesFound: extractedImages.length,
      itemsGenerated: items.length,
      productTypes,
      occasions,
      collections: collections.length,
    },
    null,
    2,
  ),
)
