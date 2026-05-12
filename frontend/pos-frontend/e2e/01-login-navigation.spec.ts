import { test, expect } from '@playwright/test';
import { loginAsCashier, loginAsAdmin, logout } from './helpers/auth';

/**
 * Tests E2E — Login y navegación entre rutas (tarea 8.9)
 */

test.describe('Login y navegación', () => {
  test.beforeEach(async ({ page }) => {
    await logout(page);
  });

  test('redirige a /login cuando no hay sesión', async ({ page }) => {
    await page.goto('/sales');
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirige a /login al acceder a /admin sin sesión', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login/);
  });

  test('cajero puede acceder a /sales después de autenticarse', async ({ page }) => {
    await loginAsCashier(page);
    await page.goto('/sales');
    await expect(page).toHaveURL(/\/sales/);
    // La página de ventas debe cargar sin redirigir
    await expect(page.locator('body')).toBeVisible();
  });

  test('cajero es redirigido a /sales al intentar acceder a /admin', async ({ page }) => {
    await loginAsCashier(page);
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/sales/);
  });

  test('admin puede acceder a /admin', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin/);
  });

  test('admin puede navegar entre tabs de administración', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/products');
    await expect(page).toHaveURL(/\/admin\/products/);

    // Navegar a clientes
    await page.goto('/admin/customers');
    await expect(page).toHaveURL(/\/admin\/customers/);

    // Navegar a ventas
    await page.goto('/admin/sales');
    await expect(page).toHaveURL(/\/admin\/sales/);

    // Navegar a reportes
    await page.goto('/admin/reports');
    await expect(page).toHaveURL(/\/admin\/reports/);
  });

  test('la ruta / redirige a /sales', async ({ page }) => {
    await loginAsCashier(page);
    await page.goto('/');
    await expect(page).toHaveURL(/\/sales/);
  });

  test('rutas inexistentes redirigen a /sales', async ({ page }) => {
    await loginAsCashier(page);
    await page.goto('/ruta-inexistente');
    await expect(page).toHaveURL(/\/sales/);
  });
});
