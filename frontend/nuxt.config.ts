// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@ant-design-vue/nuxt', '@pinia/nuxt'],

  app: {
    head: {
      title: 'kyrie114 的博客',
      meta: [
        { name: 'description', content: '个人分享：AI工程从零 × 矩阵方法跟读' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
      webBase: process.env.NUXT_PUBLIC_WEB_BASE || ''
    }
  },

  ssr: true,

  vite: {
    server: {
      proxy: {
        '/api': {
          target: process.env.NUXT_PUBLIC_API_BASE,
          changeOrigin: true,
          secure: false
        }
      }
    }
  },

  nitro: {
    preset: 'node-server'
  }
})