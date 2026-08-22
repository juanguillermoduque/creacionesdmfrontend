import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const catalogPath = resolve(process.cwd(), 'public/data/store-catalog.json')
const publicOutputPath = resolve(process.cwd(), 'public/data/catalog-seo.json')
const tsOutputPath = resolve(process.cwd(), 'src/generated/catalogSeo.ts')

const stopWords = new Set(
  [
    'ab',
    'al',
    'con',
    'coleccion',
    'de',
    'del',
    'diseno',
    'disenos',
    'el',
    'en',
    'es',
    'fuente',
    'imagen',
    'imagenes',
    'la',
    'las',
    'los',
    'mi',
    'mug',
    'mugs',
    'nav',
    'o',
    'pack',
    'packnavidad',
    'packs',
    'para',
    'pieza',
    'piezas',
    'por',
    'se',
    'sin',
    'su',
    'sublimacion',
    'taza',
    'tazas',
    'toma',
    'tres',
    'tu',
    'un',
    'una',
    'unas',
    'unos',
    'y',
  ],
)

const blockedTerms = new Set([
  'akkenstudio',
  'cliente',
  'fitnees',
  'gendarmeria',
  'mejor',
  'sipcologa',
])

const preferredTerms = [
  'aqui toma',
  'profesiones',
  'ingeniero',
  'chef',
  'policia',
  'profesor',
  'maestro',
  'mecanico',
  'fotografo',
  'tecnico',
  'musico',
  'enfermeria',
  'abogada',
  'administrador',
  'dentista',
  'bombero',
  'taxista',
  'barbero',
  'militar',
  'contador',
  'veterinario',
  'doctor',
  'enfermera',
  'secretaria',
  'manicurista',
  'abogado',
  'sistemas',
  'ingeniera',
  'odontologo',
  'repostero',
  'nutricionista',
  'estudiante',
  'navidad',
  'amor',
  'pareja',
  'abuelos',
  'familia',
  'collage',
  'fotos',
  'nombres',
  'frases',
]

function normalize(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function toDisplayTerm(term) {
  const replacements = {
    aqui: 'aquí',
    mecanico: 'mecánico',
    fotografo: 'fotógrafo',
    tecnico: 'técnico',
    musico: 'músico',
    policia: 'policía',
    odontologo: 'odontólogo',
    enfermeria: 'enfermería',
    electronico: 'electrónico',
    albanil: 'albañil',
    mama: 'mamá',
  }

  return term
    .split(' ')
    .map((word) => replacements[word] ?? word)
    .join(' ')
}

function countTerms(items) {
  const counts = new Map()

  for (const item of items) {
    const text = normalize(`${item.title} ${item.productType} ${item.occasion} ${item.collection}`)

    for (const token of text.match(/[a-zñ]{3,}/g) ?? []) {
      if (!stopWords.has(token) && !/^\d+$/.test(token)) {
        counts.set(token, (counts.get(token) ?? 0) + 1)
      }
    }

    if (text.includes('aqui') && text.includes('toma')) {
      counts.set('aqui toma', (counts.get('aqui toma') ?? 0) + 1)
    }
  }

  return counts
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function buildSearchUrl(term) {
  return `/catalogo?buscar=${encodeURIComponent(term)}`
}

const catalog = JSON.parse(await readFile(catalogPath, 'utf8'))
const counts = countTerms(catalog.items)

const topDetectedTerms = [...counts.entries()]
  .sort((left, right) => right[1] - left[1])
  .map(([term]) => term)
  .filter((term) => term.length > 3 && !blockedTerms.has(term))

const keywords = unique([...preferredTerms, ...topDetectedTerms])
  .slice(0, 80)
  .map(toDisplayTerm)

const phrases = [
  'mugs aquí toma',
  'mugs aquí toma para profesiones',
  'mug aquí toma ingeniero',
  'mug aquí toma chef',
  'mug aquí toma policía',
  'mug personalizado profesor',
  'mug personalizado maestro',
  'mug personalizado enfermera',
  'mug personalizado abogado',
  'mug personalizado dentista',
  'mug personalizado bombero',
  'mug personalizado Navidad',
  'tazas de Navidad personalizadas',
  'mugs de amor y pareja',
  'mugs para abuelos',
  'mugs con fotos',
  'mugs con nombres',
  'mugs con frases',
  'mugs para familia',
  'mugs por profesión',
]

const featuredSearches = unique([...phrases, ...keywords.slice(0, 28).map((term) => `mug ${term}`)])
  .slice(0, 48)
  .map((label) => ({
    label,
    url: buildSearchUrl(label),
  }))

const sections = [
  {
    title: 'Mugs aquí toma y profesiones',
    description:
      'Diseños para regalar a ingenieros, chefs, policías, profesores, médicos, abogados, enfermeras, mecánicos, bomberos y muchas más profesiones.',
    terms: [
      'aquí toma',
      'ingeniero',
      'chef',
      'policía',
      'profesor',
      'maestro',
      'mecánico',
      'enfermera',
      'abogado',
      'dentista',
      'bombero',
      'contador',
    ],
  },
  {
    title: 'Mugs personalizados por ocasión',
    description:
      'Opciones para Navidad, amor y pareja, familia, abuelos, aniversarios, fechas especiales y detalles personalizados con fotos o nombres.',
    terms: ['Navidad', 'amor', 'pareja', 'familia', 'abuelos', 'collage', 'fotos', 'nombres', 'frases'],
  },
  {
    title: 'Diseños listos para cotizar por WhatsApp',
    description:
      'Cada pieza del catálogo puede adaptarse con nombres, frases, colores, fotos o datos de la persona que recibe el regalo.',
    terms: ['regalos personalizados', 'mugs con fotos', 'mugs con nombres', 'mugs con frases', 'detalles personalizados'],
  },
]

const catalogSeo = {
  generatedAt: new Date().toISOString(),
  totalDesigns: catalog.items.length,
  headline: 'Mugs personalizados por profesión, ocasión y frase',
  description:
    'Explora diseños para mugs y tazas personalizados: aquí toma, profesiones, Navidad, amor, abuelos, familia, frases, nombres y fotos.',
  keywords,
  phrases,
  featuredSearches,
  sections,
  sitemapSearches: featuredSearches.slice(0, 24),
}

await mkdir(dirname(publicOutputPath), { recursive: true })
await mkdir(dirname(tsOutputPath), { recursive: true })
await writeFile(publicOutputPath, `${JSON.stringify(catalogSeo, null, 2)}\n`)
await writeFile(
  tsOutputPath,
  `export const catalogSeo = ${JSON.stringify(catalogSeo, null, 2)} as const\n`,
)

console.log(`Catalog SEO data generated with ${catalogSeo.totalDesigns} designs and ${catalogSeo.keywords.length} keywords.`)
