// @ts-check
import antfu from '@antfu/eslint-config'
import VueI18n from '@intlify/eslint-plugin-vue-i18n'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  await antfu({
    vue: true,
    typescript: {
      tsconfigPath: './tsconfig.json',
    },
    formatters: {
      css: true,
      markdown: true,
    },
    rules: {
      'pnpm/yaml-enforce-settings': 'off',
    },
  }, {
    files: ['**/*.vue'],
    plugins: {
      'vue-i18n': VueI18n,
    },
    settings: {
      'vue-i18n': {
        localeDir: './i18n/locales/*.{json,json5,yaml,yml}',
      },
    },
    rules: {
      'vue-i18n/no-missing-keys': 'error',
      'vue-i18n/no-raw-text': ['error', {
        ignorePattern: '^(?:[-#:()&0-9+.,/|\\sA-Za-z])*$',
        ignoreNodes: ['Icon'],
      }],
    },
  }),
)
