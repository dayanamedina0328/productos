-- V4: Seed de productos de prueba para la terminal de ventas

INSERT INTO products (id, sku, name, description, price, cost, stock, min_stock, category_id, image_url, is_active, low_stock) VALUES
('prod-001', 'PHO-001', 'iPhone 15 Pro', 'Smartphone Apple 256GB', 1200.00, 900.00, 15, 5, 'cat-phones', 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-bluetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692846360609', TRUE, FALSE),
('prod-002', 'PHO-002', 'Samsung Galaxy S24 Ultra', 'Smartphone Samsung 512GB', 1300.00, 950.00, 10, 3, 'cat-phones', 'https://images.samsung.com/is/image/samsung/p6pim/co/2401/gallery/co-galaxy-s24-s928-sm-s928bztqltc-thumb-539300642?$344_344_PNG$', TRUE, FALSE),
('prod-003', 'AUD-001', 'Sony WH-1000XM5', 'Audífonos inalámbricos con cancelación de ruido', 350.00, 200.00, 20, 5, 'cat-audio', 'https://la.sony.com/image/6145c1d32e6ac8e63a46c912dc33c5bb?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF', TRUE, FALSE),
('prod-004', 'SNA-001', 'Papas Fritas Lays', 'Papas fritas clásicas 150g', 2.50, 1.00, 50, 10, 'cat-snacks', 'https://exitocol.vtexassets.com/arquivos/ids/12836279/papas-fritas-lays-clasicas-x-115-g-3098328_a.jpg?v=637887754353470000', TRUE, FALSE),
('prod-005', 'BEV-001', 'Coca-Cola Zero', 'Gaseosa 500ml', 1.50, 0.50, 100, 20, 'cat-beverages', 'https://jumbocolombiafood.vtexassets.com/arquivos/ids/3820235-800-450?v=638063071379730000&width=800&height=450&aspect=true', TRUE, FALSE),
('prod-006', 'COM-001', 'MacBook Air M3', 'Laptop Apple 15" 512GB SSD', 1499.00, 1100.00, 2, 5, 'cat-computers', 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mba15-midnight-select-202306?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1684518479433', TRUE, TRUE);
