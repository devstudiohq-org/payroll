import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export function createBaseConfig({ rootDir = process.cwd() } = {}) {
  return tseslint.config(
    {
      ignores: [
        '**/coverage/**',
        '**/dist/**',
        '**/node_modules/**',
        '**/.turbo/**',
        '**/migrations/**',
      ],
    },
    {
      files: ['**/*.{ts,tsx,mts,cts}'],
      extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: rootDir,
        },
      },
    },
    {
      files: ['apps/web/**/*.{ts,tsx}'],
      languageOptions: {
        globals: {
          ...globals.browser,
        },
      },
    },
    {
      files: ['apps/api/**/*.{ts,tsx,mts,cts}', 'packages/**/*.{ts,tsx,mts,cts}'],
      languageOptions: {
        globals: {
          ...globals.node,
        },
      },
    },
    {
      files: ['**/*.{test,spec}.{ts,tsx}'],
      languageOptions: {
        globals: {
          ...globals.jest,
          ...globals.node,
        },
      },
    },
  );
}
