import { test, expect } from '@playwright/test';
import { loginAsCashier } from './helpers/auth';

/**
 * Tests E2E — Proceso de venta con cada método de pago (tarea 8.10)
 *
 * Nota: estos tests verifican la UI del flujo de venta.
 * Las llamadas a la API están mockeadas a través de los interceptores de red.
 */

test.describe('Proceso de venta', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsCashier(page);

    // Mock de la API de productos
    await page.route('**/api/products**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: [
            {
              id: 'prod-1',
              sku: 'SKU-001',
              name: 'Producto Test',
              description: 'Descripción',
              price: 10.00,
              cost: 5.00,
              stock: 20,
              min_stock: 2,
              category: { id: 'cat-1', name: 'General', level: 1, is_active: true },
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ],
          pagination: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1, hasNext: false, hasPrevious: false },
        }),
      });
    });

    await page.goto('/sales');
  });

  test('la terminal de ventas carga correctamente', async ({ page }) => {
    // Verificar que los paneles principales están presentes
    await expect(page.getByLabel('Catálogo de productos')).toBeVisible();
    await expect(page.getByLabel('Carrito de compras')).toBeVisible();
  });

  test('el carrito muestra estado vacío inicialmente', async ({ page }) => {
    await expect(page.getByText('Carrito vacío')).toBeVisible();
  });

  test('el campo de búsqueda está presente y accesible', async ({ page }) => {
    const searchInput = page.getByRole('searchbox', { name: /buscar productos/i });
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEnabled();
  });

  test('el botón de cobrar está deshabilitado con carrito vacío', async ({ page }) => {
    const checkoutBtn = page.getByRole('button', { name: /cobrar/i });
    await expect(checkoutBtn).toBeDisabled();
  });

  test('modal de checkout se abre al hacer clic en cobrar con ítems', async ({ page }) => {
    // Inyectar un carrito con ítems en el estado de Redux
    await page.evaluate(() => {
      const cart = {
        id: 'cart-1',
        items: [{
          id: 'item-1',
          product: { id: 'prod-1', sku: 'SKU-001', name: 'Producto Test', description: '', price: 10, cost: 5, stock: 20, minStock: 2, category: { id: 'c1', name: 'Cat', level: 1, isActive: true }, isActive: true, createdAt: new Date(), updatedAt: new Date() },
          quantity: 2, unitPrice: 10, discount: 0, subtotal: 20,
        }],
        subtotal: 20, tax: 3.8, discount: 0, total: 23.8,
        createdAt: new Date(), updatedAt: new Date(),
      };
      localStorage.setItem('persist:cart', JSON.stringify({ cart: JSON.stringify(cart) }));
    });
    await page.reload();

    const checkoutBtn = page.getByRole('button', { name: /cobrar/i });
    await expect(checkoutBtn).toBeEnabled();
    await checkoutBtn.click();

    await expect(page.getByRole('dialog', { name: /confirmar pago/i })).toBeVisible();
  });

  test('selector de método de pago — tab Efectivo visible', async ({ page }) => {
    await page.evaluate(() => {
      const cart = { id: 'cart-1', items: [{ id: 'i1', product: { id: 'p1', sku: 'S', name: 'P', description: '', price: 10, cost: 5, stock: 10, minStock: 1, category: { id: 'c', name: 'C', level: 1, isActive: true }, isActive: true, createdAt: new Date(), updatedAt: new Date() }, quantity: 1, unitPrice: 10, discount: 0, subtotal: 10 }], subtotal: 10, tax: 1.9, discount: 0, total: 11.9, createdAt: new Date(), updatedAt: new Date() };
      localStorage.setItem('persist:cart', JSON.stringify({ cart: JSON.stringify(cart) }));
    });
    await page.reload();
    await page.getByRole('button', { name: /cobrar/i }).click();

    await expect(page.getByRole('tab', { name: /efectivo/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /tarjeta/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /transferencia/i })).toBeVisible();
  });

  test('atajo Ctrl+K enfoca la búsqueda', async ({ page }) => {
    await page.keyboard.press('Control+k');
    const searchInput = page.getByRole('searchbox', { name: /buscar productos/i });
    await expect(searchInput).toBeFocused();
  });

  test('atajo F3 abre el selector de cliente', async ({ page }) => {
    await page.keyboard.press('F3');
    await expect(page.getByRole('dialog', { name: /seleccionar cliente/i })).toBeVisible();
  });

  test('Escape cierra el modal de cliente', async ({ page }) => {
    await page.keyboard.press('F3');
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
