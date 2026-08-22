export const siteConfig = {
  businessName: 'Creaciones DM',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER ?? '573053261275',
  email: import.meta.env.VITE_CONTACT_EMAIL ?? 'creacionesdm530@gmail.com',
  siteUrl: import.meta.env.VITE_SITE_URL ?? 'https://creacionesdm.com',
  serviceArea: import.meta.env.VITE_SERVICE_AREA ?? 'Colombia',
  telephone: '+57 305 326 1275',
  seo: {
    title: 'Creaciones DM | Sublimación y regalos personalizados en Colombia',
    description:
      'Mugs, camisetas, botilitos, tote bags y regalos corporativos personalizados por sublimación. Cotiza por WhatsApp con Creaciones DM en Colombia.',
    image: '/assets/hero-products.png',
    locale: 'es_CO',
  },
  description:
    'Sublimación, impresión y productos personalizados para personas, empresas, eventos y campañas en toda Colombia.',
  defaultMessage:
    'Hola, Creaciones DM. Quiero recibir asesoría para cotizar un producto personalizado.',
  corporateSubscription: {
    title: 'Regalos mensuales para consentir a tu equipo',
    body:
      'Creamos una experiencia mes a mes para empresas que quieren sorprender a sus empleados con regalos totalmente personalizados.',
    message:
      'Hola, Creaciones DM. Quiero conocer la modalidad mensual de regalos personalizados para empleados y cotizar según la cantidad de colaboradores.',
    points: [
      'Regalos personalizados para cada empleado.',
      'Selección mensual de productos según la ocasión.',
      'Pago tipo suscripción según la cantidad de colaboradores.',
    ],
  },
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=100095290476509&locale=es_LA',
    instagram: 'https://www.instagram.com/creaionesdm/',
  },
  nav: [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Catálogo', href: '/catalogo' },
    { label: 'Empresas', href: '#empresas' },
    { label: 'Contacto', href: '#contacto' },
  ],
  categories: [
    {
      id: 'mugs',
      label: 'Mugs',
      message: 'Hola, Creaciones DM. Quiero recibir información sobre mugs personalizados.',
    },
    {
      id: 'camisetas',
      label: 'Camisetas',
      message: 'Hola, Creaciones DM. Quiero recibir información sobre camisetas personalizadas.',
    },
    {
      id: 'botilitos',
      label: 'Botilitos',
      message: 'Hola, Creaciones DM. Quiero recibir información sobre botilitos personalizados.',
    },
    {
      id: 'bolsas',
      label: 'Bolsas y tote bags',
      message:
        'Hola, Creaciones DM. Quiero recibir información sobre bolsas y tote bags personalizadas.',
    },
    {
      id: 'gorras',
      label: 'Gorras',
      message: 'Hola, Creaciones DM. Quiero recibir información sobre gorras personalizadas.',
    },
    {
      id: 'cojines',
      label: 'Cojines',
      message: 'Hola, Creaciones DM. Quiero recibir información sobre cojines personalizados.',
    },
    {
      id: 'rompecabezas',
      label: 'Rompecabezas',
      message:
        'Hola, Creaciones DM. Quiero recibir información sobre rompecabezas personalizados.',
    },
    {
      id: 'mas-productos',
      label: 'Más productos',
      message:
        'Hola, Creaciones DM. Quiero conocer más productos personalizados disponibles.',
    },
  ],
  featuredProducts: ['Mugs', 'Camisetas', 'Botilitos', 'Bolsas y tote bags', 'Más productos'],
  seoHighlights: [
    {
      title: 'Mugs, botilitos y termos personalizados',
      body:
        'Diseños con nombres, fotos, frases, logos o ilustraciones para regalos personales, emprendimientos, equipos de trabajo y campañas promocionales.',
    },
    {
      title: 'Camisetas, gorras y tote bags con tu marca',
      body:
        'Prendas y accesorios personalizados para eventos, uniformes, ferias, lanzamientos, recordatorios y detalles que hacen visible tu identidad.',
    },
    {
      title: 'Regalos empresariales mes a mes',
      body:
        'Modalidad mensual para empresas que quieren consentir a sus empleados con productos personalizados según la cantidad de colaboradores.',
    },
  ],
  faqs: [
    {
      question: '¿Qué productos personalizados ofrece Creaciones DM?',
      answer:
        'Personalizamos mugs, camisetas, botilitos, tote bags, gorras, cojines, rompecabezas y otros productos para personas, empresas, eventos y campañas.',
    },
    {
      question: '¿Atienden pedidos para empresas en Colombia?',
      answer:
        'Sí. Creamos productos promocionales, regalos corporativos y planes mensuales de detalles personalizados para empleados, clientes o asistentes a eventos.',
    },
    {
      question: '¿Puedo cotizar un producto por WhatsApp?',
      answer:
        'Sí. Puedes escribir por WhatsApp, contar tu idea y recibir asesoría personalizada para elegir el producto, diseño y cantidad ideal.',
    },
    {
      question: '¿Los productos pueden llevar fotos, nombres o logos?',
      answer:
        'Sí. Trabajamos diseños con fotos, nombres, frases, logos, colores de marca e ideas especiales para crear piezas únicas y listas para regalar o promocionar.',
    },
  ],
  hero: {
    titleLines: ['Tu idea.', 'Tu estilo.'],
    highlighted: 'Tu creación.',
    body:
      'Sublimación, impresión y productos personalizados para personas, empresas, eventos y campañas en toda Colombia.',
    reassurance: 'Respuesta rápida y asesoría personalizada',
  },
}
