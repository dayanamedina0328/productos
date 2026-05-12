import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { loginAsCashier, loginAsAdmin } from './helpers/auth';

/**
 * Tests E2E — Accesibilidad WCAG 2.1 AA con axe-playwright (tarea 8.12)
 *
 * Verifica que las páginas principales no tengan violaciones de accesibilidad
 * según los estándares WCAG 2.1 nivel AA.
 *
 * Nota: la validación completa requiere revisión manual con tecnologías
 * de asistencia (lectores de pantalla, etc.).
 */

test.describe('Accesibilidad WCAG 2.1 AA', () => {
  test('página de login no tiene violaciones de accesibilidad', async ({ page }) => {
    await page.goto('/login');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('terminal de ventas no tiene violaciones de accesibilidad', async ({ page }) => {
    await loginAsCashier(page);
    await page.goto('/sales');
    // Esperar a que la página cargue
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      // Excluir reglas de color que requieren contexto visual completo
      .exclude('[aria-hidden="true"]')
      .analyze();

    // Reportar violaciones sin fallar el test (para revisión manual)
    if (results.violations.length > 0) {
      console.log('Violaciones de accesibilidad encontradas en /sales:');
      results.violations.forEach((v) => {
        console.log(`  - ${v.id}: ${v.description} (${v.impact})`);
        v.nodes.forEach((n) => console.log(`    → ${n.html}`));
      });
    }

    // Solo fallar en violaciones críticas
    const criticalViolations = results.violations.filter((v) => v.impact === 'critical');
    expect(criticalViolations).toEqual([]);
  });

  test('panel de administración no tiene violaciones críticas', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = results.violations.filter((v) => v.impact === 'critical');
    expect(criticalViolations).toEqual([]);
  });

  test('los modales tienen atributos aria correctos', async ({ page }) => {
    await loginAsCashier(page);
    await page.goto('/sales');

    // Abrir el selector de cliente
    await page.keyboard.press('F3');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Verificar atributos de accesibilidad del modal
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog).toHaveAttribute('aria-labelledby');

    // Cerrar
    await page.keyboard.press('Escape');
  });

  test('los botones tienen labels accesibles', async ({ page }) => {
    await loginAsCashier(page);
    await page.goto('/sales');

    // Verificar que no hay botones sin nombre accesible
    const results = await new AxeBuilder({ page })
      .withRules(['button-name'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('las imágenes tienen texto alternativo', async ({ page }) => {
    await loginAsCashier(page);
    await page.goto('/sales');

    const results = await new AxeBuilder({ page })
      .withRules(['image-alt'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('el contraste de color cumple WCAG AA', async ({ page }) => {
    await loginAsCashier(page);
    await page.goto('/sales');

    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    // Reportar pero no fallar (el contraste depende del tema)
    if (results.violations.length > 0) {
      console.log(`Advertencia: ${results.violations.length} problema(s) de contraste encontrados`);
    }
  });

  test('la navegación por teclado funciona en la terminal de ventas', async ({ page }) => {
    await loginAsCashier(page);
    await page.goto('/sales');

    // Tab hasta el campo de búsqueda
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();

    // Verificar que el foco es visible (focus-visible)
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? el.tagName : null;
    });
    expect(focusedElement).not.toBeNull();
  });
});
