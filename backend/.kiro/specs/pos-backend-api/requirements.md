# Requirements Document — POS Backend API

## Introduction

The **POS Backend API** is a RESTful service for a Point of Sale system built with Java 21 and Spring Boot 3.x using Hexagonal Architecture (Ports & Adapters). The system manages the complete sales workflow: product catalog management, customer registration, cart operations, sales processing with automatic inventory control, invoicing, and sales history with reporting capabilities.

The API enforces business rules such as stock non-negativity, unique identifiers (SKU, NIT, invoice number), role-based access control (USER/ADMIN), and automatic IVA (19%) calculation. All endpoints are authenticated via JWT tokens.

---

## Glossary

- **POS_System**: The Point of Sale backend application exposing the REST API
- **Product**: A sellable item with unique SKU, price, cost, stock quantity, and category
- **SKU**: Stock Keeping Unit — a unique alphanumeric identifier for products
- **Category**: A hierarchical classification for products (supports parent-child relationships)
- **Customer**: A person or entity that makes purchases, identified by unique NIT
- **NIT**: Número de Identificación Tributaria — tax identification number unique per customer
- **Cart**: A temporary collection of products and quantities before sale processing
- **CartItem**: An individual entry in a cart linking a product with a quantity
- **Sale**: A completed transaction with invoice, payment method, and sale items
- **SaleItem**: An individual product entry in a completed sale
- **Invoice_Number**: A unique sequential identifier generated for each completed sale
- **IVA**: Impuesto al Valor Agregado — value-added tax at 19% on subtotal
- **PaymentGateway**: An abstraction for processing payments (cash, card, transfer)
- **USER**: A role with read access to products/customers and ability to process sales
- **ADMIN**: A role with all USER permissions plus product management and sale cancellation
- **Stock**: The quantity of a product available for sale
- **Low_Stock_Alert**: A notification when product stock falls at or below minimum threshold

---

## Requirements

### Requirement 1: Product Creation

**User Story:** As an ADMIN, I want to create products with unique SKU, so that the product catalog is accurately maintained.

#### Acceptance Criteria

1. WHEN an ADMIN submits a product with a unique SKU, a non-empty name, a price greater than zero with up to 2 decimal places, a cost greater than or equal to zero with up to 2 decimal places, a stock quantity greater than or equal to zero, and an existing category_id, THE POS_System SHALL create the product and return HTTP 201 with the created Product
2. WHEN a product is submitted with an existing SKU, THE POS_System SHALL reject the request with HTTP 409 Conflict and error code "DUPLICATE_SKU"
3. WHEN a product is submitted with price less than or equal to zero, THE POS_System SHALL reject the request with HTTP 400 Bad Request
4. WHEN a product is submitted with negative stock, THE POS_System SHALL reject the request with HTTP 400 Bad Request
5. WHEN a product is submitted with a non-existent category_id, THE POS_System SHALL reject the request with HTTP 404 Not Found and error code "CATEGORY_NOT_FOUND"
6. WHEN a product is submitted with a SKU longer than 50 characters, THE POS_System SHALL reject the request with HTTP 400 Bad Request
7. WHEN a product is submitted with an empty or null name, THE POS_System SHALL reject the request with HTTP 400 Bad Request
8. WHEN a product is submitted with negative cost, THE POS_System SHALL reject the request with HTTP 400 Bad Request

#### Correctness Properties

- **Uniqueness Invariant**: FOR ALL products p1, p2: if p1.id ≠ p2.id, then p1.sku ≠ p2.sku
- **Persistence Property**: WHEN a product is created successfully, THEN a subsequent GET request for that product SHALL return the same data
- **Price Precision Invariant**: FOR ALL products p: p.price has at most 2 decimal places AND p.price > 0
- **Stock Invariant**: FOR ALL products p: p.stock ≥ 0

---

### Requirement 2: Product Query

**User Story:** As a USER or ADMIN, I want to query products with pagination and filters, so that I can browse the catalog efficiently.

#### Acceptance Criteria

