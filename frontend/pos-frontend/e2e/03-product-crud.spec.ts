import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';

/**
 * Tests E2E — CRUD de productos en el panel de administración (tarea 8.11)
 */

const mockProducts = {
  items: [
    {
      id: 'prod-1',
      sku: 'SKU-001',
      name: 'Laptop Pro',
      description: 'Laptop de alta gama',
      price: 1200.00,
      cost: 800.00,
      stock: 15,
      min_stock: 3,
      category: { id: 'cat-1', name: 'Electrónica', level: 1, is_active: true },
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prod-2',
      sku: 'SKU-002',
      name: 'Mouse Inalámbrico',
      description: 'Mouse ergonómico',
      price: 25.00,
      cost: 12.00,
      stock: 2,
      min_stock: 5,
      category: { id: 'cat-1', name: 'Electrónica', level: 1, is_active: true },
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  pagination: { page: 1, pageSize: 20, totalItems: 2, totalPages: 1, hasNext: false, hasPrevious: false },
};

test.describe('CRUD de productos', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);

    await page.route('**/api/products**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockProducts) });
      } else if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ ...mockProducts.items[0], id: 'prod-new', name: 'Nuevo Producto', sku: 'SKU-NEW' }),
        });
      } else if (route.request().method() === 'PATCH') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockProducts.items[0]) });
      } else if (route.request().method() === 'DELETE') {
        await route.fulfill({ status: 204 });
      } else {
        await route.continue();
      }
    });

    await page.goto('/admin/products');
  });

  test('la tabla de productos se carga correctamente', async ({ page }) => {
    await expect(page.getByText('Gestión de Productos')).toBeVisible();
    await expect(page.getByRole('button', { name: /nuevo producto/i })).toBeVisible();
  });

  test('muestra los productos en la tabla', async ({ page }) => {
    await expect(page.getByText('Laptop Pro')).toBeVisible();
    await expect(page.getByText('Mouse Inalámbrico')).toBeVisible();
  });

  test('muestra indicador de stock bajo para productos con stock < minStock', async ({ page }) => {
    // Mouse tiene stock=2, minStock=5 → stock bajo
    await expect(page.getByText('Stock bajo')).toBeVisible();
  });

  test('abre el modal de creación al hacer clic en Nuevo producto', async ({ page }) => {
    await page.getByRole('button', { name: /nuevo producto/i }).click();
    await expect(page.getByRole('dialog', { name: /nuevo producto/i })).toBeVisible();
  });

  test('el formulario de creación tiene los campos requeridos', async ({ page }) => {
    await page.getByRole('button', { name: /nuevo producto/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByLabel(/nombre/i)).toBeVisible();
    await expect(dialog.getByLabel(/sku/i)).toBeVisible();
    await expect(dialog.getByLabel(/precio/i)).toBeVisible();
    await expect(dialog.getByLabel(/stock/i)).toBeVisible();
  });

  test('muestra error de validación si el nombre está vacío', async ({ page }) => {
    await page.getByRole('button', { name: /nuevo producto/i }).click();
    const dialog = page.getByRole('dialog');
    // Intentar guardar sin nombre
    await dialog.getByRole('button', { name: /guardar/i }).click();
    await expect(dialog.getByText(/nombre es requerido/i)).toBeVisible();
  });

  test('abre el modal de edición al hacer clic en Editar', async ({ page }) => {
    const editButtons = page.getByRole('button', { name: /editar/i });
    await editButtons.first().click();
    await expect(page.getByRole('dialog', { name: /editar producto/i })).toBeVisible();
  });

  test('abre el modal de confirmación al hacer clic en Eliminar', async ({ page }) => {
    const deleteButtons = page.getByRole('button', { name: /eliminar/i });
    await deleteButtons.first().click();
    await expect(page.getByRole('dialog', { name: /confirmar eliminación/i })).toBeVisible();
  });

  test('cancela la eliminación al hacer clic en Cancelar', async ({ page }) => {
    await page.getByRole('button', { name: /eliminar/i }).first().click();
    await page.getByRole('dialog').getByRole('button', { name: /cancelar/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
