<template>
  <div class="mt-32 mb-16 px-6 max-w-3xl mx-auto">
    <p class="text-sm tracking-widest text-gray-500 mb-2">个人博客 · kyrie114</p>
    <h1 class="text-4xl font-black text-gray-900 mb-3">关于我</h1>
    <p class="text-lg text-gray-600 mb-8">项目，创意，灵感，心得</p>

    <div class="grid gap-4 md:grid-cols-3 mb-12">
      <div class="rounded-2xl border border-gray-200 bg-white/70 p-5">
        <p class="text-xs text-gray-400 mb-2">座右铭</p>
        <p class="font-medium text-gray-800">已识乾坤大，尤怜草木青</p>
      </div>
      <div class="rounded-2xl border border-gray-200 bg-white/70 p-5">
        <p class="text-xs text-gray-400 mb-2">在学</p>
        <p class="font-medium text-gray-800">零到全栈 · AI 工程</p>
      </div>
      <div class="rounded-2xl border border-gray-200 bg-white/70 p-5">
        <p class="text-xs text-gray-400 mb-2">兴趣</p>
        <p class="font-medium text-gray-800">阅读、写作、旅行、摄影</p>
      </div>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 mb-2">个人分享</h2>
    <p class="text-gray-600 mb-6">两条学习线都在这里分享，并列更新。</p>

    <div class="grid gap-4 md:grid-cols-2 mb-10">
      <NuxtLink
        to="/myblog"
        class="block rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-50 to-white p-6 hover:border-gray-400 transition-colors"
      >
        <p class="text-xs uppercase tracking-wider text-sky-600 mb-2">系列</p>
        <h3 class="text-xl font-bold mb-2">AI工程从零</h3>
        <p class="text-sm text-gray-600">环境搭建、工具地图、线性代数直觉等工程向干货笔记。</p>
      </NuxtLink>
      <NuxtLink
        to="/myblog"
        class="block rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-white p-6 hover:border-gray-400 transition-colors"
      >
        <p class="text-xs uppercase tracking-wider text-indigo-600 mb-2">系列</p>
        <h3 class="text-xl font-bold mb-2">矩阵方法跟读</h3>
        <p class="text-sm text-gray-600">跟读《机器学习的矩阵方法》：PCA 五步、方差最大与重构误差等价。</p>
      </NuxtLink>
    </div>

    <NuxtLink
      to="/myblog"
      class="inline-flex items-center rounded-full bg-gray-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-gray-700"
    >
      进入个人分享
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'kyrie114 的博客',
  description: '个人分享：AI工程从零 × 矩阵方法跟读',
})
</script>