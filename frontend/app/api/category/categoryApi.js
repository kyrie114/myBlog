/**
 * 公共分类API模块
 * 用于前台公开接口，无需登录即可访问
 */

// API基础路径配置
const PUBLIC_CATEGORY_BASE_PATH = '/api/public/category';

import request from '../../utils/request.js';

/**
 * 公共分类相关API函数
 */
export const categoryApi = {

	/**
	 * 获取可显示的分类列表
	 * @returns {Promise} 返回所有未隐藏的分类列表
	 */
	getCategoryList: async () => {
		return request.get(`${PUBLIC_CATEGORY_BASE_PATH}/list`);
	},

	// /**
	//  * 根据ID获取分类详情
	//  * @param {number} id - 分类ID
	//  * @returns {Promise} 返回指定分类的信息
	//  */
	// getCategoryById: async (id) => {
	// 	return request.get(`${PUBLIC_CATEGORY_BASE_PATH}/${id}`);
	// },

};
