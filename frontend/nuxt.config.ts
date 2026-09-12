// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@ant-design-vue/nuxt', '@pinia/nuxt'],
  
  // 运行时配置
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
      webBase: process.env.NUXT_PUBLIC_WEB_BASE || ''
    }
  },

  // SSR 配置
  ssr: true,

  // Vite 开发服务器代理配置（仅开发环境生效）
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

  // Nitro 配置
  nitro: {
    preset: 'node-server'
  }
})
