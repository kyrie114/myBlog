<template>
        <!-- 主评论 -->
        <div class="relative">
                <!--                &lt;!&ndash; 左边框线 - 使用 left 定位 &ndash;&gt;-->
                <!--                <div v-if="depth > 0" class="absolute w-0.5 bg-gray-200"-->
                <!--                     style="left: -1.5rem; top: 0; bottom: 0;"></div>-->

                <div :style="indentStyle" class="flex ">
                        <!-- 头像 -->
                        <a v-if="(comment.website && isValidUrl(comment.website)) && avatarLoaded"
                           :href="comment.website"
                           class="flex-shrink-0"
                           rel="noopener noreferrer"
                           target="_blank">
                                <img v-if="comment.avatarUrl" :alt="comment.username"
                                     :src="comment.avatarUrl"
                                     class="w-10 h-10 rounded-full object-cover hover:opacity-80 transition-opacity cursor-pointer"
                                     @error="avatarLoaded = false"/>
                        </a>
                        <a v-if="(comment.website && isValidUrl(comment.website)) && !avatarLoaded"
                           :href="comment.website"
                           class="flex-shrink-0 w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary font-bold text-sm hover:opacity-80 transition-opacity cursor-pointer"
                           rel="noopener noreferrer"
                           target="_blank">
                                {{ getNameInitial(comment.username) }}
                        </a>
                        <img v-else-if="comment.avatarUrl && avatarLoaded" :alt="comment.username"
                             :src="comment.avatarUrl"
                             class="w-10 h-10 rounded-full object-cover flex-shrink-0"
                             @error="avatarLoaded = false"/>
                        <div v-else
                             class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary font-bold text-sm flex-shrink-0">
                                {{ getNameInitial(comment.username) }}
                        </div>

                        <div class="flex flex-col flex-1 min-w-0 ml-4">
                                <div class="flex items-center gap-2 pb-1 flex-wrap">
                                        <a v-if="comment.website && isValidUrl(comment.website)"
                                           :href="comment.website"
                                           class="text-sm font-bold text-on-background hover:text-primary transition-colors"
                                           rel="noopener noreferrer"
                                           target="_blank">
                                                {{ comment.username }}
                                        </a>
                                        <span v-else class="text-sm font-bold text-on-background">{{
                                                        comment.username
                                                }}</span>
                                        <span v-if="comment.email" class="text-xs text-outline">
                                        {{ maskEmail(comment.email) }}
                                </span>
                                        <a-tag v-if="comment.isAdmin" :bordered="false" color="red">管理员</a-tag>
                                </div>
                                <p class="text-sm text-on-surface-variant leading-relaxed mb-3 break-words">
                                        <span v-if="depth >= 2 && parentComment"
                                              class="text-primary mr-1">@{{ parentComment.username }} </span>
                                        {{ comment.content }}
                                </p>

                                <!-- 网站链接 -->
                                <a v-if="comment.website" :href="comment.website"
                                   class="text-xs text-primary hover:underline mb-2 inline-block"
                                   rel="noopener noreferrer"
                                   target="_blank">
                                        {{ comment.website }}
                                </a>

                                <div class="flex items-center gap-4 text-[11px] text-outline font-medium">
                                        <span>{{ formatDateTime(comment.createTime) }}</span>
                                        <button
                                            class="text-gray-400 hover:underline cursor-pointer"
                                            @click="$emit('reply', comment)">
                                                回复
                                        </button>
                                </div>

                                <!-- 回复表单 -->
                                <Transition
                                    enter-active-class="transition duration-300 ease-out"
                                    enter-from-class="opacity-0 -translate-y-2"
                                    enter-to-class="opacity-100 translate-y-0"
                                    leave-active-class="transition duration-200 ease-in"
                                    leave-from-class="opacity-100 translate-y-0"
                                    leave-to-class="opacity-0 -translate-y-2"
                                >
                                        <div v-if="showReplyForm" class="mt-6">
                                                <!-- 未登录用户：显示完整表单 -->
                                                <div v-if="!isLoggedIn"
                                                     class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                                <label
                                                                    class="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5 ml-0.5">名称</label>
                                                                <input v-model="localReplyForm.username"
                                                                       class="antd-input w-full px-3 py-2 text-sm rounded-md border-[1.6px] border-gray-200"
                                                                       placeholder="name" type="text"/>
                                                        </div>
                                                        <div>
                                                                <label
                                                                    class="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5 ml-0.5">邮箱</label>
                                                                <input v-model="localReplyForm.email"
                                                                       class="antd-input w-full px-3 py-2 text-sm rounded-md border-[1.6px] border-gray-200"
                                                                       placeholder="email@address.com" type="email"/>
                                                        </div>
                                                        <div>
                                                                <label
                                                                    class="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5 ml-0.5">头像链接</label>
                                                                <input v-model="localReplyForm.avatarUrl"
                                                                       class="antd-input w-full px-3 py-2 text-sm rounded-md border-[1.6px] border-gray-200"
                                                                       placeholder="https://image.url" type="url"/>
                                                        </div>
                                                        <div>
                                                                <label
                                                                    class="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5 ml-0.5">网站链接</label>
                                                                <input v-model="localReplyForm.website"
                                                                       class="antd-input w-full px-3 py-2 text-sm rounded-md border-[1.6px] border-gray-200"
                                                                       placeholder="https://yoursite.com" type="url"/>
                                                        </div>
                                                </div>
                                                <!-- 已登录用户：显示简化表单 -->
                                                <div v-else class="mb-4">
                                                        <div
                                                            class="flex items-center gap-3 mb-4 p-3 bg-primary/5 rounded-lg">
                                                                <!--                                                                <img v-if="currentUser?.avatarUrl"-->
                                                                <!--                                                                     :alt="currentUser.nickname || currentUser.username"-->
                                                                <!--                                                                     :src="currentUser.avatarUrl"-->
                                                                <!--                                                                     class="w-8 h-8 rounded-full object-cover"/>-->
                                                                <!--                                                                <div v-else-->
                                                                <!--                                                                     class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">-->
                                                                <!--                                                                        {{-->
                                                                <!--                                                                                (currentUser?.nickname || currentUser?.username || '?').charAt(0).toUpperCase()-->
                                                                <!--                                                                        }}-->
                                                                <!--                                                                </div>-->
                                                                <span class="text-sm font-medium text-on-background">{{
                                                                                currentUser?.nickname || currentUser?.username
                                                                        }}</span>
                                                                <!--                                                                <span class="text-xs text-secondary">(已登录)</span>-->
                                                        </div>
                                                        <div>
                                                                <label
                                                                    class="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5 ml-0.5">网站链接</label>
                                                                <input v-model="localReplyForm.website"
                                                                       class="antd-input w-full px-3 py-2 text-sm rounded-md border-[1.6px] border-gray-200"
                                                                       placeholder="https://yoursite.com" type="url"/>
                                                        </div>
                                                </div>
                                                <div class="mb-4">
                                                        <label
                                                            class="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5 ml-0.5">回复
                                                                @{{ comment.username }}</label>
                                                        <textarea v-model="localReplyForm.content"
                                                                  class="antd-input w-full p-3 text-sm min-h-[80px] rounded-md border-[1.6px] border-gray-200"
                                                                  placeholder="写下你的回复..."></textarea>
                                                </div>
                                                <div class="flex justify-end gap-2">
                                                        <button
                                                            class="bg-gray-200 px-6 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
                                                            @click="$emit('close-reply')">关闭
                                                        </button>
                                                        <button :disabled="submitting"
                                                                class="bg-primary text-white px-6 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                                                                @click="handleSubmit">{{
                                                                        submitting ? '提交中...' : '提交回复'
                                                                }}
                                                        </button>
                                                </div>
                                        </div>
                                </Transition>
                        </div>
                </div>

                <!-- 子评论-->
                <div v-if="comment.children && comment.children.length > 0" class="pt-6 space-y-6">
                        <CommentItem
                            v-for="child in comment.children"
                            :key="child.id"
                            :active-reply-id="activeReplyId"
                            :comment="child"
                            :current-user="currentUser"
                            :depth="depth + 1"
                            :is-logged-in="isLoggedIn"
                            :parent-comment="comment"
                            :submitting="submitting"
                            @reply="$emit('reply', $event)"
                            @close-reply="$emit('close-reply')"
                            @submit-reply="$emit('submit-reply', $event)"/>
                </div>
        </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {message} from 'ant-design-vue';
