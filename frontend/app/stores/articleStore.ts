import {defineStore} from 'pinia';

/**
 * 文章状态管理
 * 用于管理文章列表页面的搜索状态
 */
export const useArticleStore = defineStore('article', {
    state: () => ({
        // 搜索关键词
        searchKeyword: '',
        // 搜索触发标志（用于通知ContentList重新搜索）
        shouldSearch: false,
        // 选中的分类ID
        categoryId: null as number | null,
    }),

    actions: {
        /**
         * 设置搜索关键词
         * @param {string} keyword - 搜索关键词
         */
        // setSearchKeyword(keyword: string) {
        // 	this.searchKeyword = keyword;
        // },

        /**
         * 触发搜索
         * 更新shouldSearch标志以通知ContentList组件
         */
        triggerSearch() {
            this.shouldSearch = true;
        },
        //
        // /**
        //  * 清除搜索触发标志
        //  */
        // clearSearchTrigger() {
        //     this.shouldSearch = false;
        // },

        /**
         * 执行搜索（设置关键词并触发）
         * @param {string} keyword - 搜索关键词
         */
        search(keyword: string) {
            this.searchKeyword = keyword;
            this.triggerSearch();
        },

        /**
         * 设置分类ID并触发搜索
         * @param {number | null} categoryId - 分类ID
         */
        // setCategoryId(categoryId: number | null) {
        //     this.categoryId = categoryId;
        //     this.triggerSearch();
        // },

        /**
         * 清空搜索
         */
        // clearSearch() {
        // 	this.searchKeyword = '';
        // 	this.triggerSearch();
        // },
    },
});
