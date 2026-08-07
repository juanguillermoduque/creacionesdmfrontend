# Creaciones DM

Sitio web responsive para Creaciones DM, empresa colombiana de sublimación, estampado y productos personalizados. Incluye catálogo visual, enlaces de cotización por WhatsApp y un personalizador 3D de mugs con textura dinámica.

También presenta una modalidad corporativa mensual para empresas que quieren entregar regalos personalizados a sus empleados mediante una suscripción calculada según la cantidad de colaboradores.

## Requisitos

- Node.js 20 o superior.
- npm.

## Configuración

1. Copia `.env.example` a `.env`.
2. Ajusta `VITE_WHATSAPP_NUMBER` con el número de WhatsApp en formato internacional, sin espacios ni signos.
3. Ajusta `VITE_CONTACT_EMAIL` y `VITE_SERVICE_AREA` si cambian.

## Comandos

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
```

## Personalizador 3D

El usuario puede cargar JPG, PNG o WebP hasta 25 MB. La imagen se aplica como textura sobre una taza 3D, con controles de posición horizontal, posición vertical, escala, rotación táctil/mouse y zoom limitado.

## Realidad Aumentada

El sitio integra `model-viewer` con un modelo GLB base en `public/models/creaciones-dm-mug.glb`. En dispositivos compatibles puede abrir WebXR o Scene Viewer. En iPhone, AR Quick Look requiere USDZ; por eso se informa la limitación y se mantiene la vista 3D interactiva como alternativa. La textura personalizada del canvas 3D no se transfiere automáticamente al modelo AR nativo.

## Archivos principales

- `src/config/site.ts`: datos configurables del negocio.
- `src/lib/whatsapp.ts`: generación centralizada de enlaces de WhatsApp.
- `src/components/MugCustomizer.tsx`: carga de diseño, controles, validación y AR.
- `src/components/MugCanvas.tsx`: escena 3D y textura dinámica del mug.
- `public/assets`: logo oficial y recursos visuales del sitio.