1. WHEN a USER or ADMIN requests the product list, THE POS_System SHALL return a paginated response with items, page, pageSize (default 20, max 100), totalItems, totalPages, hasNext, hasPrevious
2. WHEN a USER or ADMIN filters products by category_id, THE POS_System SHALL return only products belonging to that category
3. WHEN a USER or ADMIN filters by a non-existent category_id, THE POS_System SHALL return an empty items list with totalItems=0
4. WHEN a USER or ADMIN requests a product by valid ID, THE POS_System SHALL return HTTP 200 with the Product details
5. WHEN a USER or ADMIN requests a product by non-existent ID, THE POS_System SHALL return HTTP 404 with error code "PRODUCT_NOT_FOUND"
6. WHEN a USER or ADMIN searches products by name (partial match, 1-255 characters), THE POS_System SHALL return matching products case-insensitively in a paginated response
7. WHEN a USER or ADMIN searches with an empty string, THE POS_System SHALL return all products
8. WHEN a USER or ADMIN requests an out-of-range page number, THE POS_System SHALL return an empty items list

#### Correctness Properties

- **Pagination Invariant**: FOR ALL paginated responses: items.size ≤ pageSize AND 0 ≤ page ≤ totalPages (or page = 0 if empty)
- **Page Bounds Validity**: FOR ALL paginated responses: pageSize ≤ 100 AND pageSize ≥ 1
- **Filter Correctness**: FOR ALL products p in filtered result by category_id c: p.category.id = c
- **Pagination Consistency**: FOR ALL paginated responses: totalItems = COUNT(all matching items)

---

### Requirement 3: Product Update

**User Story:** As an ADMIN, I want to update product information, so that the catalog reflects current data.

#### Acceptance Criteria

1. WHEN an ADMIN updates a product with valid data, THE POS_System SHALL update the product and return HTTP 200 with the updated Product
2. WHEN an ADMIN updates a product with a different SKU that already exists, THE POS_System SHALL reject with HTTP 409 Conflict
3. WHEN a USER attempts to update a product, THE POS_System SHALL reject with HTTP 403 Forbidden
4. WHEN an ADMIN updates stock to a negative value, THE POS_System SHALL reject with HTTP 400 Bad Request
5. WHEN an ADMIN updates a non-existent product, THE POS_System SHALL return HTTP 404 with error code "PRODUCT_NOT_FOUND"
6. WHEN an ADMIN updates a product with price less than or equal to zero, THE POS_System SHALL reject with HTTP 400 Bad Request
7. WHERE the category_id does not exist in the system, THE POS_System SHALL reject with HTTP 404 Not Found and error code "CATEGORY_NOT_FOUND"

#### Correctness Properties

- **Stock Non-Negativity**: FOR ALL product updates: product.stock ≥ 0
- **Price Validity**: FOR ALL product updates: product.price > 0
- **Idempotency**: Updating the same product twice with identical data SHALL produce the same final state
- **Partial Update Correctness**: FOR ALL partial updates: fields not included in the request SHALL retain their previous values

---

### Requirement 4: Product Deletion

**User Story:** As an ADMIN, I want to delete products, so that obsolete items are removed from the catalog.

#### Acceptance Criteria

1. WHEN an ADMIN deletes an existing product with NO sale history, THE POS_System SHALL hard-delete the product and return HTTP 204 No Content
2. WHEN a USER attempts to delete a product, THE POS_System SHALL reject with HTTP 403 Forbidden
3. WHEN an ADMIN deletes a non-existent product, THE POS_System SHALL return HTTP 404 with error code "PRODUCT_NOT_FOUND"
4. WHEN an ADMIN deletes a product with existing sale history, THE POS_System SHALL set the product's active status to false and return HTTP 204 No Content
5. WHEN a product is soft-deleted, THE POS_System SHALL retain the product record for historical reference in sale items

#### Correctness Properties

- **Deletion Idempotency**: Deleting the same product ID twice SHALL result in HTTP 404 on second attempt
- **Referential Integrity**: FOR ALL sale_items si: si.product_id exists in products (even if inactive)
- **Active Status Boolean**: FOR ALL products p: p.active IS a boolean value (true = active, false = soft-deleted)
- **Soft-Delete Visibility**: FOR ALL soft-deleted products p: p.active = false AND p.id STILL EXISTS in database

