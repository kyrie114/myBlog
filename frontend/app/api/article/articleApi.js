/**
 * 文章API模块
 * 统一管理文章相关的API接口
 * 文档: /api/public/article/*
 */

// API路径配置
const API_BASE = '/api/public/article';


/**
 * 获取公共文章列表
 * @param {Object} params - 查询参数
 * @param {number} params.currentPage - 当前页码（从1开始）
 * @param {number} params.pageSize - 每页数量
 * @param {string} [params.keyword] - 搜索关键词（模糊搜索标题、摘要、分类名称、标签）
 * @param {number} [params.categoryId] - 分类ID（筛选指定分类，传入后搜索也只在该分类内进行）
 */
export const getPublicArticleList = async ({currentPage, pageSize, keyword = '', categoryId}) => {
	const {default: request} = await import('../../utils/request.js');
	return request.post(`${API_BASE}/list`, {
		currentPage,
		pageSize,
		keyword,
		...(categoryId && {categoryId})
	});
};

/**
 * 验证文章ID格式
 * @param {any} id - 文章ID
 * @returns {boolean} - 是否有效
 */
const isValidArticleId = (id) => {
	const num = Number(id);
	return !isNaN(num) && num > 0 && Number.isFinite(num) && String(id).trim() !== '';
};

/**
 * 获取公共文章详情
 */
export const getPublicArticleDetail = async (id) => {
	// 验证 ID 格式
	if (!isValidArticleId(id)) {
		return {
			success: false,
			errorMsg: '无效的文章ID'
		};
	}
	const {default: request} = await import('../../utils/request.js');
	return request.get(`${API_BASE}/${id}`);
};

/**
 * 文章API模块 - 统一导出
 */
export const articleApi = {
	getPublicArticleList,
	getPublicArticleDetail
};

