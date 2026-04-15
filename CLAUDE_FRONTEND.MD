Eres un arquitecto frontend experto en Next.js 14, TypeScript y diseño de e-commerce. Construirás el frontend production-grade de "Rosa y Menta", una boutique de ropa y accesorios. La API REST ya existe en Django DRF desplegada en Railway. Guíame módulo a módulo esperando confirmación antes de avanzar.

━━━ STACK TECNOLÓGICO ━━━
Framework      : Next.js 14 (App Router, Server Components por defecto)
Lenguaje       : TypeScript estricto (strict: true en tsconfig)
Estilos        : Tailwind CSS 4 + Radix UI (primitivos sin estilos)
Estado global  : Zustand (carrito, favoritos, UI state)
Validación     : Zod (schemas compartidos cliente/servidor)
Fetching       : fetch nativo + React.cache() en server
Animaciones    : Framer Motion (solo donde aporte UX real)
Iconos         : Lucide React (optimizePackageImports)
Gestor pkgs    : pnpm
Testing        : Vitest + Testing Library
Linting        : ESLint + Prettier
Deploy         : Vercel
Locale         : es-MX · America/Mexico_City
API base URL   : NEXT_PUBLIC_API_URL (Railway backend)

━━━ PRINCIPIOS DE ARQUITECTURA ━━━

1. Screaming Architecture — src/features/ por dominio:
   Cada feature contiene sus propios components/, hooks/,
   actions/, types/ y schemas/. Las rutas en src/app/ son
   delgadas: solo page.tsx, layout.tsx, loading.tsx, error.tsx.

2. Server-first: Server Components por defecto.
   "use client" solo cuando hay interactividad real
   (formularios, estado local, listeners de eventos).

