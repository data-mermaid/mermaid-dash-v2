module.exports = {
  root: true,
  env: { browser: true, es2020: true, es6: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:testing-library/react',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@babel/eslint-parser',
    ecmaFeatures: {
      jsx: true,
    },
    babelOptions: {
      babelrc: false,
      configFile: false,
      presets: ['@babel/preset-react'],
    },
  },
  settings: { react: { version: 'detect' } },
  plugins: ['react-refresh', 'jsx-a11y'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    camelcase: 'off',
    curly: ['error', 'all'],
    'no-underscore-dangle': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-boolean-value': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_', // ignore unused vars and args that start with _. These vars are unsued, but named for readability/maintainability of code.
      },
    ],
    'no-useless-return': 'off',
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        assert: 'either',
      },
    ],
  },
  globals: {
    window: true,
    document: true,
    localStorage: true,
    FormData: true,
    FileReader: true,
    Blob: true,
    navigator: true,
    fetch: true,
  },
}
