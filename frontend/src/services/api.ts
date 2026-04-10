import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 服务器返回错误
      const errorData = error.response.data;
      throw new Error(errorData.error?.message || errorData.detail || '请求失败');
    } else if (error.request) {
      // 请求已发出但没有收到响应
      throw new Error('网络错误，请检查网络连接');
    } else {
      throw new Error(error.message || '未知错误');
    }
  }
);