3. Server Actions para mutaciones (auth, carrito, pedidos,
   favoritos, reviews, newsletter). Nunca fetch() del cliente
   a /api/* salvo casos justificados.

4. ActionState unificado — todas las server actions devuelven:
   { success: boolean; message: string; errors?: Record }
   Nunca throw ni new Error() en actions.

5. Sin barrel files — imports directos para tree-shaking real.

6. Path aliases:
   @features/* → src/features/*
   @shared/*   → src/shared/*
   @app/*      → src/app/*

   rosa-y-menta-frontend/
├── public/
│   ├── og-default.jpg          # 1200×630 imagen OpenGraph por defecto
│   ├── robots.txt
│   └── llms.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout: fuentes, metadata, providers
│   │   ├── sitemap.ts           # Sitemap dinámico (ISR revalidate: 3600)
│   │   ├── (auth)/
│   │   │   ├── layout.tsx       # Layout centrado sin header/footer
│   │   │   ├── login/page.tsx
│   │   │   └── registro/page.tsx
│   │   ├── (tienda)/
│   │   │   ├── layout.tsx       # Header + Footer
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── catalogo/
│   │   │   │   ├── page.tsx     # Listado con filtros
│   │   │   │   ├── loading.tsx  # Skeleton grid
│   │   │   │   ├── error.tsx
│   │   │   │   └── [categoria]/
│   │   │   │       └── [slug]/
│   │   │   │           ├── page.tsx     # PDP (Product Detail Page)
│   │   │   │           ├── loading.tsx
│   │   │   │           └── error.tsx
│   │   │   └── carrito/
│   │   │       ├── page.tsx
│   │   │       └── loading.tsx
│   │   └── (privado)/           # Protegido por middleware
│   │       ├── layout.tsx
│   │       ├── checkout/
│   │       │   ├── page.tsx
│   │       │   ├── loading.tsx
│   │       │   └── confirmacion/page.tsx
│   │       └── cuenta/
│   │           ├── page.tsx
│   │           ├── pedidos/
│   │           │   ├── page.tsx
│   │           │   └── [id]/page.tsx
│   │           ├── perfil/page.tsx
│   │           └── favoritos/page.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── actions/         # loginAction, registerAction, logoutAction
│   │   │   ├── components/      # LoginForm, RegisterForm
│   │   │   ├── hooks/
│   │   │   ├── schemas/         # loginSchema, registerSchema (Zod)
│   │   │   └── types/
│   │   ├── catalog/
│   │   │   ├── components/      # ProductCard, ProductGrid, ProductDetail
│   │   │   │   ├── server/      # ProductCard, CategorySidebar
│   │   │   │   └── client/      # VariantSelector, ImageGallery, FilterChips
│   │   │   ├── lib/
│   │   │   │   └── fetchers.ts  # getProductos, getProducto, getCategorias (React.cache)
│   │   │   └── types/
│   │   ├── cart/
│   │   │   ├── actions/
│   │   │   ├── components/      # CartDrawer, CartItemRow, CartPage client
│   │   │   ├── store/           # cartStore.ts (Zustand)
│   │   │   └── types/
│   │   ├── checkout/
│   │   │   ├── actions/
│   │   │   ├── components/      # DireccionSelector, OrderSummary, PaymentRedirect
│   │   │   └── types/
│   │   ├── account/
│   │   │   ├── actions/
│   │   │   ├── components/      # OrderList, OrderDetail, ProfileForm, AvatarUpload
│   │   │   └── types/
│   │   ├── favorites/
│   │   │   ├── actions/
│   │   │   ├── components/      # FavoriteButton, FavoritesPage
│   │   │   ├── store/           # favoritesStore.ts (Zustand)
│   │   │   └── types/
│   │   ├── reviews/
│   │   │   ├── actions/
│   │   │   ├── components/      # StarRating, ReviewCard, ReviewList, ReviewForm
│   │   │   └── types/
│   │   └── newsletter/
│   │       ├── actions/         # suscribirNewsletterAction
│   │       └── components/      # NewsletterBanner, NewsletterFooterForm
│   ├── shared/
│   │   ├── ui/                  # Button, Input, Badge, Dialog, Toast, Skeleton, EmptyState
│   │   ├── layout/              # Header, Footer, MobileMenu
│   │   ├── hooks/               # useLatest, useToast, useMediaQuery, useDebounce
│   │   ├── lib/
│   │   │   ├── action-types.ts  # ActionState, FormStatus
│   │   │   ├── api.ts           # fetchAPI wrapper
│   │   │   └── metadata.ts      # helpers generateOGImage, buildJsonLd
│   │   ├── providers/
│   │   │   └── Providers.tsx    # ToastProvider, ZustandHydration
│   │   └── types/
│   │       └── index.ts         # tipos globales compartidos
│   └── middleware.ts            # Protección rutas privadas
├── .env.local.example
├── .env.production.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── eslint.config.mjs
└── pnpm-lock.yaml

━━━ MÓDULO [1] CONFIGURACIÓN BASE ━━━
Genera estos archivos desde cero:

tsconfig.json:
  - strict: true, paths para @features, @shared, @app
  - target: ES2022, moduleResolution: bundler

next.config.ts:
  - optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/*']
  - images.remotePatterns: res.cloudinary.com (Cloudinary)
  - images.formats: ['image/avif', 'image/webp']
  - images.minimumCacheTTL: 86400
  - Security headers (middleware alternativo si Vercel los soporta):
      X-Frame-Options: DENY
      X-Content-Type-Options: nosniff
      Referrer-Policy: strict-origin-when-cross-origin
      Permissions-Policy: camera=(), microphone=(), geolocation=()
      Content-Security-Policy:
        default-src 'self';
        img-src 'self' res.cloudinary.com data: blob:;
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        connect-src 'self' NEXT_PUBLIC_API_URL;
        font-src 'self'
  - Redirects 308 para rutas legacy si aplica

middleware.ts (src/):
  - Proteger rutas privadas: /cuenta/*, /checkout/* requieren cookie access_cookie
  - Redirigir a /auth/login si no autenticado
  - Leer cookie con cookies() de next/headers
  - Nunca acceder a tokens en client-side JS

tailwind.config.ts:
  - Paleta de colores personalizada Rosa y Menta:
      rosa: { 50..900 } (tonos rosados)
      menta: { 50..900 } (tonos verdes menta)
      neutral: escala de grises cálidos
  - Tipografía: font-display (headings), font-body (texto)
  - Contenido: ./src/**/*.{ts,tsx}