---

### Requirement 5: Customer Registration

**User Story:** As a USER or ADMIN, I want to register customers with unique NIT, so that customers can be tracked for sales history.

#### Acceptance Criteria

1. WHEN a USER or ADMIN submits a customer with a unique NIT, THE POS_System SHALL create the customer and return HTTP 201
2. WHEN a customer is submitted with an existing NIT, THE POS_System SHALL reject with HTTP 409 Conflict and error code "DUPLICATE_NIT"
3. WHEN a customer is submitted without required fields (name, nit), THE POS_System SHALL reject with HTTP 400 Bad Request
4. WHEN a customer is submitted with an empty or whitespace-only name or NIT, THE POS_System SHALL reject with HTTP 400 Bad Request
5. IF customer_type is specified, THEN THE POS_System SHALL accept only values REGULAR, VIP, or CORPORATE
6. WHEN a customer is submitted without customer_type, THE POS_System SHALL assign customer_type as REGULAR
7. WHEN customer_type is VIP or CORPORATE, THE POS_System SHALL allow credit_limit between 0 and 999,999,999.99
8. IF credit_limit is submitted for a REGULAR customer, THEN THE POS_System SHALL reject with HTTP 400 Bad Request
9. IF credit_limit is negative or exceeds 999,999,999.99, THEN THE POS_System SHALL reject with HTTP 400 Bad Request

#### Correctness Properties

- **NIT Uniqueness**: FOR ALL customers c1, c2: if c1.id ≠ c2.id, then c1.nit ≠ c2.nit
- **Type-credit Consistency**: FOR ALL customers c: if c.type = "REGULAR", then c.credit_limit IS null
- **Credit Limit Validity**: FOR ALL customers c: if c.credit_limit IS NOT null, then 0 ≤ c.credit_limit ≤ 999,999,999.99

---

### Requirement 6: Customer Query

**User Story:** As a USER or ADMIN, I want to query customers, so that I can find customer information for sales.

#### Acceptance Criteria

1. WHEN a USER or ADMIN requests the customer list, THE POS_System SHALL return a paginated response
2. WHEN a USER or ADMIN searches customers by NIT, THE POS_System SHALL return the matching customer or HTTP 404
3. WHEN a USER or ADMIN requests a customer by valid ID, THE POS_System SHALL return HTTP 200 with Customer details
4. WHEN a USER or ADMIN filters customers by type (REGULAR, VIP, CORPORATE), THE POS_System SHALL return only matching customers

#### Correctness Properties

- **Filter Correctness**: FOR ALL customers c in filtered result by type t: c.type = t

---

### Requirement 7: Cart Creation

**User Story:** As a USER or ADMIN, I want to create a shopping cart, so that I can collect products before processing a sale.

#### Acceptance Criteria

1. WHEN a USER or ADMIN creates a cart, THE POS_System SHALL return HTTP 201 with a unique cart_id
2. WHEN a cart is created, THE POS_System SHALL initialize it with an empty items list
3. WHEN a cart is created with a customer_id, THE POS_System SHALL associate the cart with that customer

#### Correctness Properties

- **Empty Cart Invariant**: FOR ALL newly created carts c: c.items.isEmpty() = true

---

### Requirement 8: Cart Item Addition

**User Story:** As a USER or ADMIN, I want to add products to a cart with quantity validation, so that I can build my purchase.

#### Acceptance Criteria

