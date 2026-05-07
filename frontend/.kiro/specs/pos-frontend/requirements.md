# Requirements — SOAP POS Frontend

## General Description

**SOAP POS** is a web-based point of sale application built with React 18 + TypeScript 5 under a hexagonal architecture. It allows operators to process sales, issue invoices, and manage inventory from a web interface optimized for a cash register terminal.

Two user roles: **Cashier (USER)** and **Administrator (ADMIN)**.

---

## Functional Requirements

### RF-01 — Authentication and Roles

- **RF-01.1** The system must allow login with credentials (username and password).
- **RF-01.2** The system must support two roles: `USER` (Cashier) and `ADMIN` (Administrator).
- **RF-01.3** The `USER` role can process sales, look up products and customers, and view their own sales history.
- **RF-01.4** The `ADMIN` role has access to everything above plus product, customer, user management and full reports.
- **RF-01.5** Protected routes must redirect to login if the user is not authenticated.
- **RF-01.6** Admin routes must redirect with a 403 error if the authenticated user does not have the `ADMIN` role.

### RF-02 — Sales Terminal

- **RF-02.1** The cashier must be able to search for products by name or SKU using a search field with a 300 ms debounce.
- **RF-02.2** Products must be filterable by category using tabs.
- **RF-02.3** When selecting a product, the system must validate that stock is available before adding it to the cart.
- **RF-02.4** The cashier must be able to adjust the quantity of each cart item (increment, decrement, or enter a value directly).
- **RF-02.5** The cashier must be able to remove individual items from the cart.
- **RF-02.6** The cashier must be able to clear the entire cart.
- **RF-02.7** The cashier must be able to associate a customer with the cart to issue an invoice with NIT.
- **RF-02.8** The system must display subtotal, VAT (19 %) and total in real time as the cart is modified.
- **RF-02.9** The cashier must be able to hold an ongoing sale to attend another one.
- **RF-02.10** The cashier must be able to apply discounts to items or to the cart total.

### RF-03 — Checkout and Invoicing

- **RF-03.1** When starting checkout, the system must display a modal with the order summary.
- **RF-03.2** The system must support three payment methods: cash, card, and bank transfer.
- **RF-03.3** For cash payment, the system must calculate and display the change to return.
- **RF-03.4** For card payment, the system must request the last four digits and the authorization code.
- **RF-03.5** For bank transfer payment, the system must request the voucher reference.
- **RF-03.6** Upon completing the sale, the system must generate an invoice with a unique number, product details, subtotal, VAT, and total.
- **RF-03.7** After completing the sale, the stock of each sold product must be decremented automatically.
- **RF-03.8** After completing the sale, the cart must be cleared and ready for the next operation.

### RF-04 — Product Management (ADMIN)

- **RF-04.1** The administrator must be able to create products with the fields: SKU, name, description, price, cost, stock, minimum stock, category, and image (optional).
- **RF-04.2** The administrator must be able to edit any field of an existing product.
- **RF-04.3** The administrator must be able to deactivate (soft delete) a product; it cannot be deleted if it has associated sales.
- **RF-04.4** The system must display a visual alert when a product's stock falls below the minimum stock.
- **RF-04.5** The product list must support search, category filters, and pagination.

### RF-05 — Customer Management (ADMIN)

- **RF-05.1** The administrator must be able to register customers with the fields: name, NIT, email (optional), phone (optional), address (optional), and type (regular, VIP, corporate).
- **RF-05.2** The NIT must be unique in the system; the form must validate it before saving.
- **RF-05.3** The administrator must be able to edit an existing customer's data.
- **RF-05.4** The customer list must support search by name or NIT and filter by type.

### RF-06 — Sales History

- **RF-06.1** The system must display the sales history with filters by date, customer, payment method, and status.
- **RF-06.2** The cashier can only see their own sales; the administrator can see all.
- **RF-06.3** The administrator must be able to cancel a sale, which reverts the stock of the involved products.
- **RF-06.4** The history must support pagination.