src/shared/lib/action-types.ts:
  - Tipo ActionState:
      { success: boolean; message: string; errors?: Record; data?: T }
  - Tipo FormStatus: 'idle' | 'pending' | 'success' | 'error'

src/shared/lib/api.ts:
  - fetchAPI(endpoint, options): wrapper sobre fetch
      · Agrega Authorization Bearer desde cookie (server) o header
      · Maneja errores HTTP con mensaje estandarizado
      · Tipos genéricos: fetchAPI(...)

.env.local.example y .env.production.example completos

robots.txt (public/):
  User-agent: *
  Disallow: /cuenta/
  Disallow: /checkout/
  Disallow: /admin/
  Allow: /
  Sitemap: https://rosaymenta.mx/sitemap.xml

  User-agent: GPTBot
  Allow: /

  User-agent: ClaudeBot
  Allow: /

  User-agent: PerplexityBot
  Allow: /

llms.txt (public/):
  # Rosa y Menta
  Boutique de ropa y accesorios en México.
  Sitemap: https://rosaymenta.mx/sitemap.xml

━━━ MÓDULO [2] ROOT LAYOUT & SEO GLOBAL ━━━

src/app/layout.tsx (Root Layout):
  - lang="es-MX" en 
  - Fuentes: next/font/google (una display + una body), variable CSS
  - Metadata base:
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL)
      title: { template: '%s | Rosa y Menta', default: 'Rosa y Menta — Boutique de moda' }
      description: (SEO-friendly, 155 chars aprox)
      keywords: ropa, accesorios, boutique, moda, México
      authors: [{ name: 'Rosa y Menta' }]
      creator: 'Rosa y Menta'
  - OpenGraph global:
      type: 'website'
      locale: 'es_MX'
      url: NEXT_PUBLIC_SITE_URL
      siteName: 'Rosa y Menta'
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: '...' }]
  - Twitter Card global:
      card: 'summary_large_image'
      site: '@rosaymenta' (si aplica)
      images: ['/og-default.jpg']
  - JSON-LD global en  (script type="application/ld+json"):
      LocalBusiness:
        @type: 'ClothingStore'
        name: 'Rosa y Menta'
        url, logo, image, description
        address (México)
        priceRange: '$$'
      WebSite:
        @type: 'WebSite'
        name, url
        potentialAction: SearchAction (sitelinks searchbox)
  - Viewport: width=device-width, initialScale=1
  - ThemeColor: color de marca (rosa principal)
  - Providers client-side en src/shared/providers/Providers.tsx:
      ToastProvider (Radix Toast), ZustandHydration

src/app/sitemap.ts:
  - Rutas estáticas: /, /catalogo, /auth/login, /auth/registro
  - Rutas dinámicas: fetchea /api/v1/productos/ y /api/v1/categorias/
  - Retorna: url, lastModified, changeFrequency, priority
  - revalidate: 3600

━━━ MÓDULO [3] AUTH ━━━
Feature: src/features/auth/

Tipos (auth/types/index.ts):
  Usuario, LoginPayload, RegisterPayload, AuthTokens

Schemas Zod (auth/schemas/):
  loginSchema, registerSchema (con campo suscribir_newsletter: boolean)

Server Actions (auth/actions/):
  loginAction(formData):
    · POST /api/v1/auth/login/
    · Guardar access_cookie (HttpOnly, Secure, SameSite=Lax, path=/)
    · Guardar refresh_cookie (HttpOnly, Secure, SameSite=Lax, path=/)
    · Cookie pública username (no HttpOnly) para UI checks
    · Retorna ActionState
  registerAction(formData):
    · POST /api/v1/auth/register/ con suscribir_newsletter
    · Auto-login tras registro exitoso (llama loginAction internamente)
    · Retorna ActionState
  logoutAction():
    · POST /api/v1/auth/logout/ con refresh token
    · Borrar access_cookie, refresh_cookie, username
    · redirect('/auth/login')
  refreshTokenAction():
    · POST /api/v1/auth/token/refresh/
    · Actualizar access_cookie
    · Llamar desde middleware cuando access expirado

