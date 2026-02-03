const { defineConfig, globalIgnores } = require('eslint/config');

const globals = require('globals');
const { fixupConfigRules } = require('@eslint/compat');
const tsParser = require('@typescript-eslint/parser');
const js = require('@eslint/js');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },

      globals: {
        ...globals.browser,
        ...globals.commonjs,
      },
    },

    extends: compat.extends('eslint:recommended'),
  },
  globalIgnores(['!**/.server', '!**/.client', '.react-router/**']),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],

    extends: fixupConfigRules(
      compat.extends(
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
      ),
    ),

    settings: {
      react: {
        version: 'detect',
      },

      formComponents: ['Form'],

      linkComponents: [
        {
          name: 'Link',
          linkAttribute: 'to',
        },
        {
          name: 'NavLink',
          linkAttribute: 'to',
        },
      ],

      'import/resolver': {
        typescript: {},
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      parser: tsParser,
    },

    settings: {
      'import/internal-regex': '^~/',

      'import/resolver': {
        node: {
          extensions: ['.ts', '.tsx'],
        },

        typescript: {
          alwaysTryTypes: true,
        },
      },
    },

    extends: fixupConfigRules(
      compat.extends(
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
      ),
    ),
  },
  {
    files: ['**/eslint.config.cjs'],

    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]);
