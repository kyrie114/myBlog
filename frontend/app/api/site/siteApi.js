/**
 * 网站配置API模块
 * 统一管理网站公共配置相关的API接口
 * 文档: /api/public/config/*
 */

/**
 * @typedef {Object} SiteInfo
 * @property {string} siteName
 * @property {string} [siteDomain]
 * @property {string} [siteDescription]
 * @property {string} [recordNumber]
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {SiteInfo} data
 * @property {string} [errorMsg]
 * @property {number} [code]
 */

// API路径配置
const API_BASE = '/api/public/config';

import request from '../../utils/request.js';

/**
 * 获取网站基础信息
 * @returns {Promise<ApiResponse>} 包含 siteName, siteDomain, siteDescription, recordNumber
 */
export const getSiteInfo = async () => {
	return /** @type {Promise<ApiResponse>} */ (request.get(`${API_BASE}/site-info`));
};

// 导出模块
export const siteApi = {
	getSiteInfo
};
