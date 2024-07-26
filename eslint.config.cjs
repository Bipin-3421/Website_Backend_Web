const { configs } = require('typescript-eslint');
const { configs: _configs } = require('@eslint/js');
const eslintConfigPrettier = require('eslint-config-prettier');
const tsParser = require('@typescript-eslint/parser');
const { node } = require('globals');

module.exports = [
  _configs.recommended,
  ...configs.recommended,
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      globals: {
        ...node,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'require-await': 'error',
      'newline-before-return': 'error',
      'lines-between-class-members': 'error',
    },
  },
  eslintConfigPrettier,
];
