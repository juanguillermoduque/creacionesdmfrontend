import { useEffect } from 'react'
import { siteConfig } from '../config/site'

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

export function Seo() {
  const siteUrl = getSiteUrl()
  const canonicalUrl = siteUrl ? `${siteUrl}/` : '/'
  const imageUrl = getAbsoluteUrl(siteConfig.seo.image)
  const sameAs = Object.values(siteConfig.social).filter(Boolean)

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${canonicalUrl}#business`,
      name: siteConfig.businessName,
      url: canonicalUrl,
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
      '@id': `${canonicalUrl}#website`,
      name: siteConfig.businessName,
      url: canonicalUrl,
      inLanguage: 'es-CO',
      publisher: {
        '@id': `${canonicalUrl}#business`,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Productos personalizados de Creaciones DM',
      itemListElement: siteConfig.categories.map((category, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: category.label,
        url: `${canonicalUrl}#productos`,
      })),
    },
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
  ]

  useEffect(() => {
    document.documentElement.lang = 'es-CO'
    document.title = siteConfig.seo.title
    setCanonical(canonicalUrl)
    setMeta('name', 'description', siteConfig.seo.description)
    setMeta('name', 'robots', 'index, follow, max-image-preview:large')
    setMeta('name', 'theme-color', '#9EDFD1')
    setMeta('property', 'og:locale', siteConfig.seo.locale)
    setMeta('property', 'og:site_name', siteConfig.businessName)
    setMeta('property', 'og:title', siteConfig.seo.title)
    setMeta('property', 'og:description', siteConfig.seo.description)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:url', canonicalUrl)
    setMeta('property', 'og:image', imageUrl)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', siteConfig.seo.title)
    setMeta('name', 'twitter:description', siteConfig.seo.description)
    setMeta('name', 'twitter:image', imageUrl)
  }, [canonicalUrl, imageUrl])

  return <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
}
