<template>
        <!-- Main Content Area -->
        <section class="mt-32 px-4 max-w-3xl mx-auto">
                <div class="mb-10">
                        <h1 class="text-4xl font-extrabold text-on-surface tracking-tighter mb-2">朋友们</h1>
                        <p class="text-secondary text-sm font-medium tracking-wide uppercase opacity-70">Curation of
                                Excellent Technical Blogs &amp; Links</p>
                </div>

                <!-- 加载状态 -->
                <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div v-for="i in 6" :key="i"
                             class="block p-4 bg-surface-container/50 border border-outline-variant/15 rounded-lg animate-pulse">
                                <div class="flex items-center gap-4">
                                        <div class="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0"></div>
                                        <div class="min-w-0 flex-1">
                                                <div class="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                                                <div class="h-3 w-40 bg-gray-200 rounded"></div>
                                        </div>
                                </div>
                        </div>
                </div>

                <!-- 友链列表 -->
                <div v-else-if="friendLinkList.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <a v-for="link in friendLinkList"
                           :key="link.name"
                           :href="link.url"
                           class="group block p-4 bg-transparent border border-outline-variant/15 rounded-lg transition-all duration-300"
                           rel="noopener noreferrer"
                           target="_blank">
                                <div class="flex items-center gap-4">
                                        <div
                                            class="w-12 h-12 rounded-lg overflow-hidden bg-surface-container flex-shrink-0 border border-outline-variant/10 text-gray-400">
                                                <template v-if="link.imageUrl">
                                                        <img v-if="imageLoadedMap[link.name]"
                                                             :alt="link.name"
                                                             :src="link.imageUrl"
                                                             class="w-full h-full object-cover transition-all"
                                                             @error="(e) => handleImageError(e, link.name)">
                                                        <div v-else-if="imageErrorMap[link.name]"
                                                             class="w-full h-full flex flex-col items-center justify-center bg-surface-container-highest/50">
                                                                <svg class="w-5 h-5 text-gray-400" fill="none"
                                                                     stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path
                                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                            stroke-width="1.5"/>
                                                                </svg>
                                                                <span class="text-[8px] text-gray-400 mt-0.5">404</span>
                                                        </div>
                                                        <img v-else
                                                             :alt="link.name"
                                                             :src="link.imageUrl"
                                                             class="w-full h-full object-cover transition-all hidden"
                                                             @error="(e) => handleImageError(e, link.name)"
                                                             @load="handleImageLoad(link.name)">
                                                        <div
                                                            v-if="!imageLoadedMap[link.name] && !imageErrorMap[link.name]"
                                                            class="w-full h-full flex flex-col items-center justify-center bg-surface-container-highest/50">
                                                                <svg class="w-5 h-5 text-gray-400 animate-pulse"
                                                                     fill="none" stroke="currentColor"
                                                                     viewBox="0 0 24 24">
                                                                        <path
                                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                            stroke-width="1.5"/>
                                                                </svg>
                                                        </div>
                                                </template>
                                                <div v-else
                                                     class="w-full h-full flex items-center justify-center text-on-surface-variant text-xs">
                                                        {{ link.name.charAt(0).toUpperCase() }}
                                                </div>
                                        </div>
                                        <div class="min-w-0">
                                                <h3 class="font-bold text-on-surface text-sm truncate group-hover:text-primary transition-colors">
                                                        {{ link.name }}</h3>
                                                <p class="text-secondary text-xs truncate leading-relaxed">
                                                        {{ link.summary || '暂无简介' }}</p>
                                        </div>
                                </div>
                        </a>
                </div>

                <!-- 分页组件 -->
                <div v-if="!loading && friendLinkList.length > 0 && total > pageSize" class="mt-6 flex justify-center">
                        <a-pagination
                            v-model:current="currentPage"
                            :page-size="pageSize"
                            :show-size-changer="false"
                            :total="total"
                            show-less-items
                            @change="handlePageChange"
                        />
                </div>

                <!-- 空状态 -->
                <a-empty v-if="!loading && friendLinkList.length === 0" class="mt-12" description="暂无友链"/>

                <!-- 申请须知 -->
                <div class="mt-16 bg-surface-container-low p-8 rounded-lg">
                        <h2 class="font-bold text-lg mb-4 text-on-surface">申请须知</h2>
                        <p class="text-on-surface-variant text-sm leading-relaxed max-w-2xl">
                                请提前添加本站，我将会很快处理。 如果你的站点打不开或者被墙了我将会定期移除，
                                如果更换了域名请告诉我你之前的域名和更换后的域名以方便我调整。
                                若长时间未审核or评论不了，请加QQ：3209174373，只换个人博客。
                        </p>
                        <p class="text-on-surface-variant text-sm leading-relaxed max-w-2xl mt-2">
                                我的网站：名称 {{ siteStore.siteName }}、域名 {{ siteStore.siteDomain || '待配置' }} 、描述
                                {{ siteStore.siteDescription || '待配置' }}
                        </p>
                </div>

                <!-- 申请友链表单 -->
                <div class="mt-16 bg-transparent border border-outline-variant/15 px-8 pt-8 pb-2 rounded-lg">
                        <h2 class="font-bold text-lg mb-6 text-on-surface">申请友链</h2>
                        <a-form
                            ref="formRef"
                            :layout="'vertical'"
                            :model="formData"
                            @finish="handleSubmit"
                        >
                                <a-form-item
                                    :rules="[{ required: true, message: '请输入站点名称' }]"
                                    label="名称"
                                    name="name"
                                >
                                        <a-input
                                            v-model:value="formData.name"
                                            placeholder="请输入站点名称"
                                            size="large"
                                        />
                                </a-form-item>

                                <a-form-item
                                    :rules="[{ required: true, message: '请输入URL地址' }]"
                                    label="URL"
                                    name="url"
                                >
                                        <a-input
                                            v-model:value="formData.url"
                                            placeholder="https://example.com"
                                            size="large"
                                        />
                                </a-form-item>

                                <a-form-item
                                    label="简介"
                                    name="summary"
                                >
                                        <a-textarea
                                            v-model:value="formData.summary"
                                            :rows="3"
                                            placeholder="请输入站点简介"
                                        />
                                </a-form-item>

                                <a-form-item
                                    label="站点图片"
                                    name="imageUrl"
                                >
                                        <a-input
                                            v-model:value="formData.imageUrl"
                                            placeholder="请输入头像或 Logo URL"
                                            size="large"
                                        />
                                </a-form-item>

                                <a-form-item>
                                        <a-button
                                            :loading="submitting"
                                            html-type="submit"
                                            size="large"
                                            type="primary"
                                        >
                                                {{ submitting ? '提交中...' : '提交' }}
                                        </a-button>
                                </a-form-item>
                        </a-form>
                </div>
        </section>
