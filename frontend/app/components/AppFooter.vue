<template>
        <footer class="mt-10">
                <a-divider/>
                <div class="pb-6 bg-white flex flex-col md:flex-row md:justify-between ">
                        <div class="flex flex-col md:mx-10">
                                <div class="my-auto mx-8">
                                        <h1 class="text-xl font-black mb-4">{{ siteName || 'MyBlog' }}</h1>
                                        <p class="text-gray-600">© 2026 All rights reserved.</p>
                                        <p v-if="recordNumber" class="text-gray-500 text-sm mt-2">{{ recordNumber }}</p>
                                </div>
                        </div>
                        <div class="my-4 md:my-0"></div>
                        <div class="flex flex-row md:mx-10">
                                <div class="my-auto flex gap-4 mx-8 md:mx-10">
                                        <a-tooltip title="RSS订阅">
                                                <a :href="rssUrl"
                                                   class="text-gray-500 hover:text-blue-500 transition-colors"
                                                   target="_blank">
                                                        <svg class="bi bi-rss" fill="currentColor" height="20"
                                                             viewBox="0 0 16 16" width="20"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                                                <path
                                                                    d="M5.5 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-3-8.5a1 1 0 0 1 1-1c5.523 0 10 4.477 10 10a1 1 0 1 1-2 0 8 8 0 0 0-8-8 1 1 0 0 1-1-1zm0 4a1 1 0 0 1 1-1 6 6 0 0 1 6 6 1 1 0 1 1-2 0 4 4 0 0 0-4-4 1 1 0 0 1-1-1z"/>
                                                        </svg>
                                                </a>
                                        </a-tooltip>
                                </div>
                        </div>
                </div>
        </footer>
</template>

<script lang="ts" setup>
import {useRuntimeConfig} from '#imports'

const config = useRuntimeConfig()

const rssUrl = computed(() => `${config.public.apiBase}/api/public/rss`)

defineProps<{
        siteName?: string
        recordNumber?: string
}>()
</script>

<style scoped>

</style>