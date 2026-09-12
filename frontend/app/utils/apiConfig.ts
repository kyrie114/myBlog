// API 地址管理
let apiBase = '';

export const initApiBase = (baseUrl: string) => {
	apiBase = baseUrl;
};

export const getApiBase = () => apiBase;
