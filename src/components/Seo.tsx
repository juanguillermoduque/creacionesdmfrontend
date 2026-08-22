import { useEffect } from 'react'
import { siteConfig } from '../config/site'
import { catalogSeo } from '../generated/catalogSeo'

type SeoPage = 'home' | 'catalog'

function getSiteUrl() {
  const configuredUrl = siteConfig.siteUrl.trim()
  const runtimeUrl = typeof window !== 'undefined' ? window.location.origin : ''

  return (configuredUrl || runtimeUrl).replace(/\/$/, '')
}

function getAbsoluteUrl(path: string) {
  const siteUrl = getSiteUrl()
  if (!siteUrl) return path
  return path.startsWith('http') ? path : `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

function setCanonical(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.appendChild(element)
  }
  element.href = url
}

export function Seo({ page = 'home' }: { page?: SeoPage }) {
  const siteUrl = getSiteUrl()
  const rootUrl = siteUrl ? `${siteUrl}/` : '/'
  const canonicalPath = page === 'catalog' ? '/catalogo' : '/'
  const canonicalUrl = siteUrl ? `${siteUrl}${canonicalPath === '/' ? '/' : canonicalPath}` : canonicalPath
  const title =
    page === 'catalog'
      ? 'Mugs aquí toma y tazas personalizadas | Creaciones DM'
      : siteConfig.seo.title
  const description =
    page === 'catalog'
      ? `Explora ${catalogSeo.totalDesigns} diseños para mugs y tazas personalizadas: aquí toma, profesiones, Navidad, amor, abuelos, frases, fotos y nombres. Cotiza por WhatsApp.`
      : siteConfig.seo.description
  const imageUrl = getAbsoluteUrl(siteConfig.seo.image)
  const sameAs = Object.values(siteConfig.social).filter(Boolean)
  const keywords =
    page === 'catalog'
      ? [
          'mugs personalizados',
          'tazas personalizadas',
          'mugs aquí toma',
          'regalos personalizados Colombia',
          ...catalogSeo.keywords,
        ].join(', ')
      : [
          'sublimación Colombia',
          'regalos personalizados',
          'mugs personalizados',
          'camisetas personalizadas',
          'Creaciones DM',
        ].join(', ')

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${rootUrl}#business`,
      name: siteConfig.businessName,
      url: rootUrl,
      logo: getAbsoluteUrl('/assets/creaciones-dm-logo.png'),
      image: imageUrl,
      email: siteConfig.email,
      telephone: siteConfig.telephone,
      areaServed: {
        '@type': 'Country',
        name: siteConfig.serviceArea,
      },
      description: siteConfig.description,
      priceRange: '$$',
      sameAs,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: siteConfig.telephone,
        email: siteConfig.email,
        availableLanguage: ['Spanish'],
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${rootUrl}#website`,
      name: siteConfig.businessName,
      url: rootUrl,
      inLanguage: 'es-CO',
      publisher: {
        '@id': `${rootUrl}#business`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${rootUrl}catalogo?buscar={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: page === 'catalog' ? 'Catálogo virtual de Creaciones DM' : 'Productos personalizados de Creaciones DM',
      itemListElement:
        page === 'catalog'
          ? catalogSeo.featuredSearches.slice(0, 24).map((search, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: search.label,
              url: getAbsoluteUrl(search.url),
            }))
          : siteConfig.categories.map((category, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: category.label,
              url: `${rootUrl}#productos`,
            })),
    },
    page === 'catalog'
      ? {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${canonicalUrl}#catalog`,
          name: title,
          url: canonicalUrl,
          inLanguage: 'es-CO',
          description,
          isPartOf: {
            '@id': `${rootUrl}#website`,
          },
          about: catalogSeo.keywords.slice(0, 35).map((keyword) => ({
            '@type': 'Thing',
            name: keyword,
          })),
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: catalogSeo.totalDesigns,
            itemListElement: catalogSeo.phrases.slice(0, 20).map((phrase, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: phrase,
              url: getAbsoluteUrl(`/catalogo?buscar=${encodeURIComponent(phrase)}`),
            })),
          },
        }
      : null,
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: siteConfig.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ].filter(Boolean)

  useEffect(() => {
    document.documentElement.lang = 'es-CO'
    document.title = title
    setCanonical(canonicalUrl)
    setMeta('name', 'description', description)
    setMeta('name', 'keywords', keywords)
    setMeta('name', 'robots', 'index, follow, max-image-preview:large')
    setMeta('name', 'theme-color', '#9EDFD1')
    setMeta('property', 'og:locale', siteConfig.seo.locale)
    setMeta('property', 'og:site_name', siteConfig.businessName)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:url', canonicalUrl)
    setMeta('property', 'og:image', imageUrl)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', imageUrl)
  }, [canonicalUrl, description, imageUrl, keywords, title])

  return <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
}
