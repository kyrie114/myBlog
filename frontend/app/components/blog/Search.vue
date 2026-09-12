<template>
        <div class="relative">
                <!-- 搜索图标按钮 -->
                <button
                    class="flex items-center justify-center p-2  rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                    type="button"
                    @click="openSearch"
                >
                        <SearchOutlined class="text-gray-700"/>
                </button>

                <!-- 搜索弹窗 -->
                <a-modal
                    v-model:open="isSearchOpen"
                    :bodyStyle="{ padding: '0' }"
                    :footer="null"
                    :maskClosable="true"
                    :width="640"
                    centered
                    class="search-modal"
                    @cancel="handleClose"
                >
                        <template #title>
                                <!-- 搜索输入框 -->
                                <div class="flex items-center gap-3 pb-2 pr-10 border-b">
                                        <SearchOutlined class="text-gray-400"/>
                                        <input
                                            ref="searchInputRef"
                                            v-model="searchValue"
                                            class="flex-1 bg-transparent font-medium outline-none placeholder:text-gray-500 placeholder:font-normal"
                                            placeholder="搜索文章..."
                                            type="text"
                                            @keyup.enter="handleSearch"
                                            @keyup.escape="handleClose"/>
                                        <!--                                        <button-->
                                        <!--                                            v-if="searchValue"-->
                                        <!--                                            class="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"-->
                                        <!--                                            type="button"-->
                                        <!--                                            @click.stop="clearInput"-->
                                        <!--                                        >-->
                                        <!--                                                <CloseCircleFilled/>-->
                                        <!--                                        </button>-->
                                </div>
                        </template>

                        <div>
                                <!-- 搜索结果下拉 -->
                                <div v-if="showResults" class="mt-4">
                                        <!-- 结果列表 -->
                                        <div v-if="loading" class="py-8 text-center text-gray-400">
                                                <LoadingOutlined spin/>
                                                加载中...
                                        </div>
                                        <div v-else-if="searchResults.length === 0"
                                             class="py-8 text-center text-gray-400">
                                                未找到相关文章
                                        </div>
                                        <div v-else class="max-h-80 overflow-y-auto">
                                                <div
                                                    v-for="article in searchResults"
                                                    :key="article.id"
                                                    class="p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                                                    @click="goToArticle(article.id)"
                                                >
                                                        <div class="flex gap-3">
                                                                <!-- 封面图区域 -->
                                                                <!--                                                                <div v-if="article.coverImage && !failedImages.includes(article.id)"-->
                                                                <!--                                                                     class="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">-->
                                                                <!--                                                                        <img :alt="article.title"-->
                                                                <!--                                                                             :src="article.coverImage"-->
                                                                <!--                                                                             class="w-full h-full object-cover"-->
                                                                <!--                                                                             @error="failedImages.push(article.id)"/>-->
                                                                <!--                                                                </div>-->
                                                                <!--                                                                <div v-else-->
                                                                <!--                                                                     class="w-20 h-20 rounded-lg flex-shrink-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">-->
                                                                <!--                                                                        <span class="text-primary/40 text-2xl font-bold">{{ (article.title || '?').charAt(0).toUpperCase() }}</span>-->
                                                                <!--                                                                </div>-->

                                                                <div
                                                                    class="flex-1 min-w-0 flex flex-col justify-center">
                                                                        <!-- 标题 -->
                                                                        <h4 class="text-md font-semibold text-gray-800 truncate group-hover:text-primary transition-colors">
                                                                                {{ article.title }}</h4>
                                                                        <!-- 分类和标签 -->
                                                                        <div
                                                                            class="flex items-center flex-wrap gap-2 my-2">
                                                                                <span
                                                                                    class="text-[10px] font-medium px-1 py-[1.2px] rounded-[4px] bg-primary/10 text-primary">
                                                                                        {{
                                                                                                article.categoryName || '未分类'
                                                                                        }}
                                                                                </span>
                                                                                <span v-if="article.isTop"
                                                                                      class="text-[10px] px-1 py-[1.2px] rounded-[4px] bg-red-50 text-red-500 font-medium">
                                                                                        置顶
                                                                                </span>
                                                                                <span
                                                                                    v-for="tag in getArticleTags(article.tags)"
                                                                                    :key="tag"
                                                                                    class="text-[10px] px-1 py-[1.2px] rounded-[4px] bg-gray-100 text-gray-500">
                                                                                        {{ tag }}
                                                                                </span>
                                                                        </div>


                                                                        <!-- 摘要 -->
                                                                        <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                                                {{ article.summary || '暂无摘要' }}</p>
                                                                </div>

                                                                <!-- 箭头指示 -->
                                                                <div class="flex-shrink-0 flex items-center">
                                                                        <svg class="w-4 h-4 text-gray-300" fill="none"
                                                                             stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path d="M9 5l7 7-7 7"
                                                                                      stroke-linecap="round"
                                                                                      stroke-linejoin="round"
                                                                                      stroke-width="2"/>
                                                                        </svg>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>

                                        <!-- 分页控制 -->
                                        <div v-if="!loading && searchResults.length > 0"
                                             class="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                                                <span class="text-xs text-gray-400">
                                                        共 {{ total }} 篇
                                                </span>
                                                <div class="flex items-center gap-2">
                                                        <button
                                                            :disabled="currentPage <= 1"
                                                            class="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                            type="button"
                                                            @click="prevPage"
                                                        >
                                                                <LeftOutlined/>
                                                        </button>
                                                        <span class="text-xs text-gray-500 min-w-[60px] text-center">
                                                                {{ currentPage }} / {{ totalPages }}
                                                        </span>
                                                        <button
                                                            :disabled="currentPage >= totalPages"
                                                            class="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                            type="button"
                                                            @click="nextPage"
                                                        >
                                                                <RightOutlined/>
                                                        </button>
                                                </div>
                                        </div>
                                </div>

                                <!-- 搜索提示 -->
                                <div v-else class="py-6 text-center text-sm text-gray-600">
                                        <span v-if="!searchValue">输入关键词后按 Enter 键搜索</span>
                                        <span v-else>按 Enter 搜索: <span
                                            class="text-primary font-medium">{{ searchValue }}</span></span>
                                </div>
                        </div>
                </a-modal>
        </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import {LeftOutlined, LoadingOutlined, RightOutlined, SearchOutlined} from '@ant-design/icons-vue';