1. WHEN a USER or ADMIN adds a product to a cart with sufficient stock and quantity between 1 and 999,999, THE POS_System SHALL add the item and return HTTP 200 with updated Cart
2. WHEN a product is added with quantity exceeding available stock, THE POS_System SHALL reject with HTTP 422 and error code "INSUFFICIENT_STOCK" including available quantity
3. WHEN a product is added to a cart that already contains it, IF the resulting quantity does not exceed available stock, THEN THE POS_System SHALL increase the quantity of the existing CartItem
4. WHEN a product is added to a cart that already contains it, IF the resulting quantity exceeds available stock, THEN THE POS_System SHALL reject with HTTP 422 and error code "INSUFFICIENT_STOCK" including available quantity
5. WHEN a non-existent product is added, THE POS_System SHALL return HTTP 404 with error code "PRODUCT_NOT_FOUND"
6. WHEN a product is inactive, THE POS_System SHALL reject with HTTP 400 and error code "PRODUCT_INACTIVE"
7. WHEN a product is added to a non-existent cart, THE POS_System SHALL return HTTP 404 with error code "CART_NOT_FOUND"
8. WHEN a product is added with quantity less than 1 or greater than 999,999, THE POS_System SHALL reject with HTTP 400 and error code "INVALID_QUANTITY"

#### Correctness Properties

- **Stock Validation**: FOR ALL cart_items ci: ci.quantity ≤ ci.product.stock
- **Quantity Bounds**: FOR ALL cart_items ci: 1 ≤ ci.quantity ≤ 999,999
- **Subtotal Correctness**: FOR ALL carts c: c.subtotal = SUM(ci.quantity × ci.product.price) for all ci in c.items
- **Tax Calculation**: FOR ALL carts c: c.tax = c.subtotal × 0.19 (rounded to 2 decimals)
- **Total Correctness**: FOR ALL carts c: c.total = c.subtotal + c.tax

---

### Requirement 9: Cart Item Removal

**User Story:** As a USER or ADMIN, I want to remove items from a cart, so that I can modify my purchase before checkout.

#### Acceptance Criteria

1. WHEN a USER or ADMIN removes an existing item from a cart, THE POS_System SHALL remove the item and return HTTP 200 with updated Cart
2. WHEN a non-existent item is removed, THE POS_System SHALL return HTTP 404 with error code "CART_ITEM_NOT_FOUND"
3. WHEN the last item is removed from a cart, THE POS_System SHALL return an empty cart (not delete the cart)

#### Correctness Properties

- **Removal Correctness**: AFTER removing item with product_id p from cart c: NOT EXISTS ci in c.items WHERE ci.product_id = p
- **Idempotency**: Removing the same item twice SHALL return HTTP 404 on second attempt

---

### Requirement 10: Sale Processing

**User Story:** As a USER or ADMIN, I want to process a sale from a cart, so that the transaction is completed with inventory deduction and invoice generation.

#### Acceptance Criteria

1. WHEN a USER or ADMIN processes a sale from a valid cart with sufficient stock, THE POS_System SHALL:
   - Validate all product stock in the cart
   - Deduct stock quantities from each product
   - Generate a unique sequential invoice_number
   - Create the Sale record with COMPLETED status
   - Return HTTP 201 with SaleResponse including all details
2. WHEN any product in the cart has insufficient stock, THE POS_System SHALL reject with HTTP 422 and error code "INSUFFICIENT_STOCK" with product details, without modifying any stock
3. WHEN a non-existent cart_id is provided, THE POS_System SHALL return HTTP 404 with error code "CART_NOT_FOUND"
4. WHEN payment processing fails via PaymentGateway, THE POS_System SHALL return HTTP 402 with error code "PAYMENT_FAILED" without deducting stock
5. WHEN a sale is processed, THE POS_System SHALL calculate subtotal, tax (19%), and total automatically

#### Correctness Properties

- **Atomicity Property**: IF any step in sale processing fails, THEN no stock changes SHALL persist
- **Stock Deduction Correctness**: FOR ALL products p after sale s: p.stock = (previous p.stock) - SUM(si.quantity WHERE si.product_id = p.id)
- **Invoice Uniqueness**: FOR ALL sales s1, s2: if s1.id ≠ s2.id, then s1.invoice_number ≠ s2.invoice_number
- **Invoice Sequential**: FOR ALL sales s processed after sale s_prev: s.invoice_number > s_prev.invoice_number (lexicographically)
- **Total Calculation**: FOR ALL sales s: s.total = s.subtotal + s.tax AND s.tax = s.subtotal × 0.19

---

### Requirement 11: Sale Cancellation

