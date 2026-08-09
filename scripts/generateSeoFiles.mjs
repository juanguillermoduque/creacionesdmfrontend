import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const distDir = resolve(process.cwd(), 'dist')
const configuredUrl = process.env.VITE_SITE_URL || process.env.SITE_URL || ''
const siteUrl = configuredUrl.replace(/\/$/, '')

await mkdir(distDir, { recursive: true })

if (!siteUrl) {
  await writeFile(
    resolve(distDir, 'robots.txt'),
    [
      'User-agent: *',
      'Allow: /',
      '',
      '# Define VITE_SITE_URL=https://tudominio.com para generar sitemap.xml en produccion.',
      '',
    ].join('\n'),
  )
  process.exit(0)
}

const lastmod = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
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
