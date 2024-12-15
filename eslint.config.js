import { builtinModules } from 'module';

import { fixupConfigRules } from '@eslint/compat';
import jsLint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import tailwind from 'eslint-plugin-tailwindcss';
import vueLint from 'eslint-plugin-vue';
import globals from 'globals';
import tsLint from 'typescript-eslint';

import autoImports from './.eslintrc-auto-import.json' assert { type: 'json' };

export default [
  // config parsers
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,jsx,tsx}']
  },
  {
    languageOptions: autoImports
  },
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  },
  // config envs
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    }
  },
  // rules
  jsLint.configs.recommended,
  ...tsLint.configs.recommended,
  ...vueLint.configs['flat/essential'],
  ...fixupConfigRules(pluginReactConfig),
  ...tailwind.configs['flat/recommended'],
  {

    rules: {

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports'
        }
      ],

      'vue/multiline-html-element-content-newline': [
        'error',
        {
          ignoreWhenEmpty: true,
          ignores: ['pre', 'textarea'],
          allowEmptyLines: true
        }
      ],
      'vue/html-indent': ['error', 2, {
        attribute: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: []
      }],
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: {
            max: 1
          },
          multiline: {
            max: 1
          }
        }
      ],
      'vue/first-attribute-linebreak': ['error', {
        singleline: 'beside',
        multiline: 'below'
      }],
      'vue/no-multi-spaces': ['error', {
        ignoreProperties: false
      }],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always'
          },
          svg: 'always',
          math: 'always'
        }
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'vue/multi-word-component-names': 'off',
      // https://eslint.vuejs.org/rules/block-order.html#rule-details
      'vue/block-order': ['error', {
        order: ['script', 'template', 'style']
      }],
      // https://eslint.vuejs.org/rules/attribute-hyphenation.html
      'vue/attribute-hyphenation': ['error', 'always', {
        ignore: []
      }],
      'vue/v-on-event-hyphenation': ['error', 'always', {
        autofix: true,
        ignore: []
      }],
      'vue/v-slot-style': ['error', {
        atComponent: 'shorthand',
        default: 'shorthand',
        named: 'shorthand'
      }],
      'vue/v-on-style': ['error', 'shorthand'],
      'vue/mustache-interpolation-spacing': ['error', 'always'],
      'vue/attributes-order': ['error', {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          ['UNIQUE', 'SLOT'],
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT'
        ],
        alphabetical: false
      }],
      'vue/block-lang': ['error',
        {
          script: {
            lang: 'ts'
          }
        }],
      'vue/component-api-style': ['error',
        ['script-setup', 'composition']
      ],
      'vue/component-name-in-template-casing': ['error', 'PascalCase', {
        registeredComponentsOnly: true,
        ignores: []
      }],

      'vue/define-props-declaration': ['error', 'type-based'],
      'vue/no-spaces-around-equal-signs-in-attribute': ['error'],
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'tailwindcss/no-custom-classname': 'off',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/no-duplicate-enum-values': 'error',
      // '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      // 'no-restricted-imports': 'off',
      '@typescript-eslint/no-restricted-imports': 'error',
      '@typescript-eslint/no-empty-object-type': 'off'
    }
  },

  {
    plugins: {
      'simple-import-sort': pluginSimpleImportSort
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [
              `node:`,
              `^(${builtinModules.join('|')})(/|$)`
            ],
            // style less,scss,css
            ['^.+\\.less$', '^.+\\.s?css$'],
            // Side effect imports.
            ['^\\u0000'],
            ['^@?\\w.*\\u0000$', '^[^.].*\\u0000$', '^\\..*\\u0000$'],
            ['^vue', '^@vue', '^@?\\w', '^\\u0000'],
            ['^@/utils'],
            ['^@/composables'],
            // Parent imports. Put `..` last.
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Other relative imports. Put same-folder imports and `.` last.
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$']
          ]
        }
      ]
    }
  },
  // see: https://eslint.style/guide/getting-started
  // see: https://github.com/eslint-stylistic/eslint-stylistic/blob/main/packages/eslint-plugin/configs/disable-legacy.ts
  stylistic.configs['disable-legacy'],
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
    commaDangle: 'never',
    jsx: true,
    blockSpacing: 'always'
  }),
  {
    // https://eslint.org/docs/latest/use/configure/ignore
    ignores: [
      // only ignore node_modules in the same directory as the configuration file
      'node_modules',
      // so you have to add `**/` pattern to include nested directories (for example if you use pnpm workspace)
      '**/node_modules',
      // also you can add a new rule to revert a ignore
      '!./packages/manual-add-lib/node_modules/local-lib.js',
      'dist'
    ]
  }
];
