-- V1: Schema inicial del POS
-- Tablas: categories, products, customers, users, sales, sale_items, invoice_sequences

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE categories (
    id          VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    parent_id   VARCHAR(36),
    level       INTEGER      NOT NULL DEFAULT 0,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_categories PRIMARY KEY (id),
    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories(id),
    CONSTRAINT chk_categories_level CHECK (level >= 0)
);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE products (
    id          VARCHAR(36)    NOT NULL DEFAULT gen_random_uuid()::text,
    sku         VARCHAR(50)    NOT NULL,
    name        VARCHAR(255)   NOT NULL,
    description TEXT,
    price       NUMERIC(12, 2) NOT NULL,
    cost        NUMERIC(12, 2) NOT NULL DEFAULT 0,
    stock       INTEGER        NOT NULL DEFAULT 0,
    min_stock   INTEGER        NOT NULL DEFAULT 0,
    category_id VARCHAR(36)    NOT NULL,
    image_url   VARCHAR(500),
    is_active   BOOLEAN        NOT NULL DEFAULT TRUE,
    low_stock   BOOLEAN        NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP      NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_products PRIMARY KEY (id),
    CONSTRAINT uq_products_sku UNIQUE (sku),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id),
    CONSTRAINT chk_products_price CHECK (price > 0),
    CONSTRAINT chk_products_cost CHECK (cost >= 0),
    CONSTRAINT chk_products_stock CHECK (stock >= 0),
    CONSTRAINT chk_products_min_stock CHECK (min_stock >= 0)
);

-- ============================================================
-- CUSTOMERS
-- ============================================================
CREATE TABLE customers (
    id            VARCHAR(36)    NOT NULL DEFAULT gen_random_uuid()::text,
    name          VARCHAR(255)   NOT NULL,
    nit           VARCHAR(50)    NOT NULL,
    email         VARCHAR(255),
    phone         VARCHAR(50),
    address       TEXT,
    customer_type VARCHAR(20)    NOT NULL DEFAULT 'REGULAR',
    credit_limit  NUMERIC(12, 2),
    is_active     BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP      NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_customers PRIMARY KEY (id),
    CONSTRAINT uq_customers_nit UNIQUE (nit),
    CONSTRAINT chk_customers_type CHECK (customer_type IN ('REGULAR', 'VIP', 'CORPORATE')),
    CONSTRAINT chk_customers_credit_limit CHECK (credit_limit IS NULL OR (credit_limit >= 0 AND credit_limit <= 999999999.99))
);

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
    id         VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    username   VARCHAR(100) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    full_name  VARCHAR(255),
    role       VARCHAR(20)  NOT NULL DEFAULT 'USER',
    is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uq_users_username UNIQUE (username),
    CONSTRAINT chk_users_role CHECK (role IN ('USER', 'ADMIN'))
);

-- ============================================================
-- INVOICE SEQUENCES (para generación atómica de números de factura)
-- ============================================================
CREATE TABLE invoice_sequences (
    date_key  DATE    NOT NULL,
    sequence  INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT pk_invoice_sequences PRIMARY KEY (date_key)
);

-- ============================================================
-- SALES
-- ============================================================
CREATE TABLE sales (
    id              VARCHAR(36)    NOT NULL DEFAULT gen_random_uuid()::text,
    invoice_number  VARCHAR(50)    NOT NULL,
    customer_id     VARCHAR(36),
    created_by      VARCHAR(36)    NOT NULL,
    subtotal        NUMERIC(12, 2) NOT NULL,
    tax             NUMERIC(12, 2) NOT NULL,
    discount        NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total           NUMERIC(12, 2) NOT NULL,
    payment_method  VARCHAR(20)    NOT NULL,
    payment_details JSONB,
    status          VARCHAR(20)    NOT NULL DEFAULT 'COMPLETED',
    created_at      TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP      NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_sales PRIMARY KEY (id),
    CONSTRAINT uq_sales_invoice_number UNIQUE (invoice_number),
    CONSTRAINT fk_sales_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT fk_sales_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT chk_sales_payment_method CHECK (payment_method IN ('CASH', 'CARD', 'TRANSFER', 'MIXED')),
    CONSTRAINT chk_sales_status CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED')),
    CONSTRAINT chk_sales_subtotal CHECK (subtotal >= 0),
    CONSTRAINT chk_sales_tax CHECK (tax >= 0),
    CONSTRAINT chk_sales_total CHECK (total >= 0)
);

-- ============================================================
-- SALE ITEMS
-- ============================================================
CREATE TABLE sale_items (
    id          VARCHAR(36)    NOT NULL DEFAULT gen_random_uuid()::text,
    sale_id     VARCHAR(36)    NOT NULL,
    product_id  VARCHAR(36)    NOT NULL,
    quantity    INTEGER        NOT NULL,
    unit_price  NUMERIC(12, 2) NOT NULL,
    discount    NUMERIC(12, 2) NOT NULL DEFAULT 0,
    subtotal    NUMERIC(12, 2) NOT NULL,

    CONSTRAINT pk_sale_items PRIMARY KEY (id),
    CONSTRAINT fk_sale_items_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    CONSTRAINT fk_sale_items_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT chk_sale_items_quantity CHECK (quantity > 0),
    CONSTRAINT chk_sale_items_unit_price CHECK (unit_price > 0),
    CONSTRAINT chk_sale_items_subtotal CHECK (subtotal >= 0)
);