Componentes (auth/components/):
  LoginForm.tsx (use client):
    · useActionState(loginAction, initialState)
    · useFormStatus para botón pendiente
    · Campos: email, password
    · Radix Form para accesibilidad (aria-invalid, aria-describedby)
    · Mensajes de error por campo desde ActionState.errors
  RegisterForm.tsx (use client):
    · Campos: nombre, email, password, confirmar_password
    · Checkbox: "Quiero recibir novedades de Rosa y Menta"
    · Mismo patrón useActionState + useFormStatus

Rutas (app/(auth)/):
  login/page.tsx, registro/page.tsx — Server Components delgados
  layout.tsx — layout centrado para auth (sin header/footer)

━━━ MÓDULO [4] CATÁLOGO & PRODUCTOS ━━━
Feature: src/features/catalog/

Tipos (catalog/types/):
  Producto, ProductoVariante, ProductoImagen, Categoria, Marca
  ListaProductosResponse (paginada: count, next, previous, results)

Fetchers server (catalog/lib/fetchers.ts) — con React.cache():
  getProductos(params): filtra por categoria, marca, talla, color, precio, búsqueda
  getProducto(slug): detalle con variantes e imágenes
  getCategorias(): árbol de categorías
  getProductosDestacados(): para homepage

Componentes Server:
  ProductCard.tsx:
    · next/image con Cloudinary URL, sizes responsive
    · Badge de estado (NVO/UBS/REC) con Radix Badge
    · Precio con descuento si aplica
    · Link a /catalogo/[categoria]/[slug]
  ProductGrid.tsx: grid responsive con Suspense por fila
  CategorySidebar.tsx: filtros server-rendered + client filter chips
  ProductDetail.tsx:
    · Galería de imágenes (cliente, Radix Dialog para zoom)
    · Selector de talla/color (Radix RadioGroup) — actualiza variante activa
    · Precio dinámico según variante
    · Botón "Agregar al carrito" (Server Action)
    · Botón "Guardar en favoritos" (Server Action)
    · Sección de reviews debajo

Componentes Client (use client):
  VariantSelector.tsx: Radix RadioGroup, tallas y colores
  ImageGallery.tsx: thumbnails + zoom con Radix Dialog
  FilterChips.tsx: chips activos, URL search params
  SearchBar.tsx: input controlado + router.push con debounce

SEO por ruta de catálogo:
  app/(tienda)/catalogo/page.tsx:
    generateMetadata:
      title: 'Catálogo de ropa y accesorios'
      OpenGraph: type website, imagen banner catálogo
    JSON-LD: ItemList con los primeros 10 productos

  app/(tienda)/catalogo/[categoria]/[slug]/page.tsx:
    generateMetadata({ params }):
      · Fetchea producto por slug
      · title: producto.nombre
      · description: producto.descripcion (truncada a 155 chars)
      · OpenGraph:
          type: 'og:type' = 'product'  (Open Graph Commerce)
          title: producto.nombre
          description
          images: [{ url: imagen_principal_cloudinary, width: 800, height: 800 }]
          url: canónica completa
      · Twitter Card: summary_large_image
      · Canonical link
    JSON-LD: Product + BreadcrumbList + AggregateRating (si tiene reviews)

  generateStaticParams():
    · Pre-renderiza slugs de productos activos en build time
    · revalidate: 3600 (ISR)

━━━ MÓDULO [5] CARRITO ━━━
Feature: src/features/cart/

Store Zustand (cart/store/cartStore.ts):
  Estado: items[], total, cantidad
  Acciones: addItem, removeItem, updateQuantity, clearCart, hydrate
  Persistencia: localStorage (solo cantidades UI) — el carrito real vive en el servidor

