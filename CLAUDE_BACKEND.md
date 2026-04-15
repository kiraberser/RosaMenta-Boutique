Eres un arquitecto de software experto en Django, DRF y Next.js. Construirás un sistema e-commerce production-grade para "Rosa y Menta", boutique de ropa y accesorios. Guíame módulo a módulo esperando confirmación antes de avanzar.

━━━ STACK ━━━
Backend        : Django 4.x + Django REST Framework
Frontend       : Next.js App Router (repo separado)
Base de datos  : PostgreSQL — Railway managed plugin
Auth           : JWT · simplejwt · token blacklist · refresh rotation
Imágenes       : Cloudinary (MediaCloudinaryStorage, upload firmado)
Email          : Brevo (API transaccional, no SMTP)
Pagos          : MercadoPago (app desacoplada, pluggable)
Static files   : WhiteNoise + GzipMiddleware
Async tasks    : Celery + Redis (emails, webhooks de pago)
Monitoreo      : Sentry SDK + logging estructurado
Docs API       : drf-spectacular (OpenAPI auto-generado)
Deploy         : Railway (backend + Redis plugin)
Locale         : es-MX · America/Mexico_City

━━━ ARQUITECTURA DE CARPETAS ━━━
rosa_y_menta/
├── apps/
│   ├── usuarios/        # Custom user, auth, direcciones, email bienvenida
│   ├── productos/       # Catálogo, variantes, imágenes (Cloudinary)
│   ├── inventario/      # Stock, movimientos, proveedores, compras
│   ├── pedidos/         # Cart, Order workflow, servicios de negocio
│   ├── ventas/          # POS interno (solo admin)
│   ├── pagos/           # MercadoPago desacoplado
│   ├── newsletter/      # Suscriptores, campañas, envío masivo
│   └── reportes/        # Dashboard, métricas, exportación
├── config/
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py          # /api/v1/ prefijo versionado
│   └── wsgi.py / asgi.py
├── core/                # Mixins, paginación custom, permisos globales
├── .env.example
├── Procfile
├── railway.toml
└── requirements.txt

━━━ MÓDULO [1] CONFIGURACIÓN BASE & DEPLOY ━━━
Genera estos archivos listos para Railway:

settings/base.py:
  - django-environ con .env, SECRET_KEY, JWT_SIGNING_KEY separada
  - AUTH_USER_MODEL = 'usuarios.Usuario'
  - DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
  - LANGUAGE_CODE = 'es-mx', TIME_ZONE = 'America/Mexico_City'
  - Cloudinary: DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
  - INSTALLED_APPS con todas las apps y third-party (incluir newsletter)
  - REST_FRAMEWORK global:
      · DEFAULT_AUTHENTICATION_CLASSES: JWTAuthentication
      · DEFAULT_PERMISSION_CLASSES: IsAuthenticated
      · DEFAULT_PAGINATION_CLASS: PageNumberPagination, PAGE_SIZE=10
      · DEFAULT_FILTER_BACKENDS: DjangoFilterBackend, SearchFilter, OrderingFilter
      · DEFAULT_SCHEMA_CLASS: AutoSchema de drf-spectacular
  - SIMPLE_JWT:
      · ACCESS_TOKEN_LIFETIME = timedelta(hours=12)
      · REFRESH_TOKEN_LIFETIME = timedelta(days=7)
      · ROTATE_REFRESH_TOKENS = True
      · BLACKLIST_AFTER_ROTATION = True
      · SIGNING_KEY = env('JWT_SIGNING_KEY')
  - SPECTACULAR_SETTINGS: título, versión, descripción

settings/production.py:
  - DATABASE_URL via dj_database_url con conn_max_age=600
  - ALLOWED_HOSTS desde env + Railway domain
  - SECURE_PROXY_SSL_HEADER, SECURE_SSL_REDIRECT = True
  - SECURE_HSTS_SECONDS=31536000, INCLUDE_SUBDOMAINS, PRELOAD
  - SECURE_CONTENT_TYPE_NOSNIFF, X_FRAME_OPTIONS='DENY'
  - SESSION_COOKIE_SECURE, CSRF_COOKIE_SECURE, SameSite=None
  - CSRF_TRUSTED_ORIGINS desde env
  - CORS_ALLOW_ALL_ORIGINS = False
  - CORS_ALLOWED_ORIGINS + CORS_ALLOWED_ORIGIN_REGEXES:
      ['https://.*\\.vercel\\.app', 'https://.*\\.ngrok-free\\.app']
  - CORS_ALLOW_CREDENTIALS = True, headers acotados
  - THROTTLE solo en prod: 1000/h user, 500/h anon
  - django-csp: img-src res.cloudinary.com, default-src 'self'
  - WhiteNoise: STATICFILES_STORAGE CompressedManifestStaticFilesStorage
  - Sentry: sentry_sdk.init() con traces_sample_rate=0.2
  - Logging estructurado: handlers → console (JSON en prod), Sentry
  - Celery: CELERY_BROKER_URL = env('REDIS_URL')

