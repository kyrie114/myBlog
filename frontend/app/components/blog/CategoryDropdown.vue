<template>
        <div class="hidden md:flex items-center">
                <div class="category-dropdown">
                        <button
                            class="category-dropdown-trigger text-gray-600 transition-colors font-medium text-sm tracking-tight cursor-pointer"
                            @click="toggleDropdown"
                        >
                                {{ currentCategoryName }}
                                <span class="dropdown-arrow">▼</span>
                        </button>
                        <div v-if="isDropdownOpen" class="category-dropdown-menu">
                                <div
                                    :class="{ active: !selectedCategoryId }"
                                    class="dropdown-item"
                                    @click="selectCategory(undefined)"
                                >
                                        全部分类
                                </div>
                                <div
                                    v-for="category in categoryList"
                                    :key="category.id"
                                    :class="{ active: selectedCategoryId === category.id }"
                                    class="dropdown-item"
                                    @click="selectCategory(category.id)"
                                >
                                        {{ category.name }}
                                </div>
                        </div>
                </div>
        </div>

        <div class="md:hidden">
                <div class="text-xl font-black mb-2">选择分类</div>
                <div class="flex flex-col gap-2 px-3 border-l-2 border-gray-300">
                        <div
                            :class="{ 'text-blue-500 font-bold': !selectedCategoryId }"
                            class="text-base cursor-pointer"
                            @click="selectCategory(undefined)"
                        >
                                全部分类
                        </div>
                        <div
                            v-for="category in categoryList"
                            :key="category.id"
                            :class="{ 'text-blue-500 font-bold': selectedCategoryId === category.id }"
                            class="text-base cursor-pointer"
                            @click="selectCategory(category.id)"
                        >
                                {{ category.name }}
                        </div>
                </div>
        </div>
</template>

<script lang="ts" setup>
import {categoryApi} from '~/api/category/categoryApi'

const props = defineProps<{
        show?: boolean
}>()

const route = useRoute()

const categoryList = ref<any[]>([])
const selectedCategoryId = ref<number | undefined>(undefined)
const isDropdownOpen = ref(false)

const STORAGE_KEY = 'selectedCategoryId'

const loadSelectedCategory = () => {
        if (import.meta.client) {
                const stored = localStorage.getItem(STORAGE_KEY)
                if (stored) {
                        selectedCategoryId.value = stored === 'all' ? undefined : Number(stored)
                }
        }
}

const saveSelectedCategory = (categoryId: number | undefined) => {
        if (import.meta.client) {
                if (categoryId === undefined) {
                        localStorage.setItem(STORAGE_KEY, 'all')
                } else {
                        localStorage.setItem(STORAGE_KEY, categoryId.toString())
                }
        }
}

const currentCategoryName = computed(() => {
        if (!selectedCategoryId.value) return '全部分类'
        const category = categoryList.value.find(c => c.id === selectedCategoryId.value)
        return category?.name || '全部分类'
})

const fetchCategoryList = async () => {
        try {
                const result = await categoryApi.getCategoryList()
                if (result && result.data) {
                        categoryList.value = result.data || []
                }
        } catch (error) {
                console.error('获取分类列表失败:', error)
        }
}

const toggleDropdown = () => {
        isDropdownOpen.value = !isDropdownOpen.value
}

const selectCategory = (categoryId: number | undefined) => {
        selectedCategoryId.value = categoryId
        saveSelectedCategory(categoryId)
        isDropdownOpen.value = false
        navigateTo({
                path: route.path,
                query: categoryId ? {categoryId: categoryId.toString()} : {}
        }, {replace: true})
}

const closeDropdown = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        if (!target.closest('.category-dropdown')) {
                isDropdownOpen.value = false
        }
}

const handleCategoryStorageChange = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY) {
                loadSelectedCategory()
        }
}

watch(() => route.path, (newPath) => {
        if (newPath !== '/myblog' && newPath !== '/' && newPath !== '') {
                selectedCategoryId.value = undefined
                saveSelectedCategory(undefined)
        }
})

onMounted(() => {
        document.addEventListener('click', closeDropdown)
        window.addEventListener('storage', handleCategoryStorageChange)
        fetchCategoryList()
        loadSelectedCategory()
})

onUnmounted(() => {
        document.removeEventListener('click', closeDropdown)
        window.removeEventListener('storage', handleCategoryStorageChange)
})
</script>

<style scoped>
.category-dropdown {
        position: relative;
}

.category-dropdown-trigger {
        display: flex;
        align-items: center;
        gap: 4px;
        background: none;
        border: none;
        padding: 0;
}

.dropdown-arrow {
        font-size: 10px;
        transition: transform 0.2s;
}

.category-dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        margin-top: 8px;
        min-width: 120px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: 4px 0;
        z-index: 100;
}

.dropdown-item {
        padding: 8px 12px;
        cursor: pointer;
        font-family: 'Plus_Jakarta_Sans', sans-serif;
        font-size: 14px;
        font-weight: 500;
        color: #8c8c8c;
        transition: all 0.2s;
}

.dropdown-item:hover {
        background: #f1f5f9;
}

.dropdown-item.active {
        font-weight: 600;
}
</style>