Server Actions (cart/actions/):
  addToCartAction(varianteId, cantidad):
    · POST /api/v1/pedidos/carrito/items/
    · Revalida ruta /carrito
    · Retorna ActionState
  removeFromCartAction(itemId):
    · DELETE /api/v1/pedidos/carrito/items/{id}/
  updateQuantityAction(itemId, cantidad):
    · PATCH /api/v1/pedidos/carrito/items/{id}/
  getCartAction():
    · GET /api/v1/pedidos/carrito/
    · Llamado en server, pasa initialData a CartClient

Componentes:
  CartDrawer.tsx (use client, Radix Dialog):
    · Mini-carrito lateral (slide-over)
    · CartItemRow.tsx con memo() — imagen, nombre, variante, cantidad, precio
    · Subtotal calculado
    · Botón "Ir al checkout"
  CartPage (app/(tienda)/carrito/page.tsx):
    · Server Component: llama getCartAction() → pasa initialHasDirecciones a CartClient
    · CartClient.tsx (use client): maneja estado local del carrito
    · Skeleton en loading.tsx que matchea layout de items

━━━ MÓDULO [6] CHECKOUT ━━━
Feature: src/features/checkout/

Flujo de pasos (Radix Progress o stepper custom):
  1. Seleccionar dirección → 2. Revisar pedido → 3. Pago → 4. Confirmación

Server Actions (checkout/actions/):
  crearPedidoAction(direccionId):
    · POST /api/v1/pedidos/ (crea pedido desde carrito)
    · Retorna ActionState<{ numeroPedido, total, initPoint }>
  iniciarPagoMPAction(pedidoId):
    · POST /api/v1/pagos/mp/crear-preferencia/
    · Retorna ActionState<{ initPoint: string }>

Componentes:
  DireccionSelector.tsx (use client):
    · Radix RadioGroup con tarjetas de dirección
    · Botón "Agregar nueva dirección" (Radix Dialog + form)
    · Límite visual de 3 direcciones
  OrderSummary.tsx (Server Component):
    · Resumen de items, subtotal, descuento, total
  PaymentRedirect.tsx (use client):
    · Botón que redirige a MercadoPago initPoint
    · Estado pendiente con useFormStatus

Rutas:
  app/(privado)/checkout/page.tsx → protegida por middleware
  app/(privado)/checkout/confirmacion/page.tsx:
    · Recibe ?pedido=NUMERO por query param
    · Fetchea estado del pedido y muestra resumen
    · JSON-LD: Order (schema.org)

━━━ MÓDULO [7] CUENTA & ÓRDENES ━━━
Feature: src/features/account/

Server Actions (account/actions/):
  getOrdersAction(): GET /api/v1/pedidos/?usuario=me
  getOrderDetailAction(id): GET /api/v1/pedidos/{id}/
  updateProfileAction(formData): PUT /api/v1/auth/me/
  addDireccionAction(formData): POST /api/v1/usuarios/direcciones/
  deleteDireccionAction(id): DELETE /api/v1/usuarios/direcciones/{id}/

Componentes:
  AccountLayout.tsx: sidebar de navegación de cuenta
  OrderList.tsx: lista paginada con estado badge (Radix Badge)
  OrderDetail.tsx: items, totales, estado timeline (Radix Progress)
  ProfileForm.tsx (use client): edición de nombre, teléfono, avatar
  DireccionesList.tsx: máximo 3, con add/delete
  AvatarUpload.tsx (use client):
    · Input file → preview con URL.createObjectURL
    · Server Action sube a Cloudinary vía API backend

Rutas (app/(privado)/cuenta/):
  page.tsx → resumen de cuenta
  pedidos/page.tsx → lista de órdenes
  pedidos/[id]/page.tsx → detalle + generateMetadata
  perfil/page.tsx → editar perfil y direcciones
  Todas protegidas por middleware

━━━ MÓDULO [8] FAVORITOS ━━━
Feature: src/features/favorites/

Store Zustand (favorites/store/favoritesStore.ts):
  Estado: ids[] (solo IDs para checks rápidos de UI)
  Acciones: toggle, setAll, hydrate

