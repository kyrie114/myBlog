<template>
        <div>
                <nuxt-layout>
                        <nuxt-page/>
                </nuxt-layout>
        </div>
</template>

<style>

body {
        font-family: sans-serif;
}

/* 修复Tailwind CSS导致的图片图标居中问题 */
img, svg, video, canvas, audio, iframe, embed, object {
        vertical-align: baseline !important;
}

/* 全局滚动条样式 */
::-webkit-scrollbar {
        width: 6px;
        height: 6px;
}

::-webkit-scrollbar-track {
        background: transparent;
}

::-webkit-scrollbar-thumb {
        background: rgba(155, 155, 155, 0.5);
        border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
        background: rgba(155, 155, 155, 0.7);
}


.hljs {
        background: none !important;
        border: 0 !important;
        color: #ddd;
}
</style>