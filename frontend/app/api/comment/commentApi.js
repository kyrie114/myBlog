/**
 * 公共评论API模块
 * 用于前台公开接口，无需登录即可访问
 */

// API基础路径配置
const PUBLIC_COMMENT_BASE_PATH = '/api/public/comment';

import request from '../../utils/request.js';

/**
 * 公共评论相关API函数
 */
export const commentApi = {

	/**
	 * 提交评论或回复
	 * @param {Object} params - 评论参数
	 * @param {number} params.blogId - 文章ID
	 * @param {number} params.parentId - 父评论ID，0表示顶级评论
	 * @param {string} [params.username] - 评论者名称（游客必填，已登录用户可不填）
	 * @param {string} [params.email] - 邮箱（已登录用户可不填）
	 * @param {string} [params.avatarUrl] - 头像URL（已登录用户可不填）
	 * @param {string} [params.website] - 个人网站
	 * @param {string} params.content - 评论内容
	 * @returns {Promise} 返回评论提交结果
	 */
	submitComment: async ({ blogId, parentId, username, email, avatarUrl, website, content }) => {
		return request.post(`${PUBLIC_COMMENT_BASE_PATH}`, {
			blogId,
			parentId,
			...(username && { username }),
			...(email && { email }),
			...(avatarUrl && { avatarUrl }),
			...(website && { website }),
			content
		})
	},

	/**
	 * 获取文章评论列表（树形结构）
	 * @param {number} blogId - 文章ID
	 * @returns {Promise} 返回评论树形列表
	 */
	getCommentList: async (blogId) => {
		return request.get(`${PUBLIC_COMMENT_BASE_PATH}/list/${blogId}`)
	},

};