**User Story:** As an ADMIN, I want to cancel a completed sale, so that erroneous transactions can be reversed.

#### Acceptance Criteria

1. WHEN an ADMIN cancels a COMPLETED sale, THE POS_System SHALL:
   - Change sale status to CANCELLED
   - Revert stock quantities to each product
   - Return HTTP 200 with updated SaleResponse
2. WHEN a USER attempts to cancel a sale, THE POS_System SHALL reject with HTTP 403 Forbidden
3. WHEN an ADMIN attempts to cancel a sale already in CANCELLED status, THE POS_System SHALL reject with HTTP 400 and error code "SALE_ALREADY_CANCELLED"
4. WHEN an ADMIN attempts to cancel a non-existent sale, THE POS_System SHALL return HTTP 404 with error code "SALE_NOT_FOUND"
5. WHEN an ADMIN attempts to cancel a sale with PENDING or REFUNDED status, THE POS_System SHALL reject with HTTP 400 and error code "INVALID_SALE_STATUS_FOR_CANCELLATION"
6. IF stock restoration fails during cancellation, THE POS_System SHALL rollback the status change and return HTTP 500 with error code "CANCELLATION_FAILED"

#### Correctness Properties

- **Stock Reversal Correctness**: AFTER cancelling sale s, FOR ALL products p: p.stock = (stock at sale time) + SUM(si.quantity WHERE si.product_id = p.id)
- **State Invariant**: FOR ALL sales s: s.status ∈ {PENDING, COMPLETED, CANCELLED, REFUNDED}
- **Idempotency**: Attempting to cancel an already cancelled sale SHALL return HTTP 400 (not modify state further)
- **Atomicity**: IF any step in cancellation fails, THEN no state changes SHALL persist

---

### Requirement 12: Sales History Query

**User Story:** As a USER or ADMIN, I want to query sales history with filters, so that I can review past transactions.

#### Acceptance Criteria

1. WHEN a USER requests sales history, THE POS_System SHALL return only sales created by that USER
2. WHEN an ADMIN requests sales history, THE POS_System SHALL return all sales
3. WHEN a USER or ADMIN filters sales by date range (from_date, to_date), THE POS_System SHALL return sales within that range inclusive
4. WHEN a USER or ADMIN filters sales by customer_id, THE POS_System SHALL return sales for that customer
5. WHEN a USER or ADMIN filters sales by status (COMPLETED, CANCELLED, REFUNDED), THE POS_System SHALL return matching sales
6. WHEN a USER or ADMIN filters sales by payment_method (CASH, CARD, TRANSFER, MIXED), THE POS_System SHALL return matching sales
7. WHEN a USER or ADMIN requests a sale by ID, THE POS_System SHALL return HTTP 200 with full SaleResponse including items

#### Correctness Properties

- **Date Filter Correctness**: FOR ALL sales s in filtered result by date range [d1, d2]: d1 ≤ s.created_at ≤ d2
- **Authorization Correctness**: FOR ALL USER role requests: EVERY sale in result was created by that user
- **Pagination Invariant**: FOR ALL paginated sales history: items.size ≤ pageSize

---

### Requirement 13: Invoice Number Generation

**User Story:** As a USER or ADMIN, I want each sale to have a unique sequential invoice number, so that invoices are legally compliant and traceable.

#### Acceptance Criteria

1. WHEN a sale is completed, THE POS_System SHALL generate an invoice_number in format "INV-{YYYYMMDD}-{SEQUENCE}"
2. THE POS_System SHALL ensure invoice_number uniqueness across all sales
3. THE POS_System SHALL reset the sequence daily while maintaining overall uniqueness
4. WHEN multiple sales are processed simultaneously, THE POS_System SHALL guarantee unique invoice numbers via atomic sequence generation

#### Correctness Properties

- **Uniqueness**: FOR ALL sales s1, s2: if s1.id ≠ s2.id, then s1.invoice_number ≠ s2.invoice_number
- **Format Correctness**: FOR ALL sales s: s.invoice_number matches pattern "INV-\d{8}-\d+"
- **Monotonicity**: FOR ALL sales s1, s2 on same day: if s1.created_at < s2.created_at, then s1.sequence < s2.sequence

