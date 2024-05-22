module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier', // Add Prettier for formatting rules
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true, // Enable parsing of JSX
    },
  },
  plugins: [
    'react-refresh',
    '@typescript-eslint', // Ensure TypeScript plugin is included
    'prettier', // Add Prettier as a plugin
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': 'warn', // Example rule addition
    'prettier/prettier': 'warn', // Ensure Prettier rules are applied
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect the React version
    },
  },
}