settings/development.py:
  - DEBUG = True, sin cookies Secure, sin HSTS, sin SSL redirect
  - DATABASE local con fallback a vars individuales vía dj_database_url
  - CORS_ALLOW_ALL_ORIGINS = True para desarrollo local

Archivos de deploy:
  - Procfile:
      web:    gunicorn config.wsgi --log-file -
      worker: celery -A config worker -l info
  - railway.toml: buildCommand (pip install + collectstatic + migrate)
  - .env.example completo

━━━ MÓDULO [2] USUARIOS & AUTENTICACIÓN ━━━
- Modelo Usuario (AbstractUser): campos extra phone, avatar (CloudinaryField)
- Modelo Direccion: usuario FK, calle, ciudad, cp, estado, pais, es_principal
  Límite de negocio: máximo 3 direcciones por usuario (validar en serializer)
- Endpoints JWT:
    POST /api/v1/auth/register/
    POST /api/v1/auth/login/
    POST /api/v1/auth/logout/        ← blacklist del refresh token
    POST /api/v1/auth/token/refresh/
    GET/PUT /api/v1/auth/me/
- Permisos: IsAdmin (is_staff), IsClient, IsOwnerOrAdmin
- Email de bienvenida al registrarse:
    · Disparado por señal post_save en Usuario (created=True)
    · Tarea Celery: enviar_bienvenida.delay(usuario_id)
    · Enviado vía Brevo API transaccional
    · Contenido: saludo por nombre, enlace para explorar catálogo,
      botón de acceso a su cuenta, firma visual de Rosa y Menta
    · Plantilla HTML definida en usuarios/templates/emails/bienvenida.html
    · Si el usuario marcó suscribirse al newsletter durante el registro,
      crear automáticamente un registro Suscriptor activo en la app newsletter

━━━ MÓDULO [3] PRODUCTOS & CATÁLOGO ━━━
- Modelo Categoria: nombre, slug, padre (FK self, árbol 2 niveles)
- Modelo Marca: nombre, logo (CloudinaryField)
- Modelo Producto:
    nombre, descripcion, precio, precio_descuento
    sku (codigo_parte, único)
    estado: choices NVO/UBS/REC (Nuevo/Usado/Reacondicionado)
    categoria FK, marca FK
    activo bool, destacado bool
    created_at, updated_at
- Modelo ProductoImagen: producto FK, imagen (CloudinaryField), orden, es_principal
- Modelo ProductoVariante: producto FK, talla, color, sku_variante (único), precio_extra
- ViewSet de Productos:
    · select_related('categoria', 'marca') + prefetch_related('imagenes', 'variantes')
    · Filter: DjangoFilterBackend por categoria/marca/estado/activo
    · Search: nombre, descripcion, sku
    · Ordering: precio, created_at
    · Solo admin puede crear/editar/eliminar (IsAdminOrReadOnly)
- Validación de imagen antes de subir a Cloudinary:
    formatos: jpg/png/webp, tamaño máx: 5 MB
- Carpeta Cloudinary destino: rosa-y-menta/productos/

━━━ MÓDULO [4] INVENTARIO ━━━
- Modelo Stock: variante FK, cantidad, stock_minimo
- Modelo MovimientoStock: tipo (ENT/SAL/AJU), cantidad, motivo, fecha, usuario FK
  → señal post_save en ventas y pedidos para registrar SAL automáticamente
- Modelo Proveedor: nombre, contacto, email, productos M2M
- Modelo OrdenCompra y OrdenCompraItem:
    estado: BOR/CON/REC (Borrador/Confirmado/Recibido)
    Al confirmar recepción → atomic transaction → sumar Stock + MovimientoStock ENT
- Paginación custom en inventario/pagination.py (50 items por página)
- Endpoint de stock bajo: variantes con cantidad ≤ stock_minimo

━━━ MÓDULO [5] PEDIDOS & CARRITO ━━━
- Modelo Carrito: usuario FK (null para sesión anónima), session_key, creado_en
- Modelo CarritoItem: carrito FK, variante FK, cantidad, precio_snapshot
- Modelo Pedido: cabecera
    numero_pedido (auto UUID truncado), usuario FK, direccion FK
    estado workflow: CRE/PAG/ENV/ENT/CAN
    subtotal, descuento, total, notas
    metodo_pago snapshot
- Modelo PedidoItem: líneas
    pedido FK, variante FK, cantidad, precio_unitario (snapshot)
- Capa de servicios → pedidos/services.py:
    crear_pedido_desde_carrito(usuario, direccion_id):
        · atomic transaction
        · validar stock de cada variante
        · crear Pedido + PedidoItems con precio_snapshot
        · descontar Stock + registrar MovimientoStock SAL
        · vaciar Carrito
        · disparar tarea Celery: enviar_email_confirmacion.delay(pedido_id)
- Paginación custom en pedidos/pagination.py (20 items)
- Historial de pedidos por cliente (filtrable por estado y fecha)

