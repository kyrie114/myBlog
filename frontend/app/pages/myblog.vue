<template>
        <div>
                <div class="md:my-36 my-24"></div>
                <div class="mx-auto  max-w-2xl px-3">
                        <!-- 加载状态 -->
                        <Transition enter-active-class="transition duration-300 ease-out"
                                    enter-from-class="opacity-0 translate-y-2"
                                    enter-to-class="opacity-100 translate-y-0"
                                    leave-active-class="transition duration-200 ease-in"
                                    leave-from-class="opacity-100 translate-y-0"
                                    leave-to-class="opacity-0 -translate-y-2"
                                    mode="out-in">
                                <div v-if="loading" key="loading" class="flex justify-center">
                                        <div class="flex flex-col gap-6 w-full">
                                                <div v-for="i in 4" :key="i"
                                                     class="flex flex-col sm:flex-row bg-white mb-8 gap-6">
                                                        <div class="flex-1 min-w-0 flex flex-col h-40">
                                                                <div class="flex flex-row mb-2 gap-2">
                                                                        <div
                                                                            class="h-6 w-24 bg-gray-100 rounded animate-pulse"></div>
                                                                        <div
                                                                            class="h-6 w-16 bg-gray-100 rounded animate-pulse"></div>
                                                                </div>
                                                                <div
                                                                    class="my-2 h-6 w-3/4 bg-gray-100 rounded animate-pulse"></div>
                                                                <div class="flex-1 space-y-2">
                                                                        <div
                                                                            class="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                                                                        <div
                                                                            class="h-4 w-5/6 bg-gray-100 rounded animate-pulse"></div>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>

                                <template v-else-if="articleList.length > 0" key="articles">
                                        <a-timeline>
                                                <a-timeline-item
                                                    v-for="article in articleList"
                                                    :key="article.id"
                                                    :color="article.isTop ? 'red' : 'blue'"
                                                >
                                                        <NuxtLink
                                                            :to="`/article/${article.id}`"
                                                            class="timeline-content group block pb-8 px-3"
                                                        >
                                                                <h3 class="text-lg text-gray-700 font-bold group-hover:text-primary transition-colors mb-1">
                                                                        {{ article.title }}
                                                                </h3>
                                                                <div class="flex pt-1 items-center mb-1">
                                                                        <a-tag :bordered="false" color="blue">
                                                                                {{ article.categoryName || '未分类' }}
                                                                        </a-tag>
                                                                        <a-tag :bordered="false">
                                                                                <template #icon>
                                                                                        <CalendarOutlined/>
                                                                                </template>
                                                                                {{ formatDate(article.createTime) }}
                                                                        </a-tag>
                                                                        <a-tag :bordered="false">
                                                                                <template #icon>
                                                                                        <CommentOutlined/>
                                                                                </template>
                                                                                {{ article.commentCount }}条评论
                                                                        </a-tag>
                                                                        <a-tag v-if="article.isTop" :bordered="false"
                                                                               color="red">
                                                                                置顶
                                                                        </a-tag>
                                                                </div>

                                                                <p class="text-sm pt-2 text-on-surface-variant line-clamp-2 leading-relaxed">
                                                                        {{ article.summary || '暂无摘要' }}
                                                                </p>

                                                                <!--                                                                &lt;!&ndash; 标签 &ndash;&gt;-->
                                                                <!--                                                                <div v-if="article.tags"-->
                                                                <!--                                                                     class="pt-2 flex flex-wrap gap-1">-->
                                                                <!--                                                                        <span-->
                                                                <!--                                                                            v-for="tag in getArticleTags(article.tags)"-->
                                                                <!--                                                                            :key="tag"-->
                                                                <!--                                                                            class="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded"-->
                                                                <!--                                                                        >-->
                                                                <!--                                                                                {{ tag }}-->
                                                                <!--                                                                        </span>-->
                                                                <!--                                                                </div>-->

                                                                <p class="text-blue-400 pt-2 flex items-center">Read
                                                                        more <span
                                                                            class="mt-[3px]">
									<svg
                                                                            class="relative mt-px overflow-visible ml-2.5 text-sky-300"
                                                                            fill="none" height="6" stroke="currentColor"
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round" stroke-width="2"
                                                                            viewBox="0 0 3 6" width="3"><path
                                                                            d="M0 0L3 3L0 6"></path></svg>
								</span>
                                                                </p>
                                                        </NuxtLink>
                                                </a-timeline-item>
                                        </a-timeline>
                                </template>

                                <a-empty v-else key="empty" description="暂无文章"/>
                        </Transition>

                        <!-- 分页组件 -->
                        <div v-if="total > 0" class="mt-6 flex justify-center">
                                <a-pagination
                                    v-model:current="currentPage"
                                    :page-size="pageSize"
                                    :show-size-changer="false"
                                    :total="total"
                                    show-less-items
                                    @change="handlePageChange"
                                />
                        </div>
                </div>
        </div>
