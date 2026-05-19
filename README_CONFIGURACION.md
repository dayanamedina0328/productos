# POS - Sistema de Punto de Venta (Solo Compras)

## 📋 Descripción del Proyecto

Sistema de Punto de Venta (POS) enfocado **exclusivamente en realizar compras**. No incluye gestión de productos en la interfaz; los productos se agregan directamente en la base de datos.

**Características principales:**
- Terminal de ventas completa
- Historial de ventas
- Reportes y métricas
- Gestión de clientes (solo consulta)
- Múltiples métodos de pago (efectivo, tarjeta, transferencia)

## 🏗️ Arquitectura

- **Backend:** Java 21 + Spring Boot 3.3.5 + PostgreSQL 16
- **Frontend:** React 19 + TypeScript + Vite + TailwindCSS
- **Arquitectura:** Hexagonal (Ports & Adapters)
- **Base de datos:** PostgreSQL con migraciones Flyway

## 🚀 Configuración y Despliegue

### Prerrequisitos

- Docker y Docker Compose
- Java 21
- Node.js 18+
- Maven 3.8+

### 1. Base de Datos

```bash
cd backend/pos-backend
docker compose up -d
```

Esto iniciará PostgreSQL en el puerto 5433 con las siguientes credenciales:
- Base de datos: `pos_db`
- Usuario: `pos_user`
- Contraseña: `pos_password`

Las migraciones Flyway se ejecutan automáticamente al iniciar el backend.

### 2. Backend

```bash
cd backend/pos-backend
./mvnw spring-boot:run
```

El backend estará disponible en:
- API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- Actuator: http://localhost:8080/actuator/health

### 3. Frontend

```bash
cd frontend/pos-frontend
npm install
npm run dev
```

El frontend estará disponible en:
- Aplicación: http://localhost:5173

## 👥 Usuarios del Sistema

El sistema incluye dos usuarios por defecto (contraseña: `password`):

| Usuario | Rol | Acceso |
|---------|-----|--------|
| `admin` | ADMIN | Terminal de ventas + Panel de administración |
| `cajero` | USER | Solo terminal de ventas |

**Nota:** La autenticación está deshabilitada en modo desarrollo para facilitar las pruebas.

## 📦 Productos

Los productos se agregan **directamente en la base de datos**. No hay interfaz para gestionar productos.

### Productos semilla (cargados automáticamente)

| SKU | Nombre | Precio | Stock |
|-----|--------|--------|-------|
| PHO-001 | iPhone 15 Pro | $1200.00 | 15 |
| PHO-002 | Samsung Galaxy S24 Ultra | $1300.00 | 10 |
| AUD-001 | Sony WH-1000XM5 | $350.00 | 20 |
| SNA-001 | Papas Fritas Lays | $2.50 | 50 |
| BEV-001 | Coca-Cola Zero | $1.50 | 100 |
| COM-001 | MacBook Air M3 | $1499.00 | 2 |

### Agregar nuevos productos

Conéctate a PostgreSQL y ejecuta:

```sql
INSERT INTO products (id, sku, name, description, price, cost, stock, min_stock, category_id, image_url, is_active, low_stock)
VALUES (
    'prod-007',
    'SKU-007',
    'Nombre del Producto',
    'Descripción',
    100.00,
    50.00,
    10,
    5,
    'cat-general',
    'https://url-de-imagen',
    true,
    false
);
```

## 🎯 Flujo de Compras

1. **Login:** Ingresa con usuario `admin` o `cajero`
2. **Terminal de ventas:** Busca productos por nombre o SKU
3. **Agregar al carrito:** Selecciona productos y ajusta cantidades
4. **Seleccionar cliente:** Opcional, para facturación con NIT
5. **Procesar pago:** Elige método (efectivo, tarjeta, transferencia)
6. **Generar factura:** El sistema genera factura única automáticamente
7. **Actualizar stock:** El stock se decrementa automáticamente

## 📊 Panel de Administración

El panel de administración incluye solo:

- **Ventas:** Historial completo de ventas con filtros
- **Reportes:** Métricas diarias, semanales y mensuales

**Nota:** Las secciones de "Productos" y "Clientes" fueron removidas del sistema según requerimiento.

## 🔧 Variables de Entorno

### Backend (`application.yml`)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5433/pos_db
    username: pos_user
    password: pos_password

app:
  jwt:
    secret: 404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
    access-token-expiration: 900000  # 15 minutos
    refresh-token-expiration: 604800000  # 7 días
```

### Frontend (`.env.development`)

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_NAME=POS Frontend
VITE_APP_VERSION=0.1.0
VITE_SOURCEMAP=true
```

## 🛠️ Comandos Útiles

### Backend

```bash
# Ejecutar tests
./mvnw test

# Build de producción
./mvnw clean package

# Ejecutar con perfil de producción
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
```

### Frontend

```bash
# Ejecutar tests
npm run test

# Build de producción
npm run build

# Preview del build de producción
npm run preview

# Verificar cobertura de tests
npm run test:coverage
```

### Base de Datos

```bash
# Conectarse a PostgreSQL
docker exec -it pos_postgres psql -U pos_user -d pos_db

# Ver todos los productos
SELECT * FROM products;

# Ver historial de ventas
SELECT * FROM sales ORDER BY created_at DESC;

# Ver stock actual
SELECT sku, name, stock, low_stock FROM products WHERE is_active = true;
```

## 📝 Estructura del Proyecto

```
api/
├── backend/
│   └── pos-backend/
│       ├── src/main/java/com/pos/backend/
│       │   ├── domain/          # Entidades y lógica de dominio
│       │   ├── application/     # Casos de uso
│       │   └── infrastructure/  # Adaptadores (DB, API, Security)
│       └── src/main/resources/
│           ├── db/migration/     # Migraciones Flyway
│           └── application.yml   # Configuración
└── frontend/
    └── pos-frontend/
        └── src/
            ├── domain/          # Entidades de dominio
            ├── application/     # Casos de uso
            ├── infrastructure/  # Adaptadores (API, Storage)
            └── ui/              # Componentes React
```

## ⚠️ Notas Importantes

1. **Solo compras:** Este sistema NO permite gestionar productos desde la interfaz. Los productos se agregan directamente en la base de datos.

2. **Autenticación en desarrollo:** Deshabilitada para facilitar pruebas. En producción, habilitar en `SecurityConfig.java`.

3. **Stock no negativo:** El sistema previene stock negativo en todas las operaciones.

4. **Facturación automática:** Cada venta genera un número de factura único en formato `INV-YYYYMMDD-SEQUENCE`.

5. **IVA 19%:** Calculado automáticamente sobre el subtotal.

## 🐛 Solución de Problemas

### Backend no inicia

```bash
# Verificar que PostgreSQL esté corriendo
docker ps | grep pos_postgres

# Ver logs del backend
./mvnw spring-boot:run
```

### Frontend no conecta al backend

- Verificar que el backend esté corriendo en http://localhost:8080
- Verificar la variable `VITE_API_BASE_URL` en `.env.development`

### Error de Flyway

```bash
# Limpiar historial de migraciones (SOLO desarrollo)
docker exec -it pos_postgres psql -U pos_user -d pos_db -c "DELETE FROM flyway_schema_history WHERE version = 'X';"
```

## 📞 Soporte

Para problemas o preguntas, revisa:
- Swagger UI: http://localhost:8080/swagger-ui.html
- Logs del backend en consola
- Logs del frontend en consola del navegador
