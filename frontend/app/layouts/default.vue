<template>
        <div>
                <!--                <img alt=""-->
                <!--                     class="fixed top-0 left-0 w-full h-full object-cover opacity-60 z-40 pointer-events-none min-w-[100vw] min-h-[100vh] "-->
                <!--                     src="../assets/images/webbg.webp"-->
                <!--                     style="mix-blend-mode: multiply;">-->

                <div class="min-h-screen flex flex-col">
                        <a-back-top/>
                        <app-header :site-name="siteStore.siteName"/>

                        <main class="flex-1">
                                <slot/>
                        </main>

                        <app-footer :record-number="siteStore.recordNumber" :site-name="siteStore.siteName"/>
                </div>
        </div>
</template>


<script lang="ts" setup>
import {siteApi} from '~/api/site/siteApi';
import {useSiteStore} from '~/stores/siteStore';

const siteStore = useSiteStore();

// 在服务端获取网站配置
await useAsyncData('site-info', async () => {
        try {
                const result: any = await siteApi.getSiteInfo();
                if (result?.success && result.data) {
                        siteStore.setSiteInfo(result.data);
                }
        } catch (error) {
                console.error('获取网站配置失败:', error);
        }
        return null;
});
</script>