━━━ MÓDULO [6] VENTAS (POS INTERNO) ━━━
- Solo accesible por admin/vendedor
- Modelo VentaPOS: numero_ticket, vendedor FK, metodo_pago, total, descuento, fecha
- Modelo VentaPOSItem: venta FK, variante FK, cantidad, precio_unitario
- Flujo: buscar por nombre/SKU → agregar items → aplicar descuento → cerrar venta
  → atomic transaction → descontar Stock + MovimientoStock SAL
- Métodos de pago: EFE/TAR/TRA (Efectivo/Tarjeta/Transferencia)
- Endpoint que devuelve ticket en JSON (imprimible desde frontend)

━━━ MÓDULO [7] PAGOS (DESACOPLADO) ━━━
- App independiente pagos/ — no modifica Pedido directamente, usa señales
- Modelo Pago: pedido FK, referencia_externa, proveedor (MP/STR), monto, estado, payload JSON
- MercadoPago integration:
    POST /api/v1/pagos/mp/crear-preferencia/  → devuelve init_point
    POST /api/v1/pagos/mp/webhook/            → valida firma, actualiza Pago
    Señal post_save en Pago → si estado=APR → actualizar Pedido.estado=PAG
- Email transaccional vía Brevo API (tarea Celery):
    Confirmación de pedido, pago aprobado, cambio de estado de envío

━━━ MÓDULO [8] NEWSLETTER ━━━
- Modelo Suscriptor:
    email (único), nombre (opcional)
    activo (bool, default=True)
    token_baja (UUID, auto-generado) ← para link de unsubscribe sin login
    fecha_suscripcion, fecha_baja (null si activo)
    origen: choices REG/FORM (Registro/Formulario independiente)
      REG  → suscrito al crear cuenta con checkbox marcado
      FORM → suscrito desde formulario público del footer/landing
- Modelo Campana:
    asunto, cuerpo_html, cuerpo_texto (fallback plain-text)
    estado: choices BOR/ENV (Borrador/Enviada)
    fecha_envio (null hasta que se dispara)
    creada_por FK Usuario (admin)
    total_enviados, total_abiertos (contadores actualizables)
- Endpoints:
    POST /api/v1/newsletter/suscribir/
        · Público (AllowAny)
        · Acepta: email, nombre (opcional), origen=FORM
        · Si el email ya existe y activo=False → reactivar
        · Si el email ya existe y activo=True → responder 200 sin duplicar
        · Enviar email de confirmación de suscripción vía Brevo (Celery)
    GET  /api/v1/newsletter/baja/?token=/
        · Público (AllowAny), sin autenticación
        · Buscar Suscriptor por token_baja → activo=False, fecha_baja=now()
        · Responder 200 con mensaje de confirmación
    POST /api/v1/newsletter/campanas/          ← solo admin, crea campaña borrador
    POST /api/v1/newsletter/campanas/{id}/enviar/  ← solo admin, dispara envío
        · Tarea Celery: enviar_campana.delay(campana_id)
            - Obtener todos los Suscriptor con activo=True
            - Enviar email individual vía Brevo API por cada suscriptor
            - Incluir link de baja personalizado con token_baja en cada email
            - Actualizar Campana.total_enviados y Campana.fecha_envio al terminar
- Integración con registro de usuarios (Módulo [2]):
    · Si usuario marca "Quiero recibir novedades" al registrarse
      → señal post_save crea Suscriptor(email=usuario.email, origen='REG', activo=True)
- Plantillas de email (newsletter/templates/emails/):
    confirmacion_suscripcion.html
    campana_base.html  ← heredable para cada campaña

━━━ MÓDULO [9] REPORTES & DASHBOARD ━━━
- Todos los endpoints requieren IsAdmin
- Ventas del día / semana / mes (POS + pedidos online agrupados)
- Top 10 productos más vendidos (por cantidad y por ingresos)
- Stock bajo (variantes con cantidad ≤ stock_minimo)
- Historial de movimientos de inventario (filtrable por fecha, tipo, producto)
- Ingresos por método de pago
- Endpoint de exportación CSV básico para ventas del período
- Métricas de newsletter: total suscriptores activos, bajas del mes

━━━ INSTRUCCIONES PARA LA IA ━━━
1. Empieza SIEMPRE por el Módulo [1]. Espera confirmación para cada módulo.
2. En cada módulo entrega: modelos, serializers, viewsets, urls, permisos y services si aplica.
3. Usa siempre atomic transactions en operaciones que modifican Stock.
4. Usa select_related/prefetch_related sistemáticamente en todos los ViewSets con FK.
5. La capa de servicios (services.py) contiene la lógica de negocio — las views solo orquestan.
6. Los emails y webhooks de pago siempre van por tareas Celery, nunca síncronos en la view.
7. Al final de cada módulo pregunta: "¿Continuamos con el Módulo [N+1]?" y espera respuesta.
8. Si algo es ambiguo, pregunta antes de generar código.
9. El frontend Next.js se construirá en una sesión separada — enfócate en una API REST robusta.

━━━ COMENZAR ━━━
Empieza con el Módulo [1]: genera la estructura de carpetas completa, los tres archivos settings/, Procfile, railway.toml, .env.example y requirements.txt.