Server Actions (favorites/actions/):
  toggleFavoriteAction(productoId):
    · POST o DELETE /api/v1/usuarios/favoritos/{productoId}/
    · Actualiza store y revalida
  getFavoritosAction():
    · GET /api/v1/usuarios/favoritos/
    · Usado en server para hydrate inicial

Componentes:
  FavoriteButton.tsx (use client):
    · Icono corazón con Radix Toggle
    · Estado optimista: togglea en store antes de confirmar server action
    · memo() para evitar re-renders en ProductCard
  FavoritesPage (app/(privado)/cuenta/favoritos/page.tsx):
    · Grid de productos favoritos con ProductCard
    · EmptyState si no hay favoritos
    · generateMetadata: title 'Mis favoritos'

━━━ MÓDULO [9] REVIEWS & CALIFICACIONES ━━━
Feature: src/features/reviews/

Tipos (reviews/types/):
  Review: id, usuario, producto, calificacion (1-5), comentario, creado_en
  ReviewStats: promedio, total, distribucion por estrella

Server Actions (reviews/actions/):
  createReviewAction(productoId, formData):
    · POST /api/v1/productos/{id}/reviews/
    · Solo usuarios autenticados con pedido entregado del producto
    · Retorna ActionState
  getReviewsAction(productoId):
    · GET /api/v1/productos/{id}/reviews/
    · Paginado, ordenable por reciente / mejor calificación

Componentes:
  StarRating.tsx (use client):
    · Radix Slider o estrellas SVG interactivas
    · Accesible: aria-label por estrella
    · memo() — se usa dentro de ReviewCard
  ReviewCard.tsx:
    · Avatar iniciales (si no hay foto), nombre, fecha, calificación, comentario
    · Server Component
  ReviewList.tsx:
    · Suspense streaming: estadísticas arriba (rápido) + lista abajo
    · Paginación con "Cargar más" (client action)
  ReviewForm.tsx (use client):
    · Solo visible si usuario autenticado + compró el producto
    · Campos: calificacion (StarRating), comentario (textarea)
    · useActionState + useFormStatus
  RatingDistribution.tsx:
    · Barras de distribución por estrella (1-5)
    · Server Component, datos de ReviewStats

━━━ MÓDULO [10] NEWSLETTER ━━━
Feature: src/features/newsletter/

Server Actions (newsletter/actions/):
  suscribirNewsletterAction(formData):
    · POST /api/v1/newsletter/suscribir/
    · Acepta email, nombre opcional
    · Retorna ActionState con mensaje

Componentes:
  NewsletterBanner.tsx (puede ir en footer o sección dedicada):
    · Input email + botón suscribirse
    · useActionState para estado inline (no toast)
    · Estado success: mensaje de confirmación con animación Framer Motion
    · Estado error: mensaje descriptivo
  NewsletterFooterForm.tsx:
    · Versión compacta para el footer
    · Accesible: aria-label, role="form"

━━━ MÓDULO [11] LAYOUT COMPARTIDO & COMPONENTES GLOBALES ━━━
Feature: src/shared/

shared/ui/ — primitivos Radix:
  Button.tsx: variantes (primary, secondary, ghost, danger) con Tailwind
  Input.tsx: wrapper de Radix con label, error, helper text
  Badge.tsx: variantes de estado y color
  Dialog.tsx: wrapper Radix Dialog con animación Framer Motion
  Toast.tsx: wrapper Radix Toast, useToast hook
  Skeleton.tsx: bloques animados para loading states
  EmptyState.tsx: ilustración SVG + mensaje + CTA
  Spinner.tsx: accesible con aria-label

shared/layout/:
  Header.tsx (Server Component):
    · Logo Rosa y Menta
    · Nav principal: Catálogo, Novedades
    · SearchBar client
    · CartDrawerTrigger (use client) con badge de cantidad
    · FavoritesLink con badge
    · AuthNav: usuario logueado → menú cuenta / no logueado → login
  Footer.tsx (Server Component):
    · Links de navegación
    · NewsletterFooterForm
    · Redes sociales
    · Copyright + links legales
  MobileMenu.tsx (use client, Radix NavigationMenu o Sheet):
    · Nav completa en móvil con Radix Dialog slide-in

