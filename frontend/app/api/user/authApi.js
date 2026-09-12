// API基础路径配置
const AUTH_BASE_PATH = '/api/auth';

import request from '../../utils/request.js';

/**
 * 用户认证相关的API函数
 */
export const authApi = {

	/**
	 * 获取当前登录用户资料
	 */
	profile: async () => {
		return request.post(`${AUTH_BASE_PATH}/profile`)
	},

	/**
	 * 根据code换取token
	 * @param {string} code - 授权码
	 * @param {boolean} remember - 是否记住登录，true存localStorage，false存sessionStorage
	 */
	getToken: async (code, remember = false) => {
		return request.post(`${AUTH_BASE_PATH}/oauth/token`, { code, remember })
	},

};