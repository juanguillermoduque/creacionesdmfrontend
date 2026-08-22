import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const distDir = resolve(process.cwd(), 'dist')
const catalogSeoPath = resolve(process.cwd(), 'public/data/catalog-seo.json')
const configuredUrl = process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://creacionesdm.com'
const siteUrl = configuredUrl.replace(/\/$/, '')

await mkdir(distDir, { recursive: true })

const lastmod = new Date().toISOString().slice(0, 10)

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

async function readCatalogSeoSearches() {
  try {
    const catalogSeo = JSON.parse(await readFile(catalogSeoPath, 'utf8'))
    return Array.isArray(catalogSeo.sitemapSearches) ? catalogSeo.sitemapSearches : []
  } catch {
    return []
  }
}

function buildUrl(path, changefreq, priority) {
  return `  <url>
    <loc>${escapeXml(`${siteUrl}${path}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

const catalogSearchUrls = (await readCatalogSeoSearches()).map((search) =>
  buildUrl(search.url, 'weekly', '0.7'),
)

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[buildUrl('/', 'weekly', '1.0'), buildUrl('/catalogo', 'weekly', '0.9'), ...catalogSearchUrls].join('\n')}
</urlset>
`

const robots = [
  'User-agent: *',
  'Allow: /',
  '',
  `Sitemap: ${siteUrl}/sitemap.xml`,
  '',
].join('\n')

await writeFile(resolve(distDir, 'sitemap.xml'), sitemap)
await writeFile(resolve(distDir, 'robots.txt'), robots)
