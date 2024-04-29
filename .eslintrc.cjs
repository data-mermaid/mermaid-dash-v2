module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'camelcase': 'off',
    'curly': ['error', 'all'],
    'no-underscore-dangle': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-boolean-value': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'no-unused-vars': [
      'error',
      {
        'varsIgnorePattern': '^_',
        'argsIgnorePattern': '^_' // ignore unused vars and args that start with _. These vars are unsued, but named for readability/maintainability of code.
      }
    ],
    'no-useless-return': 'off',
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        'assert': 'either'
      }
    ]
  },
}
