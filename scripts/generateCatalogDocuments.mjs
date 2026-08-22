import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const rootDir = process.cwd()
const catalogData = JSON.parse(readFileSync(resolve(rootDir, 'public/data/store-catalog.json'), 'utf8'))
const outputDir = resolve(rootDir, 'catalogo')

const productOfferings = [
  {
    product: 'Mugs y tazas',
    status: 'Con mockups disponibles',
    description: 'Producto principal del catálogo actual. Ideal para regalos personales, profesiones, fechas especiales, Navidad, amor, familia y campañas.',
    personalization: 'Fotos, nombres, frases, logos, colores, ilustraciones y diseños por profesión.',
    suggestedOccasions: ['Profesiones', 'Navidad', 'Amor y pareja', 'Familia', 'Ilustrados', 'Diseños variados'],
  },
  {
    product: 'Camisetas',
    status: 'Oferta disponible',
    description: 'Prendas personalizadas para marcas, equipos, eventos, emprendimientos, regalos y campañas.',
    personalization: 'Logos, frases, nombres, diseños gráficos, estampados y diseños corporativos.',
    suggestedOccasions: ['Empresas', 'Eventos', 'Campañas', 'Regalos personales', 'Uniformes'],
  },
  {
    product: 'Botilitos y termos',
    status: 'Oferta disponible',
    description: 'Productos funcionales para empresas, detalles promocionales, colegios, equipos y eventos.',
    personalization: 'Logos, nombres, frases cortas, colores de marca e ilustraciones.',
    suggestedOccasions: ['Empresas', 'Eventos', 'Campañas', 'Regalos útiles'],
  },
  {
    product: 'Bolsas y tote bags',
    status: 'Oferta disponible',
    description: 'Bolsas personalizadas para marcas, eventos, detalles sostenibles, ferias y regalos.',
    personalization: 'Logos, frases, diseños minimalistas, ilustraciones y mensajes de campaña.',
    suggestedOccasions: ['Empresas', 'Ferias', 'Eventos', 'Regalos promocionales'],
  },
  {
    product: 'Gorras',
    status: 'Oferta disponible',
    description: 'Accesorios personalizados para equipos, marcas, campañas, eventos y dotación casual.',
    personalization: 'Logo, nombre, frase, iniciales o diseño de marca.',
    suggestedOccasions: ['Empresas', 'Equipos', 'Eventos', 'Campañas'],
  },
  {
    product: 'Cojines',
    status: 'Oferta disponible',
    description: 'Regalos personalizados para familia, pareja, cumpleaños, fechas especiales y decoración.',
    personalization: 'Fotos, nombres, frases, fechas, collage y diseños temáticos.',
    suggestedOccasions: ['Amor y pareja', 'Familia', 'Cumpleaños', 'Aniversarios'],
  },
  {
    product: 'Rompecabezas',
    status: 'Oferta disponible',
    description: 'Producto de regalo con valor sentimental para fotos familiares, pareja, niños y fechas especiales.',
    personalization: 'Fotos, mensajes, nombres y diseños por ocasión.',
    suggestedOccasions: ['Familia', 'Amor y pareja', 'Niños', 'Fechas especiales'],
  },
  {
    product: 'Regalos corporativos mensuales',
    status: 'Servicio disponible',
    description: 'Modalidad de suscripción para empresas que quieren consentir empleados con regalos personalizados mes a mes.',
    personalization: 'Selección mensual por cantidad de colaboradores, ocasión, marca y objetivo interno.',
    suggestedOccasions: ['Empresas', 'Bienestar laboral', 'Fechas especiales', 'Reconocimientos'],
  },
]

function countBy(items, key) {
  return Object.entries(
    items.reduce((acc, item) => {
      acc[item[key]] = (acc[item[key]] || 0) + 1
      return acc
    }, {}),
  ).sort((a, b) => b[1] - a[1])
}

function csvEscape(value) {
  const text = String(value ?? '')
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function toCsv(rows) {
  return rows.map((row) => row.map(csvEscape).join(',')).join('\n') + '\n'
}

function markdownTable(headers, rows) {
  const escapeCell = (value) => String(value).replace(/\|/g, ',')

  return [
    `| ${headers.map(escapeCell).join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map(escapeCell).join(' | ')} |`),
  ].join('\n')
}

function writeOutput(relativePath, content) {
  const fullPath = resolve(outputDir, relativePath)
  mkdirSync(dirname(fullPath), { recursive: true })
  writeFileSync(fullPath, content)
}

const items = catalogData.items
const byProductType = countBy(items, 'productType')
const byOccasion = countBy(items, 'occasion')
const byCollection = countBy(items, 'collection')

const offerRows = productOfferings.map((item) => [
  item.product,
  item.status,
  item.description,
  item.personalization,
  item.suggestedOccasions.join(' | '),
])

