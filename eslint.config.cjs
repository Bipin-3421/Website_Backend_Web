/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const tsEslint = require('typescript-eslint')
const eslint = require('@eslint/js')
const eslintConfigPrettier = require('eslint-config-prettier')

module.exports = [
  { ignores: ['**/node_modules/**', '**/dist/**'] },
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    rules: {
      'no-console': [
        'error',
        {
          allow: ['warn', 'error']
        }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      'require-await': 'error',
      'newline-before-return': 'error',
      'lines-between-class-members': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['objectLiteralMethod', 'objectLiteralProperty'],
          format: null,
          modifiers: ['requiresQuotes']
        },
        {
          selector: ['variable'],
          modifiers: ['global', 'exported'],
          format: ['PascalCase', 'UPPER_CASE']
        },
        {
          selector: [
            'classicAccessor',
            'autoAccessor',
            'classMethod',
            'classProperty',
            'function',
            'parameter',
            'parameterProperty',
            'typeMethod',
            'typeProperty',
            'objectLiteralProperty',
            'objectLiteralMethod',
            'variable'
          ],
          leadingUnderscore: 'allow',
          format: ['camelCase']
        },
        {
          selector: [
            'class',
            'enum',
            'interface',
            'typeAlias',
            'typeParameter'
          ],
          format: ['PascalCase']
        },
        {
          selector: ['enumMember'],
          format: ['UPPER_CASE']
        }
      ]
    }
  },
  eslintConfigPrettier
]
