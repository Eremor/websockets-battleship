import eslint from '@eslint/js';
import tslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tslint.config(
  eslint.configs.recommended,
  ...tslint.configs.strict,
  ...tslint.configs.strict,
  eslintPluginPrettierRecommended,
  {
    ignores: [
      'node_modules',
      'dist',
      '**/*.test.ts'
    ],
    rules: {
      'prettier/prettier': [
        'error',
        {
          'singleQuote': true,
          'tabWidth': 2,
          'code': 100
        }
      ],
      'max-len': [
        'error', {
          'code': 100,
          'ignoreComments': true,
          'ignoreUrls': true,
          'ignoreStrings': true
        }
      ]
    }
  }
)