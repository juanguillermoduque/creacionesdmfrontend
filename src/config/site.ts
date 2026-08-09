export const siteConfig = {
  businessName: 'Creaciones DM',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER ?? '573053261275',
  email: import.meta.env.VITE_CONTACT_EMAIL ?? 'creacionesdm530@gmail.com',
  serviceArea: import.meta.env.VITE_SERVICE_AREA ?? 'Colombia',
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
    { label: 'Productos', href: '#productos' },
    { label: 'Empresas', href: '#empresas' },
    { label: 'Personaliza', href: '#personaliza' },
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
  hero: {
    titleLines: ['Tu idea.', 'Tu estilo.'],
    highlighted: 'Tu creación.',
    body:
      'Sublimación, impresión y productos personalizados para personas, empresas, eventos y campañas en toda Colombia.',
    reassurance: 'Respuesta rápida y asesoría personalizada',
  },
}
