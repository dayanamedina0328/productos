import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'node_modules']),

  // Archivos de test — reglas más permisivas
  {
    files: ['**/*.test.{ts,tsx}', 'src/test/**'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      prettierConfig,
    ],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },

  // Código fuente principal
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/*.test.{ts,tsx}', 'src/test/**'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettierConfig,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-console': 'warn',
      // El React Compiler puede generar falsos positivos en patrones válidos
      // como setState en useEffect para sincronizar estado controlado
      'react-compiler/react-compiler': 'off',
      // react-hooks v7 incluye reglas del React Compiler que generan falsos positivos
      'react-hooks/react-compiler': 'off',
      // Desactivar reglas del React Compiler que generan falsos positivos
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/no-deriving-state-in-effects': 'off',
      // react-refresh: permitir exportar constantes junto a componentes en páginas
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
])