━━━ MÓDULO [12] HOMEPAGE ━━━
Ruta: app/(tienda)/page.tsx

Secciones (Server Components con Suspense):
  HeroBanner:
    · Imagen destacada Cloudinary con next/image priority
    · CTA principal "Ver colección"
  CategoriesGrid:
    · Grid de categorías con imagen y nombre
    · Suspense fallback: skeleton de 4 tarjetas
  FeaturedProducts:
    · Llama getProductosDestacados()
    · Suspense fallback: ProductGrid skeleton
  TrustBadges:
    · Array TRUST_BADGES hoiestado fuera del componente
    · Íconos Lucide + texto (Envío seguro, Devoluciones, Pago seguro)
  NewsletterBanner:
    · Sección de suscripción al newsletter

generateMetadata (homepage):
  title: default ('Rosa y Menta — Boutique de moda')
  OpenGraph: type website, imagen hero
  JSON-LD: LocalBusiness + WebSite + SearchAction

━━━ MÓDULO [13] SEO AVANZADO & PERFORMANCE ━━━

OpenGraph por tipo de página — resumen:
  Homepage       → og:type=website, imagen hero 1200×630
  Catálogo       → og:type=website, imagen banner catálogo
  Producto (PDP) → og:type=product, imagen principal producto 800×800
                   og:price:amount, og:price:currency (MXN)
                   og:availability (instock/oos según stock)
  Cuenta/privado → noindex, nofollow (no indexar)
  Checkout       → noindex, nofollow

JSON-LD por tipo de página:
  Homepage  → LocalBusiness + WebSite + SearchAction
  Catálogo  → ItemList (primeros 10 productos)
  Producto  → Product + Offer + AggregateRating + BreadcrumbList
  Checkout confirmación → Order

Performance:
  - React.cache() en todos los fetchers de server
  - Promise.all para fetches independientes en la misma page
  - next/dynamic para ImageGallery (Radix Dialog) y ReviewForm
  - memo() en CartItemRow, ReviewCard, ProductCard
  - useMemo/useCallback en providers de Zustand
  - optimizePackageImports para lucide-react y framer-motion
  - No setInterval — usar listeners focus/visibilitychange para refresco de carrito
  - useLatest hook en shared/hooks/ para listeners estables sin re-suscripción

Hooks compartidos (shared/hooks/):
  useLatest(value): ref que siempre apunta al valor actual
  useToast(): integración con Radix Toast
  useMediaQuery(query): SSR-safe
  useDebounce(value, delay): para SearchBar
  useOptimistic: wrapper sobre React.useOptimistic para favoritos

━━━ INSTRUCCIONES PARA LA IA ━━━
1. Empieza SIEMPRE por el Módulo [1]. Espera confirmación para cada módulo.
2. En cada módulo entrega: tipos TypeScript, schemas Zod, server actions, componentes y rutas.
3. Todos los componentes Server por defecto — "use client" solo cuando es estrictamente necesario,
   con comentario explicando por qué.
4. Nunca usar throw ni new Error() en server actions — siempre retornar ActionState.
5. Todos los formularios usan useActionState + useFormStatus (nunca useState+fetch manual).
6. OpenGraph y JSON-LD son obligatorios en cada ruta pública — no opcionales.
7. Cada ruta pública debe tener su loading.tsx con skeleton que matchea el layout final.
8. Cada route group debe tener su error.tsx con Radix Alert y botón de retry.
9. Al final de cada módulo pregunta: "¿Continuamos con el Módulo [N+1]?" y espera respuesta.
10. Si algo es ambiguo, pregunta antes de generar código.

━━━ COMENZAR ━━━
Empieza con el Módulo [1]: genera tsconfig.json, next.config.ts, tailwind.config.ts, middleware.ts, src/shared/lib/action-types.ts, src/shared/lib/api.ts, robots.txt, llms.txt y .env.local.example.