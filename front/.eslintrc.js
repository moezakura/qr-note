module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    'plugin:vue/essential',
    'eslint:recommended',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended'
  ],
  plugins: ['prettier'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    'no-extra-semi': 'warn',
    quotes: ['warn', 'single']
  }
};