---

### Requirement 14: Stock Validation

**User Story:** As the system, I want to prevent stock from going negative, so that inventory accuracy is maintained.

#### Acceptance Criteria

1. WHEN any operation would result in negative stock, THE POS_System SHALL reject the operation with HTTP 422 and error code "INSUFFICIENT_STOCK"
2. WHEN stock is updated, THE POS_System SHALL enforce the constraint stock ≥ 0 at the database level
3. WHILE a product stock is at or below min_stock, THE POS_System SHALL mark the product as low_stock = true

#### Correctness Properties

- **Non-Negativity Invariant**: FOR ALL products p at ANY time: p.stock ≥ 0
- **Low Stock Detection**: FOR ALL products p: p.stock ≤ p.min_stock ↔ p.low_stock = true

---

### Requirement 15: Low Stock Alert

**User Story:** As an ADMIN, I want to be notified of low stock products, so that I can restock before stockout.

#### Acceptance Criteria

1. WHEN a product's stock falls to or below its min_stock threshold, THE POS_System SHALL set low_stock flag to true
2. WHEN an ADMIN queries for low stock products, THE POS_System SHALL return all products where stock ≤ min_stock
3. WHEN stock is replenished above min_stock, THE POS_System SHALL set low_stock flag to false

#### Correctness Properties

- **Alert Correctness**: FOR ALL products p: p.low_stock = (p.stock ≤ p.min_stock)

---

### Requirement 16: IVA Calculation

**User Story:** As the system, I want to calculate 19% IVA on sales, so that tax compliance is maintained.

#### Acceptance Criteria

1. WHEN a sale is processed, THE POS_System SHALL calculate tax = subtotal × 0.19 rounded to 2 decimal places
2. WHEN a cart is viewed, THE POS_System SHALL display subtotal, tax (19%), and total
3. THE POS_System SHALL store subtotal, tax, and total separately in each sale record

#### Correctness Properties

- **Tax Calculation**: FOR ALL sales s: s.tax = round(s.subtotal × 0.19, 2)
- **Total Correctness**: FOR ALL sales s: s.total = s.subtotal + s.tax

---

### Requirement 17: JWT Authentication

**User Story:** As a USER or ADMIN, I want to authenticate via JWT, so that I can securely access the API.

#### Acceptance Criteria

1. WHEN a user submits valid credentials to POST /api/v1/auth/login, THE POS_System SHALL return HTTP 200 with access_token and refresh_token
2. WHEN a user submits invalid credentials, THE POS_System SHALL return HTTP 401 with error code "INVALID_CREDENTIALS"
3. WHEN a user submits a valid refresh_token to POST /api/v1/auth/refresh, THE POS_System SHALL return a new access_token
4. WHEN an access_token expires (15 minutes), THE POS_System SHALL reject subsequent requests with HTTP 401
5. WHEN a request is made without a token to a protected endpoint, THE POS_System SHALL return HTTP 401

#### Correctness Properties

- **Token Validity**: FOR ALL successful authenticated requests: token.signature IS valid AND token.expiration > NOW
- **Password Security**: FOR ALL stored passwords p: p = bcrypt(raw_password) with strength 12

---

### Requirement 18: Role-Based Access Control

**User Story:** As the system, I want to enforce role-based permissions, so that users can only perform authorized operations.

#### Acceptance Criteria

1. WHEN a USER role user attempts to access GET /api/v1/products, THE POS_System SHALL allow the request
2. WHEN a USER role user attempts to access POST /api/v1/products, THE POS_System SHALL reject with HTTP 403 Forbidden
3. WHEN an ADMIN role user attempts any product endpoint, THE POS_System SHALL allow the request
4. WHEN a USER role user attempts to cancel a sale via POST /api/v1/sales/{id}/cancel, THE POS_System SHALL reject with HTTP 403 Forbidden
5. WHEN an ADMIN role user attempts to cancel a sale, THE POS_System SHALL allow the request if the sale is COMPLETED

#### Correctness Properties

