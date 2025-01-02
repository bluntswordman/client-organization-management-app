import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { BASE_API_URL, BASE_APP_URL } from '@infrastructure/utils/constant';

const Axios = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

Axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      await axios.get(`${BASE_APP_URL}/api/clear-session`);
      window.location.href = `/login`;
      console.error('Unauthorized: Masuk terlebih dahulu');
    }
    return Promise.reject(error);
  }
);

export default Axios;
