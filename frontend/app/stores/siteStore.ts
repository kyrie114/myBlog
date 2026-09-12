import {defineStore} from 'pinia';

/**
 * 网站配置状态管理
 * 用于管理网站基础信息（名称、域名、描述、备案号等）
 */
interface SiteInfo {
	siteName: string;
	siteDomain: string;
	siteDescription: string;
	recordNumber: string;
}

export const useSiteStore = defineStore('site', {
	state: () => ({
		siteInfo: null as SiteInfo | null,
		loaded: false,
	}),

	getters: {
		siteName: (state) => state.siteInfo?.siteName || 'kyrie114 的博客',
		siteDomain: (state) => state.siteInfo?.siteDomain || '',
		siteDescription: (state) => state.siteInfo?.siteDescription || '个人分享：AI工程从零 × 矩阵方法跟读',
		recordNumber: (state) => state.siteInfo?.recordNumber || '',
	},

	actions: {
		setSiteInfo(info: SiteInfo | null) {
			this.siteInfo = info;
			this.loaded = true;
		},
	},
});