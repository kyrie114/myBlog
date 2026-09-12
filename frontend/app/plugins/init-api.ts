// Nuxt 插件：在客户端初始化时设置 API 地址和 Web 地址
import { initApiBase } from '~/utils/apiConfig';

export default defineNuxtPlugin({
  name: 'init-api',
  enforce: 'pre',
  setup() {
    const config = useRuntimeConfig();

    // 从 runtimeConfig 获取 API 地址
    const apiBase = config.public.apiBase as string;
    if (apiBase) {
      initApiBase(apiBase);
    }

    // 将 Web 基础地址挂载到 window 对象上，方便全局访问
    const webBase = config.public.webBase as string;
    if (webBase && typeof window !== 'undefined') {
      (window as any).__WEB_BASE__ = webBase;
    }
  }
})