### RF-07 — Reports (ADMIN)

- **RF-07.1** The reports panel must display daily, weekly, and monthly revenue summaries.
- **RF-07.2** The panel must display the best-selling products by period.
- **RF-07.3** Metrics must be presented with visual charts.

### RF-08 — Keyboard Shortcuts

- **RF-08.1** `Ctrl+K` must focus the product search field.
- **RF-08.2** `Ctrl+Enter` must start the checkout process.
- **RF-08.3** `F2` must open the customer selector.
- **RF-08.4** `F3` must navigate to product management.
- **RF-08.5** `Escape` must close the active modal.
- **RF-08.6** `+` / `-` must increase or decrease the quantity of the selected cart item.
- **RF-08.7** `Delete` must remove the selected cart item.

---

## Non-Functional Requirements

### RNF-01 — Performance

- **RNF-01.1** First Contentful Paint must be under 3 seconds on a standard connection.
- **RNF-01.2** Frequent interactions (add to cart, update quantity) must respond in under 100 ms.
- **RNF-01.3** Lists with more than 100 items must use virtual scrolling.

### RNF-02 — Accessibility

- **RNF-02.1** The interface must comply with WCAG 2.1 level AA.
- **RNF-02.2** All modals must implement focus trap and the `aria-modal` attribute.
- **RNF-02.3** Full keyboard navigation must be available on all screens.

### RNF-03 — Code Quality

- **RNF-03.1** The project must compile without errors with `strict: true` in TypeScript.
- **RNF-03.2** There must be no ESLint warnings in the source code.
- **RNF-03.3** Test coverage must be ≥ 80 % overall and ≥ 90 % in the domain layer.

### RNF-04 — Architecture

- **RNF-04.1** The `domain` layer must not import from `application`, `infrastructure`, or `ui`.
- **RNF-04.2** The `application` layer must only import from `domain`.
- **RNF-04.3** Domain entities must be pure interfaces (no instance methods).
- **RNF-04.4** Domain validations must be pure functions or classes with static methods.
- **RNF-04.5** Dependency instantiation must occur only in `infrastructure/di/container.ts`.
- **RNF-04.6** There must be no circular dependencies between modules.

### RNF-05 — Responsive

- **RNF-05.1** The main layout (sales terminal) must work correctly at 1920×1080 (desktop), ≤ 1280 px (tablet), and ≤ 768 px (mobile).
- **RNF-05.2** On mobile, the cart panel must behave as a bottom drawer.

### RNF-06 — Offline and Persistence

- **RNF-06.1** The active cart must persist in `localStorage` to survive page reloads.
- **RNF-06.2** The product catalog must be cacheable in `IndexedDB` for basic offline use.

---

## Acceptance Criteria by Module

### CA-01 — Complete Sale Flow

**Given** the cashier has products in the cart and selects a valid payment method,  
**when** they click "Complete Sale",  
**then** the system must:
1. Process the payment through the corresponding gateway.
2. Generate an invoice with a unique number.
3. Decrement the stock of each sold product.
4. Clear the cart.
5. Display a success notification with the invoice number.

### CA-02 — Stock Validation

**Given** a product has stock = 0 or `isActive = false`,  
**when** the cashier tries to add it to the cart,  
**then** the "Add" button must be disabled and the system must not modify the cart.

### CA-03 — Minimum Stock Alert

**Given** a product's stock is less than or equal to `minStock`,  
**when** the product is displayed in the catalog or in the admin panel,  
**then** the system must show a low-stock visual indicator (badge or differentiated color).

### CA-04 — Cart Persistence

**Given** the cashier has items in the cart,  
**when** they reload the page,  
**then** the cart must be restored with the same items and quantities.

### CA-05 — Access Control

**Given** a user with the `USER` role tries to access an admin route,  
**when** they navigate to `/admin`,  
**then** the system must redirect them with an access denied message.