const themeRows = byOccasion.map(([theme, count]) => {
  const collections = [
    ...new Set(items.filter((item) => item.occasion === theme).map((item) => item.collection)),
  ]

  return [
    theme,
    count,
    collections.join(' | '),
    `Hola, Creaciones DM. Quiero ver opciones de ${theme.toLowerCase()} del catálogo personalizado.`,
  ]
})

const storeRows = [
  ['id', 'titulo', 'producto', 'ocasion', 'coleccion', 'tipo_archivo', 'imagen', 'texto_whatsapp'],
  ...items.map((item) => [
    item.id,
    item.title,
    item.productType,
    item.occasion,
    item.collection,
    item.sourceType,
    item.image,
    `Hola, Creaciones DM. Quiero cotizar este diseño del catálogo: ${item.title}. Tipo: ${item.productType}. Ocasión: ${item.occasion}.`,
  ]),
]

const productMarkdown = `# Catálogo por producto

Este documento organiza todos los productos que Creaciones DM puede ofrecer. El material con mockups clasificados actualmente está concentrado principalmente en mugs y tazas; los demás productos quedan definidos como líneas comerciales disponibles para cotización y para ampliar con nuevos mockups.

${markdownTable(
  ['Producto', 'Estado', 'Descripción', 'Personalización', 'Ocasiones sugeridas'],
  offerRows,
)}

## Conteo de mockups actuales por tipo de producto

${markdownTable(['Tipo en tienda virtual', 'Cantidad'], byProductType)}
`

const themeMarkdown = `# Catálogo por temática y ocasión

Clasificación de los diseños extraídos desde la carpeta contenido y disponibles en la tienda virtual.

${markdownTable(['Temática / ocasión', 'Diseños', 'Colecciones base', 'Mensaje sugerido de WhatsApp'], themeRows)}

## Colecciones base detectadas

${markdownTable(['Colección', 'Diseños'], byCollection)}
`

const masterMarkdown = `# Catálogo maestro Creaciones DM

Resumen operativo para organizar los productos y diseños disponibles.

## Resumen rápido

- Productos y servicios ofertables: ${productOfferings.length}
- Diseños/mockups optimizados para tienda virtual: ${items.length}
- Tipos de producto con mockups actuales: ${byProductType.length}
- Temáticas detectadas: ${byOccasion.length}
- Colecciones base detectadas: ${byCollection.length}

## Archivos incluidos

- \`catalogo-por-producto.md\`: líneas de producto que se pueden ofrecer.
- \`catalogo-por-tematica.md\`: clasificación por ocasión y temática.
- \`catalogo-productos.csv\`: versión tabular de productos ofertables.
- \`catalogo-tematicas.csv\`: versión tabular por temática.
- \`catalogo-tienda-virtual.csv\`: todos los diseños/mockups de la tienda virtual.
- \`catalogo-resumen.json\`: resumen estructurado para automatizaciones o futuras integraciones.

## Recomendación comercial

Usar el home para presentar la marca y llevar a WhatsApp, y usar \`/catalogo\` como vitrina completa. Para ventas por chat, primero filtrar por temática o producto y luego enviar 3 a 6 opciones visuales al cliente.
`

const summaryJson = {
  generatedAt: new Date().toISOString(),
  totals: {
    productOfferings: productOfferings.length,
    storeItems: items.length,
    productTypes: byProductType.length,
    occasions: byOccasion.length,
    collections: byCollection.length,
  },
  productOfferings,
  storeCatalog: {
    byProductType: Object.fromEntries(byProductType),
    byOccasion: Object.fromEntries(byOccasion),
    byCollection: Object.fromEntries(byCollection),
  },
}

writeOutput('README.md', masterMarkdown)
writeOutput('catalogo-por-producto.md', productMarkdown)
writeOutput('catalogo-por-tematica.md', themeMarkdown)
writeOutput(
  'catalogo-productos.csv',
  toCsv([['producto', 'estado', 'descripcion', 'personalizacion', 'ocasiones_sugeridas'], ...offerRows]),
)
writeOutput(
  'catalogo-tematicas.csv',
  toCsv([['tematica', 'cantidad_disenos', 'colecciones_base', 'mensaje_whatsapp'], ...themeRows]),
)
writeOutput('catalogo-tienda-virtual.csv', toCsv(storeRows))
writeOutput('catalogo-resumen.json', `${JSON.stringify(summaryJson, null, 2)}\n`)

console.log(
  JSON.stringify(
    {
      outputDir,
      files: [
        'README.md',
        'catalogo-por-producto.md',
        'catalogo-por-tematica.md',
        'catalogo-productos.csv',
        'catalogo-tematicas.csv',
        'catalogo-tienda-virtual.csv',
        'catalogo-resumen.json',
      ],
      totals: summaryJson.totals,
    },
    null,
    2,
  ),
)