import {articleApi} from '~/api/article/articleApi.js';

// 防抖定时器
let searchDebounceTimer: string | number | NodeJS.Timeout | null | undefined = null;

const router = useRouter();

// // 默认封面图
// const defaultCover = '/images/main.png';
//
// // 404封面图
// const cover404 = '/images/404.png';

// 记录加载失败的图片ID
const failedImages = ref<number[]>([]);

// 检测图片是否可以加载
const checkImage = (url: string): Promise<boolean> => {
        return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = url;
        });
};
//
// // 获取文章图片
// const getArticleImage = (article: any) => {
//         // 如果之前加载失败，返回404的图片
//         if (failedImages.value.includes(article.id)) {
//                 return cover404;
//         }
//         // 如果没有coverImage或coverImage为空，返回默认封面
//         if (!article.coverImage) {
//                 return defaultCover;
//         }
//         return article.coverImage;
// };
//
// // 处理图片加载失败
// const handleImageError = (event: Event, articleId: number) => {
//         const img = event.target as HTMLImageElement;
//         img.src = cover404;
//         if (!failedImages.value.includes(articleId)) {
//                 failedImages.value.push(articleId);
//         }
// };

// 搜索弹窗开关
const isSearchOpen = ref(false);
const searchValue = ref('');
const searchInputRef = ref<HTMLInputElement | null>(null);

// 搜索结果状态
const showResults = ref(false);
const loading = ref(false);
const searchResults = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const lastKeyword = ref('');

// 计算总页数
const totalPages = computed(() => {
        return Math.ceil(total.value / pageSize.value) || 1;
});

// 解析标签字符串
const getArticleTags = (tagsStr: string | null | undefined) => {
        if (!tagsStr) return [];
        return tagsStr.split(',').map(tag => tag.trim()).filter(Boolean);
};

// 打开搜索弹窗
const openSearch = async () => {
        isSearchOpen.value = true;
        // 重置状态
        showResults.value = false;
        loading.value = false;
};

// 处理关闭
const handleClose = () => {
        isSearchOpen.value = false;
        setTimeout(() => {
                searchValue.value = '';
                showResults.value = false;
                searchResults.value = [];
                currentPage.value = 1;
                failedImages.value = [];
        }, 300);
};

// // 只清空输入框
// const clearInput = () => {
//         searchValue.value = '';
//         showResults.value = false;
//         searchResults.value = [];
//         currentPage.value = 1;
//         failedImages.value = [];
//         searchInputRef.value?.focus();
// };

// 搜索处理
const handleSearch = async () => {
        if (!searchValue.value.trim()) return;

        // 清除之前的防抖定时器
        if (searchDebounceTimer) {
                clearTimeout(searchDebounceTimer);
        }

        lastKeyword.value = searchValue.value.trim();
        currentPage.value = 1;
        showResults.value = true;

        // 防抖处理
        searchDebounceTimer = setTimeout(async () => {
                await fetchResults();
                searchDebounceTimer = null;
        }, 300);
};

// 获取搜索结果
const fetchResults = async () => {
        loading.value = true;
        // 清空之前失败的图片记录
        failedImages.value = [];
        try {
                const result = await articleApi.getPublicArticleList({
                        currentPage: currentPage.value,
                        pageSize: pageSize.value,
                        keyword: lastKeyword.value
                });

                if (result && result.data) {
                        searchResults.value = result.data.records || [];
                        total.value = result.data.total || 0;
                } else {
                        // API返回格式不正确或无数据
                        searchResults.value = [];
                        total.value = 0;
                }
                // 验证图片（非阻塞，不影响搜索结果显示）
                validateArticleImages().catch(() => {
                });
        } catch (error) {
                console.error('搜索失败:', error);
                searchResults.value = [];
                total.value = 0;
        } finally {
                loading.value = false;
        }
};

// 验证文章封面图是否有效（独立运行，不阻塞）
const validateArticleImages = async () => {
        for (const article of searchResults.value) {
                if (article.coverImage && !failedImages.value.includes(article.id)) {
                        try {
                                const isValid = await checkImage(article.coverImage);
                                if (!isValid) {
                                        failedImages.value.push(article.id);
                                }
                        } catch {
                                failedImages.value.push(article.id);
                        }
                }
        }
};

// 上一页
const prevPage = async () => {
        if (currentPage.value > 1) {
                currentPage.value--;
                loading.value = true;
                await fetchResults();
        }
};

// 下一页
const nextPage = async () => {
        if (currentPage.value < totalPages.value) {
                currentPage.value++;
                loading.value = true;
                await fetchResults();
        }
};

// 跳转文章详情
const goToArticle = (id: number) => {
        handleClose();
        router.push(`/article/${id}`);
};

// 监听弹窗打开，自动聚焦
watch(isSearchOpen, async (open) => {
        if (open) {
                await nextTick();
                setTimeout(() => {
                        searchInputRef.value?.focus();
                }, 100);
        }
});
</script>

