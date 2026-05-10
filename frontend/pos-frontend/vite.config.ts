/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Genera stats.html con el análisis del bundle (tarea 9.3)
    // Solo se activa cuando ANALYZE=true para no ralentizar builds normales
    ...(process.env.ANALYZE === 'true'
      ? [
          visualizer({
            filename: 'dist/stats.html',
            open: false,
            gzipSize: true,
            brotliSize: true,
            template: 'treemap',
          }),
        ]
      : []),
    // PWA: service worker + manifest (tarea 9.4)
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg'],
      manifest: {
        name: 'POS Frontend',
        short_name: 'POS',
        description: 'Sistema de Punto de Venta',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/sales',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // Cachear assets estáticos (JS, CSS, imágenes)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Estrategia network-first para la API
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // 5 minutos
              },
            },
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // ---------------------------------------------------------------------------
  // Optimización para producción (tarea 9.1)
  // ---------------------------------------------------------------------------
  build: {
    // Minificación con oxc (Vite 8 usa oxc por defecto, más rápido que esbuild)
    minify: 'oxc',
    // Generar source maps solo en staging, no en producción
    sourcemap: process.env.VITE_SOURCEMAP === 'true',
    // Tamaño máximo de chunk antes de advertencia (500 KB)
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // Code splitting manual por dominio funcional
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) return 'vendor-react';
            if (id.includes('@reduxjs') || id.includes('react-redux') || id.includes('redux-persist')) return 'vendor-redux';
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('yup')) return 'vendor-forms';
            if (id.includes('axios')) return 'vendor-axios';
            return 'vendor';
          }
        },
        // Nombres de archivos con hash para cache busting
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },

  // ---------------------------------------------------------------------------
  // Vitest (tarea 1.10 / 8.5)
  // ---------------------------------------------------------------------------
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        'src/**/*.d.ts',
        'src/test/**',
        'src/**/*.stories.{ts,tsx}',
        'src/**/*.test.{ts,tsx}',
        'src/infrastructure/di/container.ts',
        // Páginas y componentes complejos que requieren backend real
        'src/ui/pages/**',
        'src/ui/hooks/**',
        'src/ui/components/features/CartPanel.tsx',
        'src/ui/components/features/CheckoutModal.tsx',
        'src/ui/components/features/CustomerSelectorModal.tsx',
        'src/ui/components/features/ProductBrowser.tsx',
        'src/ui/components/features/PaymentMethodSelector.tsx',
        'src/ui/components/features/SaleReceipt.tsx',
        'src/ui/components/base/MainLayout.tsx',
        'src/ui/components/base/AdminLayout.tsx',
        'src/ui/components/base/SalesLayout.tsx',
        'src/ui/components/base/ThemeProvider.tsx',
        'src/ui/components/base/ProtectedRoute.tsx',
        'src/ui/store/slices/productsSlice.ts',
        'src/ui/store/slices/salesSlice.ts',
        // Adaptadores API (requieren servidor real)
        'src/infrastructure/api/**',
        'src/infrastructure/storage/ProductIndexedDBAdapter.ts',
        'src/infrastructure/payments/MixedPaymentGateway.ts',
      ],
    },
  },
});
