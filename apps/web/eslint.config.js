//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import solidConfig from '@template/eslint-config/solid-js'

export default [
  ...tanstackConfig,
  ...solidConfig,
  {
    rules: {
      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
    },
  },
  {
    // design/ is a self-contained vendored package with its own lint config and
    // a tsconfig that extends a base not installed in this workspace.
    ignores: [
      'eslint.config.js',
      'prettier.config.js',
      'src/routeTree.gen.ts',
      'design/**',
    ],
  },
]