- **Authorization Invariant**: FOR ALL requests: IF operation requires ADMIN role AND user.role ≠ ADMIN, THEN response.status = 403
- **USER Permissions**: FOR ALL USER role users: allowed_operations = {READ products, READ customers, CREATE customers, CREATE cart, MODIFY cart, PROCESS sale, READ own sales}

---

### Requirement 19: API Error Response Format

**User Story:** As a developer, I want consistent error response format, so that errors can be handled programmatically.

#### Acceptance Criteria

1. WHEN any error occurs, THE POS_System SHALL return a JSON response with fields: code, message, timestamp
2. WHEN a validation error occurs, THE POS_System SHALL return HTTP 400 with field-level error details
3. WHEN a not-found error occurs, THE POS_System SHALL return HTTP 404 with error code identifying the resource type
4. WHEN an unexpected error occurs, THE POS_System SHALL return HTTP 500 with a generic message and log the details

#### Correctness Properties

- **Response Format**: FOR ALL error responses: response contains fields "code" AND "message" AND "timestamp"
- **Timestamp Validity**: FOR ALL error responses: timestamp is ISO-8601 format

---

### Requirement 20: Paginated Response Format

**User Story:** As a developer, I want consistent paginated response format, so that list endpoints are predictable.

#### Acceptance Criteria

1. WHEN any list endpoint is called, THE POS_System SHALL return a PagedResponse with: items, page, pageSize, totalItems, totalPages, hasNext, hasPrevious
2. WHEN pageSize is not specified, THE POS_System SHALL use default pageSize of 20
3. WHEN pageSize exceeds 100, THE POS_System SHALL limit to 100
4. WHEN page is negative, THE POS_System SHALL treat it as page 0

#### Correctness Properties

- **Pagination Bounds**: FOR ALL paginated responses: 0 ≤ page < totalPages (or page = 0 if empty)
- **Page Size Limit**: FOR ALL paginated responses: pageSize ≤ 100
- **Navigation Correctness**: hasNext = (page < totalPages - 1), hasPrevious = (page > 0)

---

### Requirement 21: Payment Gateway Abstraction

**User Story:** As a developer, I want payment processing to be abstracted, so that different payment methods can be supported.

#### Acceptance Criteria

1. WHEN payment_method is CASH, THE POS_System SHALL process via CashPaymentGateway validating cash_received ≥ total
2. WHEN payment_method is CARD, THE POS_System SHALL process via CardPaymentGateway with card_details
3. WHEN payment_method is TRANSFER, THE POS_System SHALL process via TransferPaymentGateway with transfer_reference
4. WHEN payment processing fails for any method, THE POS_System SHALL return HTTP 402 with error code "PAYMENT_FAILED" and descriptive message
5. THE POS_System SHALL implement PaymentGateway as an interface in the domain layer

#### Correctness Properties

- **Interface Segregation**: PaymentGateway interface SHALL be defined in domain layer without infrastructure dependencies
- **Polymorphism**: FOR EACH PaymentGateway implementation: process(amount, details) returns PaymentResult

---

### Requirement 22: Category Hierarchy

**User Story:** As an ADMIN, I want hierarchical product categories, so that products can be organized in a tree structure.

#### Acceptance Criteria

1. WHEN an ADMIN creates a category with parent_id, THE POS_System SHALL create a child category under the specified parent
2. WHEN an ADMIN creates a category without parent_id, THE POS_System SHALL create a root-level category
3. WHEN an ADMIN requests a category, THE POS_System SHALL return the category with its parent and children references
4. WHEN an ADMIN attempts to delete a category with children, THE POS_System SHALL reject with HTTP 400 and error code "CATEGORY_HAS_CHILDREN"
5. WHEN an ADMIN attempts to delete a category with products, THE POS_System SHALL reject with HTTP 400 and error code "CATEGORY_HAS_PRODUCTS"

#### Correctness Properties

- **Hierarchy Invariant**: FOR ALL categories c: NOT EXISTS path from c to c via parent_id (no cycles)
- **Level Correctness**: FOR ALL root categories c: c.level = 0; FOR ALL child categories c: c.level = c.parent.level + 1

