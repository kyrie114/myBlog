<template>
  <div class="ds-home">
    <p class="pill"><span class="dot" /> developer preview · personal notes</p>
    <h1>Everything is a <span class="grad">note</span></h1>
    <p class="lead">
      个人分享栏目里，AI工程从零 与 矩阵方法跟读 并列更新——像插件一样组合。
    </p>
    <div class="cta">
      <NuxtLink class="btn primary" to="/myblog">打开个人分享</NuxtLink>
    </div>
    <pre class="term">$ open kyrie114/share --series ai-engineering,matrix-methods</pre>
    <p class="ref">
      主页信息架构参考
      <a href="https://www.deepseek.com/harness/en/" target="_blank" rel="noopener">DeepSeek Harness: Everything is a plugin</a>
    </p>

    <h2>Runtime modes</h2>
    <div class="modes">
      <NuxtLink class="mode" to="/myblog">
        <div class="tag">STANDARD</div>
        <h3>AI工程从零</h3>
        <p>环境、工具、线性代数直觉。</p>
      </NuxtLink>
      <NuxtLink class="mode" to="/myblog">
        <div class="tag">DEEP READ</div>
        <h3>矩阵方法跟读</h3>
        <p>PCA 五步与等价关系。</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'kyrie114 · Everything is a note',
  description: '个人分享：AI工程从零 × 矩阵方法跟读',
})
</script>

<style scoped>
.ds-home {
  max-width: 920px;
  margin: 6rem auto 4rem;
  padding: 0 1.25rem 3rem;
  color: #e8eaed;
}
.pill {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 999px;
  padding: .35rem .8rem;
  color: #9aa3b2;
  font-size: 12px;
}
.dot {
  width: 6px; height: 6px; border-radius: 50%; background: #34d399;
  box-shadow: 0 0 10px #34d399;
}
h1 {
  font-size: clamp(2.4rem, 6vw, 4rem);
  letter-spacing: -.04em;
  line-height: 1.05;
  margin: 1rem 0;
}
.grad {
  background: linear-gradient(90deg, #fff, #4cc9f0, #7c5cff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.lead { color: #9aa3b2; font-size: 1.1rem; max-width: 40rem; }
.cta { margin: 1.25rem 0; }
.btn.primary {
  display: inline-flex;
  padding: .75rem 1.1rem;
  border-radius: 12px;
  background: #111827;
  border: 1px solid rgba(255,255,255,.14);
  color: #fff;
  font-weight: 600;
}
.term {
  background: #05070a;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 12px;
  padding: .85rem 1rem;
  color: #c7d2fe;
  overflow-x: auto;
}
.ref { font-size: 12px; color: #6b7280; }
.ref a { color: #4cc9f0; }
h2 { margin-top: 2.5rem; }
.modes { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: .85rem; }
.mode {
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 16px;
  padding: 1.1rem;
  background: rgba(255,255,255,.02);
}
.mode .tag { color: #7c5cff; font-size: 12px; font-weight: 700; letter-spacing: .06em; }
.mode h3 { margin: .4rem 0; color: #fff; }
.mode p { margin: 0; color: #9aa3b2; font-size: .9rem; }
</style>
