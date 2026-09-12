/**
 * 公共友链API模块
 * 用于前台公开接口，无需登录即可访问
 * 文档: /api/public/friend-link/*
 */

// API基础路径配置
const PUBLIC_FRIEND_LINK_BASE_PATH = '/api/public/friend-link';

import request from '../../utils/request.js';

/**
 * 公共友链相关API函数
 */
export const friendLinkApi = {

	/**
	 * 提交友链申请
	 * @param {Object} params - 友链参数
	 * @param {string} params.name - 链接名称（必填）
	 * @param {string} params.url - URL地址（必填，必须为 http/https 协议）
	 * @param {string} [params.summary] - 简介
	 * @param {string} [params.imageUrl] - 站点图片URL（必须为 http/https 协议）
	 * @returns {Promise} 返回友链提交结果
	 */
	submitFriendLink: async ({ name, url, summary, imageUrl }) => {
		return request.post(`${PUBLIC_FRIEND_LINK_BASE_PATH}`, {
			name,
			url,
			...(summary && { summary }),
			...(imageUrl && { imageUrl })
		})
	},

	/**
	 * 获取已通过审核的友链列表
	 * @param {Object} params - 分页参数
	 * @param {number} params.currentPage - 当前页码（从1开始）
	 * @param {number} params.pageSize - 每页数量
	 * @returns {Promise} 返回友链分页列表
	 */
	getFriendLinkList: async ({ currentPage, pageSize }) => {
		return request.post(`${PUBLIC_FRIEND_LINK_BASE_PATH}/list`, {
			currentPage,
			pageSize
		})
	},

};