---

### Requirement 23: Product Stock Management

**User Story:** As an ADMIN, I want to manually adjust product stock, so that inventory can be corrected or restocked.

#### Acceptance Criteria

1. WHEN an ADMIN updates a product's stock to a non-negative value, THE POS_System SHALL update the stock and recalculate low_stock status
2. WHEN an ADMIN attempts to set stock to a negative value, THE POS_System SHALL reject with HTTP 400 Bad Request
3. WHEN stock is updated, THE POS_System SHALL record the updated_at timestamp

#### Correctness Properties

- **Non-Negativity**: FOR ALL stock updates: new_stock ≥ 0
- **Timestamp Update**: stock update → updated_at is set to current timestamp

---

### Requirement 24: REST API Documentation

**User Story:** As a developer, I want API documentation via OpenAPI/Swagger, so that the API can be explored and tested.

#### Acceptance Criteria

1. THE POS_System SHALL expose OpenAPI 3.0 specification at GET /api-docs
2. THE POS_System SHALL expose Swagger UI at GET /swagger-ui.html
3. THE POS_System SHALL document all endpoints with @Operation, @ApiResponse annotations
4. THE POS_System SHALL include JWT authentication scheme in OpenAPI specification

#### Correctness Properties

- **Documentation Completeness**: FOR ALL endpoints: operation summary exists AND response schemas are defined
- **Security Scheme**: OpenAPI spec contains securitySchemes with "bearer-jwt" type

---

### Requirement 25: Database Migration Management

**User Story:** As a developer, I want database migrations managed via Flyway, so that schema changes are versioned and reproducible.

#### Acceptance Criteria

1. WHEN the application starts, THE POS_System SHALL execute pending Flyway migrations
2. WHEN a migration fails, THE POS_System SHALL halt startup with descriptive error
3. THE POS_System SHALL store migration history in the flyway_schema_history table
4. ALL migrations SHALL be idempotent and reversible where possible

#### Correctness Properties

- **Migration Versioning**: FOR ALL migrations m: m.version is unique AND follows semantic versioning pattern
- **Schema Consistency**: AFTER all migrations: database schema matches entity definitions

---

## Non-Functional Requirements

### NFR 1: Response Time

THE POS_System SHALL respond to all read operations within 200ms under normal load (≤100 concurrent requests).

### NFR 2: Availability

THE POS_System SHALL achieve 99.5% uptime during business hours (8:00 - 22:00 local time).

### NFR 3: Test Coverage

THE POS_System SHALL maintain minimum 80% code coverage overall and 90% coverage in domain and application layers.

### NFR 4: Security

THE POS_System SHALL use BCrypt with strength 12 for password hashing and JWT tokens with 15-minute expiration.

### NFR 5: Data Integrity

THE POS_System SHALL enforce referential integrity and stock non-negativity at the database constraint level.

---

## Architecture Constraints

### AC 1: Hexagonal Architecture

The system SHALL follow Hexagonal Architecture (Ports & Adapters) with dependency rule: domain ← application ← infrastructure.

### AC 2: No Spring Dependencies in Domain

The domain layer SHALL NOT contain any Spring Framework annotations or dependencies.

### AC 3: Constructor Injection

ALL dependencies SHALL be injected via constructor injection, not field injection.

### AC 4: Interface Segregation for Ports

Each port (repository interface) SHALL define only the methods required by its consumer.

---

## Testing Strategy

### Unit Tests

- Test domain entity business logic in isolation
- Test application services with mocked repositories
- Minimum 90% coverage in domain layer

### Integration Tests

- Test repository adapters with Testcontainers (PostgreSQL)
- Test complete sale processing flow with rollback scenarios

### API Tests

- Test all REST endpoints with MockMvc
- Test authentication and authorization scenarios
- Test validation and error responses

### Property-Based Tests

- Test IVA calculation with various subtotal values
- Test pagination bounds with various page sizes
- Test stock invariants across concurrent operations
- Test invoice number uniqueness and format
- Test subtotal/tax/total calculations (round-trip properties)
