import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Seo } from './components/Seo'
import { CatalogPage } from './pages/CatalogPage'
import { HomePage } from './pages/HomePage'

function App() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname.replace(/\/$/, '') : ''
  const isCatalogPage = pathname === '/catalogo'

  if (pathname === '/tienda' && typeof window !== 'undefined') {
    window.location.replace('/catalogo')
    return null
  }

  return (
    <>
      <Seo page={isCatalogPage ? 'catalog' : 'home'} />
      <Header />
      <main>{isCatalogPage ? <CatalogPage /> : <HomePage />}</main>
      <Footer />
    </>
  )
}

export default App
