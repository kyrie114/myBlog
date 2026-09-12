import axios from 'axios';
import {handleApi} from '../config/apiInterceptor.js';
import {getApiBase} from './apiConfig';

const service = axios.create({
	timeout: 40000,
	headers: {
		'X-Requested-With': 'XMLHttpRequest',
		'Content-Type': 'application/json; charset=UTF-8',
	},
});

service.interceptors.request.use(
    (config) => {
	    config.baseURL = getApiBase();

	    if (typeof window !== 'undefined') {
		    const isRemember = localStorage.getItem('remember') === 'true';
		    let token;

		    if (isRemember) {
			    token = localStorage.getItem('token');
		    } else {
			    token = sessionStorage.getItem('token');
			    if (!token) {
				    token = localStorage.getItem('token');
			    }
		    }

		    if (token) {
			    config.headers.token = `${token}`;
		    }
	    }
	    return config;
    },
    error => Promise.reject(error)
)

service.interceptors.response.use(
    response => {
	    let finalResult = null;
	    let isError = false;
	    let errorObj = null;

	    const {data, success, errorMsg, code} = response.data;

	    if (success === false) {
		    isError = true;
		    errorObj = new Error(errorMsg || '请求失败');
		    if (code !== undefined) {
			    handleApi(code.toString());
		    }
	    } else {
		    if (code !== undefined) {
			    handleApi(code.toString());
		    }
		    finalResult = {
			    data: data,
			    success: success,
			    errorMsg: errorMsg,
			    code: code
		    };
	    }

	    return isError ? Promise.reject(errorObj) : finalResult;
    },
    error => {
	    let finalError = error;

	    if (error.response) {
		    const {status, data} = error.response;
		    handleApi(status.toString());

		    if (data && typeof data === 'object') {
			    const {errorMsg, code} = data;
			    if (code !== undefined) {
				    handleApi(code.toString());
			    }
			    finalError = new Error(errorMsg || `请求失败 (${status})`);
		    } else {
			    finalError = new Error(`请求失败 (${status})`);
		    }
	    }

	    return Promise.reject(finalError);
    }
)

export default service
