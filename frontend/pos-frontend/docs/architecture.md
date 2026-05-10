# Guía de Arquitectura y Convenciones

## Arquitectura Hexagonal (Ports & Adapters)

El proyecto sigue arquitectura hexagonal para mantener el dominio de negocio completamente independiente de la infraestructura y la UI.

### Regla de dependencias

```
ui → application → domain ← infrastructure
```

- **`domain`** no importa nada externo. Solo TypeScript puro.
- **`application`** solo importa de `domain`.
- **`infrastructure`** implementa los puertos de `domain`.
- **`ui`** usa los casos de uso de `application` a través del contenedor DI.
- **`container.ts`** es el único lugar donde se usa `new` para instanciar dependencias.

---

## Estructura de carpetas

```
src/
├── domain/
│   ├── entities/          # Interfaces puras (Product, Cart, Sale, Customer)
│   │   └── valueObjects/  # Money, SKU, Quantity
│   ├── ports/             # Interfaces de repositorios y gateways
│   ├── validations/       # Funciones puras de validación
│   └── events/            # Eventos de dominio
│
├── application/
│   ├── ports/             # Interfaces de los casos de uso
│   └── useCases/          # Implementaciones (20 use cases)
│
├── infrastructure/
│   ├── api/               # Adaptadores HTTP (Axios)
│   ├── storage/           # localStorage, IndexedDB, CacheManager
│   ├── payments/          # Gateways de pago
│   ├── mappers/           # Conversión API ↔ dominio
│   └── di/                # container.ts — único punto de instanciación
│
├── ui/
│   ├── components/
│   │   ├── base/          # Primitivos: Button, Input, Modal, Table...
│   │   └── features/      # Componentes de dominio: ProductCard, CartItemRow...
│   ├── pages/             # Páginas: SalesPage, AdminPage y sub-páginas
│   ├── hooks/             # useCart, useProducts, useSales, useCustomers
│   └── store/             # Redux Toolkit: slices, selectors, store
│
└── shared/
    └── types/             # PaginatedResponse, Filters
```

---

## Convenciones de código

### Entidades de dominio

- Son **interfaces puras** (no clases con métodos de instancia).
- Todos los campos son `readonly`.
- Los value objects (`Money`, `SKU`, `Quantity`) sí son clases con lógica.

```typescript
// ✅ Correcto
export interface Product {
  readonly id: string;
  readonly price: number;
}

// ❌ Incorrecto — no usar clases con métodos para entidades
export class Product {
  calculateDiscount() { ... }
}
```

### Validaciones

- Son **funciones puras** o clases con **métodos estáticos**.
- Retornan `ValidationResult` (nunca lanzan excepciones directamente).

```typescript
// ✅ Correcto
export class ProductValidations {
  static validatePrice(price: number): ValidationResult { ... }
}

// ✅ Correcto
export function isProductAvailable(product: Product): boolean { ... }
```

### Casos de uso

- Una clase por caso de uso.
- Un único método público: `execute(...)`.
- Reciben dependencias por constructor (inyección de dependencias).
- Lanzan `Error` con mensajes descriptivos cuando la operación no es válida.

```typescript
export class ProcessSaleUseCase implements ProcessSale {
  constructor(
    private readonly saleRepository: SaleRepository,
    private readonly cartRepository: CartRepository,
    private readonly paymentGateway: PaymentGateway
  ) {}

  async execute(request: ProcessSaleRequest): Promise<Sale> { ... }
}
```

### Adaptadores

- Implementan exactamente una interfaz de repositorio o gateway del dominio.
- Usan los mappers para convertir entre la respuesta de la API y las entidades de dominio.
- Nunca exponen detalles de implementación (Axios, localStorage, etc.) fuera de `infrastructure/`.

### Componentes React

- Componentes funcionales con TypeScript.
- Props tipadas con interfaces explícitas.
- Nombres que no colisionen con APIs del DOM (`AppNotification` no `Notification`, `CartItemRow` no `CartItem`).
- Accesibilidad: `aria-*`, `role`, `aria-label` en todos los elementos interactivos.

### Redux

- Un slice por dominio funcional.
- Thunks para operaciones asíncronas (llamadas a casos de uso).
- Selectores memoizados con `createSelector` para datos derivados.
- `container.ts` provee las instancias de casos de uso a los thunks.

---

## Naming conventions

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Interfaces de dominio | PascalCase | `Product`, `Cart` |
| Clases de casos de uso | `NombreUseCase` | `ProcessSaleUseCase` |
| Interfaces de puertos | `NombreRepository` / `NombreGateway` | `SaleRepository` |
| Adaptadores | `NombreAPIAdapter` / `NombreAdapter` | `ProductAPIAdapter` |
| Mappers | `NombreMapper` | `ProductMapper` |
| Componentes React | PascalCase | `ProductCard`, `CartItemRow` |
| Hooks | `useNombre` | `useCart`, `useProducts` |
| Slices Redux | `nombreSlice` | `cartSlice`, `uiSlice` |
| Archivos de test | `Nombre.test.ts(x)` | `ProductCard.test.tsx` |

---

## Flujo de datos

```
Usuario interactúa con UI
  → Componente llama a hook (useCart, useProducts...)
    → Hook despacha thunk de Redux o llama directamente al use case
      → Use case valida y orquesta
        → Repositorio/Gateway (adaptador) hace la llamada real
          → Mapper convierte la respuesta al dominio
            → Estado Redux se actualiza
              → Componente re-renderiza
```

---

## Gestión de errores

- Los casos de uso lanzan `Error` con mensajes en inglés (para logging).
- Los hooks/thunks capturan el error y lo almacenan en el estado Redux (`error: string | null`).
- Los componentes muestran el error al usuario con `AppNotification` o `EmptyState`.
- El `ErrorBoundary` captura errores de renderizado no controlados.

---

## Testing

- **Dominio**: cobertura ≥ 90%. Tests unitarios puros sin mocks.
- **Casos de uso**: mocks de repositorios con `vi.fn()`.
- **Adaptadores**: mocks de Axios/localStorage.
- **Componentes**: Testing Library con `render`, `screen`, `userEvent`.
- **Slices Redux**: tests de reducers + thunks con store real.
- Archivos de test junto al archivo que testean (`Nombre.test.ts` al lado de `Nombre.ts`).
