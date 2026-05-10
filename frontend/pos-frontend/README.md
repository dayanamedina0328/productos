# POS Frontend

Sistema de Punto de Venta (POS) construido con React + TypeScript siguiendo arquitectura hexagonal.

---

## Requisitos

- Node.js ≥ 18
- npm ≥ 9

---

## Instalación

```bash
npm install
```

---

## Variables de entorno

Copia el archivo de ejemplo y ajusta los valores:

```bash
cp .env.development .env.local
```

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | URL base del backend | `http://localhost:3000/api` |
| `VITE_APP_NAME` | Nombre de la aplicación | `POS Frontend` |
| `VITE_APP_VERSION` | Versión de la app | `0.1.0` |
| `VITE_SOURCEMAP` | Generar source maps | `true` / `false` |

---

## Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción |
| `npm run preview` | Previsualizar el build de producción |
| `npm run test` | Ejecutar tests en modo watch |
| `npm run test:coverage` | Ejecutar tests con reporte de cobertura |
| `npm run lint` | Verificar errores de ESLint |
| `npm run format` | Formatear código con Prettier |
| `npm run format:check` | Verificar formato sin modificar archivos |

---

## Arquitectura

El proyecto sigue **arquitectura hexagonal** (ports & adapters):

```
src/
├── domain/           # Entidades, puertos e interfaces del dominio
│   ├── entities/     # Product, Cart, Sale, Customer, Category
│   ├── ports/        # Interfaces de repositorios y gateways
│   ├── validations/  # Funciones puras de validación
│   └── events/       # Eventos de dominio
│
├── application/      # Casos de uso
│   ├── ports/        # Interfaces de los casos de uso
│   └── useCases/     # Implementaciones (20 use cases)
│
├── infrastructure/   # Adaptadores de infraestructura
│   ├── api/          # Adaptadores HTTP (Axios)
│   ├── storage/      # localStorage, IndexedDB, CacheManager
│   ├── payments/     # Gateways de pago (Cash, Card, Transfer, Mixed)
│   ├── mappers/      # Conversión API ↔ dominio
│   └── di/           # Contenedor de inyección de dependencias
│
└── ui/               # Capa de presentación (React)
    ├── components/
    │   ├── base/     # Primitivos: Button, Input, Modal, Table, etc.
    │   └── features/ # Componentes de dominio: ProductCard, CartItemRow, etc.
    ├── pages/        # Páginas: SalesPage, AdminPage y sub-páginas
    ├── hooks/        # useCart, useProducts, useSales, useCustomers
    └── store/        # Redux Toolkit: slices, selectors, store
```

### Regla de dependencias

```
ui → application → domain ← infrastructure
```

- `domain` no depende de nada externo
- `application` solo depende de `domain`
- `infrastructure` implementa los puertos de `domain`
- `ui` usa los casos de uso de `application`
- `container.ts` es el único lugar donde se instancian dependencias con `new`

---

## Rutas

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/` | Redirige a `/sales` | — |
| `/login` | Inicio de sesión | Público |
| `/sales` | Terminal de ventas | Autenticado |
| `/admin` | Panel de administración | Solo ADMIN |
| `/admin/products` | Gestión de productos | Solo ADMIN |
| `/admin/customers` | Gestión de clientes | Solo ADMIN |
| `/admin/sales` | Historial de ventas | Solo ADMIN |
| `/admin/reports` | Reportes y métricas | Solo ADMIN |

---

## Atajos de teclado (terminal de ventas)

| Atajo | Acción |
|-------|--------|
| `Ctrl+K` o `F2` | Enfocar búsqueda de productos |
| `F3` | Abrir selector de cliente |
| `Ctrl+Enter` | Confirmar checkout |
| `Escape` | Cerrar modal activo |
| `+` / `-` | Aumentar / disminuir cantidad |
| `Delete` | Eliminar ítem seleccionado |

---

## Tests

```bash
# Ejecutar todos los tests
npm run test

# Con cobertura
npm run test:coverage
```

Umbrales de cobertura configurados:
- Global: ≥ 80% (branches, functions, lines, statements)
- Dominio: ≥ 90% (configurado en `vite.config.ts`)

---

## Build de producción

```bash
npm run build
```

El build genera chunks separados por dominio funcional:
- `vendor-react` — React + Router
- `vendor-redux` — Redux Toolkit + Persist
- `vendor-forms` — React Hook Form + Yup
- `vendor-axios` — Axios
- Chunks lazy por ruta (SalesPage, AdminPage, etc.)
