import type { Page } from '@playwright/test';

/**
 * Simula un usuario autenticado inyectando el token en localStorage.
 * En producción el login real se haría a través de la UI.
 */
export async function loginAsCashier(page: Page): Promise<void> {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('pos_access_token', 'test-cashier-token');
    localStorage.setItem('pos_user', JSON.stringify({ role: 'CASHIER', name: 'Cajero Test' }));
  });
}

export async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('pos_access_token', 'test-admin-token');
    localStorage.setItem('pos_user', JSON.stringify({ role: 'ADMIN', name: 'Admin Test' }));
  });
}

export async function logout(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.removeItem('pos_access_token');
    localStorage.removeItem('pos_user');
  });
}
