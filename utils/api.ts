import { NuxtAxiosInstance } from '@nuxtjs/axios';

// eslint-disable-next-line import/no-mutable-exports
let $axios: NuxtAxiosInstance;
let gotToken: boolean;

export function initializeAxios(axiosInstance: NuxtAxiosInstance) {
  $axios = axiosInstance;

  $axios.onRequest((config) => {
    if (!gotToken && config.url?.match(/^\//) && !config.url?.match(/^\/sanctum\//)) {
      return $axios
        .$get('/sanctum/csrf-cookie', {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
          withCredentials: true,
        })
        .then(() => {
          gotToken = true;
          return config;
        });
    }
  });
}

export { $axios };
