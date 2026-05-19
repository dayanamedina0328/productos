-- V3: Datos iniciales del sistema

-- ============================================================
-- CATEGORÍAS RAÍZ
-- ============================================================
INSERT INTO categories (id, name, description, parent_id, level, is_active) VALUES
('cat-electronics',   'Electrónica',    'Productos electrónicos y tecnología', NULL, 0, TRUE),
('cat-clothing',      'Ropa',           'Prendas de vestir y accesorios',      NULL, 0, TRUE),
('cat-food',          'Alimentos',      'Productos alimenticios y bebidas',    NULL, 0, TRUE),
('cat-home',          'Hogar',          'Artículos para el hogar',             NULL, 0, TRUE),
('cat-sports',        'Deportes',       'Artículos deportivos',                NULL, 0, TRUE),
('cat-health',        'Salud y Belleza','Productos de salud y cuidado personal',NULL, 0, TRUE),
('cat-office',        'Oficina',        'Artículos de oficina y papelería',    NULL, 0, TRUE),
('cat-general',       'General',        'Categoría general',                   NULL, 0, TRUE);

-- ============================================================
-- SUBCATEGORÍAS
-- ============================================================
INSERT INTO categories (id, name, description, parent_id, level, is_active) VALUES
('cat-phones',     'Teléfonos',      'Smartphones y accesorios',    'cat-electronics', 1, TRUE),
('cat-computers',  'Computadores',   'PCs, laptops y periféricos',  'cat-electronics', 1, TRUE),
('cat-audio',      'Audio',          'Audífonos, parlantes, etc.',  'cat-electronics', 1, TRUE),
('cat-men',        'Hombre',         'Ropa para hombre',            'cat-clothing',    1, TRUE),
('cat-women',      'Mujer',          'Ropa para mujer',             'cat-clothing',    1, TRUE),
('cat-beverages',  'Bebidas',        'Bebidas y refrescos',         'cat-food',        1, TRUE),
('cat-snacks',     'Snacks',         'Snacks y golosinas',          'cat-food',        1, TRUE);

-- ============================================================
-- USUARIO ADMINISTRADOR POR DEFECTO
-- Contraseña: Admin@123 (bcrypt strength 12)
-- ============================================================
INSERT INTO users (id, username, password, full_name, role, is_active) VALUES
(
    'user-admin-001',
    'admin',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i',
    'Administrador del Sistema',
    'ADMIN',
    TRUE
);

-- ============================================================
-- USUARIO CAJERO POR DEFECTO
-- Contraseña: Cajero@123 (bcrypt strength 12)
-- ============================================================
INSERT INTO users (id, username, password, full_name, role, is_active) VALUES
(
    'user-cashier-001',
    'cajero',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Cajero Principal',
    'USER',
    TRUE
);
