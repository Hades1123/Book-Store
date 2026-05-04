import axios, { AxiosError } from 'axios';

let isRefreshing = false;
//! This queue stores promise callbacks of failed requests
let waitingQueue: Array<{ resolve: (value?: unknown) => void; reject: (error?: unknown) => void }> =
  [];

const processQueue = (error: unknown | null) => {
  waitingQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  waitingQueue = [];
};

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export function isAxiosError<ResponseType>(error: unknown): error is AxiosError<ResponseType> {
  return axios.isAxiosError(error);
}
// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    // If server is down -> error.response may be undefined
    // 401 -> accessToken is expired
    if (error.response?.status == 401) {
      if (error.config.url === '/auth/refresh-token') {
        return Promise.reject(error);
      }

      // If is refreshing, add req to queue;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          waitingQueue.push({ resolve, reject });
        }).then(() => {
          return instance(error.config);
        });
      } else {
        isRefreshing = true;
        return instance
          .post('/auth/refresh-token')
          .then(() => {
            processQueue(null);
            isRefreshing = false;
            return instance(error.config);
          })
          .catch((err: unknown) => {
            processQueue(err);
            isRefreshing = false;
            window.location.href = '/login';
            return Promise.reject(err);
          });
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