import CommentItem from './CommentItem.vue';

interface Comment {
        id: number;
        parentId: number;
        username: string;
        email?: string;
        avatarUrl?: string | null;
        website?: string | null;
        content: string;
        isAdmin?: boolean;
        createTime: string;
        children?: Comment[];
}

interface User {
        id: number;
        username: string;
        nickname: string;
        email: string;
        avatarUrl: string | null;
}

interface ReplyForm {
        username: string;
        email: string;
        avatarUrl: string;
        website: string;
        content: string;
}

const props = defineProps<{
        comment: Comment;
        depth: number;
        isLoggedIn: boolean;
        currentUser: User | null;
        activeReplyId: number | null;
        submitting: boolean;
        parentComment?: {
                username: string;
        };
}>();

// 计算固定的左边距（不累积，基于当前深度）
const indentStyle = computed(() => {
        return {
                marginLeft: props.depth > 0 ? '2rem' : '0'
        };
});

const emit = defineEmits<{
        reply: [comment: Comment];
        'close-reply': [];
        'submit-reply': [data: {
                parentId: number;
                username: string;
                email: string;
                avatarUrl: string;
                website: string;
                content: string
        }];
}>();

const showReplyForm = computed(() => props.activeReplyId === props.comment.id);

// 头像加载状态
const avatarLoaded = ref(true);

// 本地回复表单数据
const localReplyForm = ref<ReplyForm>({
        username: '',
        email: '',
        avatarUrl: '',
        website: '',
        content: ''
});

const handleSubmit = () => {
        // 验证必填项
        if (!localReplyForm.value.content.trim()) {
                message.warning('请输入回复内容');
                return;
        }
        if (!props.isLoggedIn && !localReplyForm.value.username.trim()) {
                message.warning('请输入名称');
                return;
        }
        if (!props.isLoggedIn && !localReplyForm.value.email.trim()) {
                message.warning('请输入邮箱');
                return;
        }

        const username: string = props.isLoggedIn && props.currentUser
            ? (props.currentUser.nickname || props.currentUser.username || '')
            : (localReplyForm.value.username || '');
        const email: string = props.isLoggedIn && props.currentUser
            ? (props.currentUser.email || '')
            : (localReplyForm.value.email || '');
        const avatarUrl: string = props.isLoggedIn && props.currentUser
            ? (props.currentUser.avatarUrl || '')
            : (localReplyForm.value.avatarUrl || '');

        emit('submit-reply', {
                parentId: props.comment.id,
                username,
                email,
                avatarUrl,
                website: localReplyForm.value.website || '',
                content: localReplyForm.value.content || ''
        });
};

// 获取名字首字母
const getNameInitial = (name: string) => {
        if (!name) return '?';
        return name.charAt(0).toUpperCase();
};

// 邮箱
const maskEmail = (email: string) => {
        return email
};

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 验证URL是否有效
const isValidUrl = (url: string | null | undefined): boolean => {
        if (!url) return false;
        try {
                const urlObj = new URL(url);
                return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
                return false;
        }
};
</script>