</template>

<script lang="ts" setup>
import {message} from 'ant-design-vue';
import {friendLinkApi} from '~/api/friendLink/friendLinkApi';
import {useSiteStore} from '~/stores/siteStore';

const siteStore = useSiteStore();

// 友链列表数据
const friendLinkList = ref<any[]>([]);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(12);
const total = ref(0);
const loading = ref(true);

// 表单相关
const formRef = ref();
const submitting = ref(false);
const formData = ref({
        name: '',
        url: '',
        summary: '',
        imageUrl: ''
});

// 图片加载失败处理 - 使用对象存储每张图片的错误状态
const imageErrorMap = reactive<Record<string, boolean>>({});
const imageLoadedMap = reactive<Record<string, boolean>>({});

const handleImageLoad = (linkName: string) => {
        imageLoadedMap[linkName] = true;
};

const handleImageError = (e: Event, linkName: string) => {
        imageErrorMap[linkName] = true;
};

// 服务端渲染：使用 useAsyncData 获取初始数据
const {data: serverData} = await useAsyncData(
    'friend-link-list',
    async () => {
            return await friendLinkApi.getFriendLinkList({
                    currentPage: 1,
                    pageSize: pageSize.value
            });
    }
);

// 处理服务端返回的数据
if (serverData.value && serverData.value.data) {
        friendLinkList.value = serverData.value.data.records || [];
        total.value = serverData.value.data.total || 0;
}
loading.value = false;

// 获取友链列表（客户端分页时调用）
const fetchFriendLinkList = async () => {
        loading.value = true;
        try {
                const result = await friendLinkApi.getFriendLinkList({
                        currentPage: currentPage.value,
                        pageSize: pageSize.value
                });

                if (result && result.data) {
                        friendLinkList.value = result.data.records || [];
                        total.value = result.data.total || 0;
                } else {
                        friendLinkList.value = [];
                        total.value = 0;
                }
        } catch (error: any) {
                console.error('获取友链列表失败:', error);
                message.error(error.message || '获取友链列表失败');
                friendLinkList.value = [];
                total.value = 0;
        } finally {
                loading.value = false;
        }
};

// 分页变化
const handlePageChange = (page: number) => {
        currentPage.value = page;
        fetchFriendLinkList();
        if (import.meta.client) {
                window.scrollTo({top: 0, behavior: 'smooth'});
        }
};

// 提交表单
const handleSubmit = async () => {
        submitting.value = true;
        try {
                await friendLinkApi.submitFriendLink({
                        name: formData.value.name,
                        url: formData.value.url,
                        summary: formData.value.summary,
                        imageUrl: formData.value.imageUrl
                });

                message.success('外链提交成功，待审核后显示');

                // 重置表单
                formData.value = {
                        name: '',
                        url: '',
                        summary: '',
                        imageUrl: ''
                };
                formRef.value?.resetFields();
        } catch (error: any) {
                console.error('提交友链失败:', error);
                message.error(error.message || '外链提交失败');
        } finally {
                submitting.value = false;
        }
};

// SEO 配置
useHead({
        title: `友链 - ${siteStore.siteName}`,
        meta: [
                {name: 'description', content: `${siteStore.siteName}的友链页面，汇集优质技术博客和网站链接`}
        ]
});

// OG 标签
useSeoMeta({
        title: `友链 - ${siteStore.siteName}`,
        description: `${siteStore.siteName}的友链页面，汇集优质技术博客和网站链接`,
        ogTitle: `友链 - ${siteStore.siteName}`,
        ogDescription: `${siteStore.siteName}的友链页面，汇集优质技术博客和网站链接`,
});
</script>
