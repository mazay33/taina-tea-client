import path from 'node:path';

import Vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VueRouterAutoImports } from 'unplugin-vue-router';
import VueRouter from 'unplugin-vue-router/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/app': path.resolve(__dirname, 'src/app'),
      '@/assets': path.resolve(__dirname, 'src/assets'),
      '@/modules': path.resolve(__dirname, 'src/modules')
    }
  },
  plugins: [
    Vue({
      script: {
        propsDestructure: true,
        defineModel: true
      }
    }),

    // https://github.com/posva/unplugin-vue-router
    VueRouter({
      routesFolder: [
        {
          src: 'src/modules/main/pages',
          path: ''
        }
      ]
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json'
      },
      imports: [
        'vue',
        '@vueuse/core',
        VueRouterAutoImports,
        {
          // add any other imports you were relying on
          'vue-router/auto': ['useLink']
        }
      ],
      dts: true,
      dirs: [
        './src/app/composables', './src/modules/**/composables', './src/modules/**/**/composables'
      ],
      vueTemplate: true
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      dts: true,

      dirs: [
        './src/app/components',
        './src/modules/**/components', './src/modules/**/views', './src/modules/**/widgets',
        './src/modules/**/**/components', './src/modules/**/**/views', './src/modules/**/**/widgets'

      ]
    })

    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    // UnoCSS(),
  ]

});