</template>

<script lang="ts" setup>
import {useRoute} from 'vue-router';
import {message} from 'ant-design-vue';
import {CalendarOutlined, CommentOutlined} from '@ant-design/icons-vue';
import {articleApi} from '~/api/article/articleApi';
import {useSiteStore} from '~/stores/siteStore';

const route = useRoute();
const siteStore = useSiteStore();

// 文章列表数据
const articleList = ref<any[]>([]);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(7);
const total = ref(0);
const loading = ref(true);

// 服务端渲染：使用 useAsyncData 获取初始数据
const {data: serverData} = await useAsyncData(
    `myblog-article-list-${route.query.categoryId || 'all'}`,
    async () => {
            const categoryId = route.query.categoryId ? Number(route.query.categoryId) : undefined;
            return await articleApi.getPublicArticleList({
                    currentPage: 1,
                    pageSize: pageSize.value,
                    keyword: '',
                    categoryId
            });
    },
    {
            getCachedData: (key, nuxtApp) => {
                    return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
            }
    }
);

// 处理服务端返回的数据
const serverResponse = serverData.value as any;
if (serverResponse && serverResponse.success !== false) {
        articleList.value = serverResponse?.data?.records || [];
        total.value = serverResponse?.data?.total || 0;
}
loading.value = false;

// 格式化日期
const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
};

// // 解析标签字符串
// const getArticleTags = (tagsStr: string | null | undefined) => {
//         if (!tagsStr) return [];
//         return tagsStr.split(',').map(tag => tag.trim()).filter(Boolean);
// };

// 获取文章列表（客户端分页/搜索时调用）
const fetchArticleList = async () => {
        loading.value = true;
        try {
                const categoryId = route.query.categoryId ? Number(route.query.categoryId) : undefined;
                const result: any = await articleApi.getPublicArticleList({
                        currentPage: currentPage.value,
                        pageSize: pageSize.value,
                        keyword: '',
                        categoryId
                });

                if (result && result.data) {
                        articleList.value = result.data.records || [];
                        total.value = result.data.total || 0;
                } else {
                        articleList.value = [];
                        total.value = 0;
                }
        } catch (error: any) {
                console.error('获取文章列表失败:', error);
                message.error(error.message || '获取文章列表失败');
                articleList.value = [];
        } finally {
                loading.value = false;
        }
};

// 分页变化
const handlePageChange = (page: number) => {
        currentPage.value = page;
        fetchArticleList();
        if (import.meta.client) {
                window.scrollTo({top: 0, behavior: 'smooth'});
        }
};

// 监听URL query参数变化（分类切换）
watch(() => route.query.categoryId, async () => {
        currentPage.value = 1;
        await fetchArticleList();
});

// SEO 配置
useHead({
        title: () => `${siteStore.siteName} - 我的博客`,
        meta: [
                {name: 'description', content: () => siteStore.siteDescription},
                {name: 'keywords', content: () => `博客,${siteStore.siteName},技术文章,生活分享`}
        ]
});

// OG 标签
useSeoMeta({
        title: () => `${siteStore.siteName} - 我的博客`,
        description: () => siteStore.siteDescription,
        ogTitle: () => siteStore.siteName,
        ogDescription: () => siteStore.siteDescription,
        ogSiteName: () => siteStore.siteName,
});
</script>
