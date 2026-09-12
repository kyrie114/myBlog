<template>
        <!--        <div class="fixed inset-0 -z-50 bg-[length:200%_200%] animate-gradient-->
        <!--        bg-gradient-to-tr from-blue-400/40 via-white/70 to-blue-400/70"></div>-->
        <div class="min-h-screen bg-gradient-to-br  to-indigo-100 flex flex-col justify-center items-center p-6">
                <!-- 错误代码展示 -->
                <div class="relative">
                        <!--                        <h1 class="text-9xl font-bold text-gray-800 opacity-10 absolute -top-16 -left-16">-->
                        <!--                                {{ error.statusCode }}-->
                        <!--                        </h1>-->
                        <div class="relative z-10">
                                <h2 class="text-6xl font-bold text-gray-800 mb-2">
                                        {{ errorTitle }}
                                </h2>
                                <p class="text-xl text-gray-600 mb-8 max-w-lg text-center">
                                        {{ errorDescription }}
                                </p>
                        </div>
                </div>

                <!-- 详细错误信息卡片 - 添加了Transition包裹 -->
                <Transition name="slide-fade">
                        <div v-if="showDetails" class="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mt-8">
                                <div class="flex justify-between items-center mb-4">
                                        <h3 class="text-lg font-semibold text-gray-800">错误详情</h3>
                                        <button
                                            class="text-blue-600 hover:text-blue-800 transition-transform hover:scale-110"
                                            @click="toggleDetails">
                                                <svg class="h-5 w-5" fill="currentColor"
                                                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path clip-rule="evenodd"
                                                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                              fill-rule="evenodd"/>
                                                </svg>
                                        </button>
                                </div>
                                <div class="bg-gray-50 rounded-lg p-4 overflow-x-auto transition-all duration-300">
                                        <pre class="text-sm text-gray-700">{{ errorString }}</pre>
                                </div>
                        </div>
                </Transition>

                <!-- 操作按钮组 -->
                <div class="flex flex-col sm:flex-row gap-4 mt-8">
                        <button
                            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 hover:shadow-md"
                            @click="handleError">
                                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                        <path clip-rule="evenodd"
                                              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                                              fill-rule="evenodd"/>
                                </svg>
                                返回首页
                        </button>

                        <button
                            class="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 hover:shadow-md"
                            @click="toggleDetails">
                                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                        <path clip-rule="evenodd"
                                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                                              fill-rule="evenodd"/>
                                </svg>
                                {{ showDetails ? '隐藏详情' : '查看详情' }}
                        </button>

                        <button
                            class="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition flex items-center justify-center gap-2 hover:shadow-md"
                            @click="reloadPage">
                                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                        <path clip-rule="evenodd"
                                              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                              fill-rule="evenodd"/>
                                </svg>
                                刷新页面
                        </button>
                </div>

                <!-- 联系支持 -->
                <div class="mt-12 text-center flex items-center justify-center gap-1">
                        <p class="text-gray-500">需要帮助？</p>
                        <a class="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                           href="mailto:3209174373@qq.com">
                                联系博主
                        </a>
                </div>
        </div>
</template>

<script setup>
import {computed, ref} from 'vue'

const props = defineProps({
        error: Object
})

const showDetails = ref(false)

const toggleDetails = () => {
        showDetails.value = !showDetails.value
}

// 格式化错误信息
const errorString = computed(() => {
        return JSON.stringify({
                statusCode: props.error.statusCode,
                message: props.error.message,
                path: props.error.path,
                // stack: process.dev ? props.error.stack : undefined
        }, null, 2)
})

// 根据状态码显示不同的标题和描述
const errorTitle = computed(() => {
        switch (props.error.statusCode) {
                case 404:
                        return '页面未找到'
                case 500:
                        return '服务器错误'
                case 403:
                        return '访问被拒绝'
                default:
                        return '出了点问题'
        }
})

const errorDescription = computed(() => {
        switch (props.error.statusCode) {
                case 404:
                        return '您访问的页面可能已被移除、重命名或暂时不可用'
                case 500:
                        return '服务器遇到意外情况，无法完成您的请求'
                case 403:
                        return '您没有权限访问此页面'
                default:
                        return props.error.statusMessage || '已收到通知，正在处理此问题'
        }
})

const handleError = () => clearError({redirect: '/'})

const reloadPage = () => {
        window.location.reload()
}
</script>

<style scoped>
/* 按钮悬停效果 */
button {
        transition: all 0.2s ease;
}

/* 联系链接动画 */
a {
        transition: color 0.2s ease;
}

/* 错误代码背景动画 */
h1 {
        animation: pulse 6s infinite ease-in-out;
}

@keyframes pulse {

        0%,
        100% {
                opacity: 0.1;
        }

        50% {
                opacity: 0.15;
        }
}
</style>