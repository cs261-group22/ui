export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'FeedBank',
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap',
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap',
      },
    ],
    script: [
      {
        src: 'https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit',
        async: true,
        defer: true,
      },
    ],
  },

  pageTransition: 'page',

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['@/assets/sass/app.scss'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: ['@/plugins/axios-accessor.ts', '@/plugins/datepicker.ts'],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules to build (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/laravel-echo',
    'portal-vue/nuxt',
    '@nuxtjs/pwa',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://auth.nuxtjs.org/
    '@nuxtjs/auth',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: process.env.BASE_URL,
    credentials: true,
    maxBodyLength: 100 * 1024 * 1024,
    maxContentLength: 100 * 1024 * 1024,
    timeout: 10000,
  },

  // Auth module config
  auth: {
    redirect: false,
    strategies: {
      local: {
        endpoints: {
          login: {
            url: process.env.NUXT_ENV_API_ROUTE + '/login/employee',
            method: 'post',
            propertyName: 'token',
          },
          logout: {
            url: process.env.NUXT_ENV_API_ROUTE + '/logout',
            method: 'post',
            propertyName: 'logout',
          },
          user: {
            url: process.env.NUXT_ENV_API_ROUTE + '/user',
            method: 'get',
            propertyName: false,
          },
        },
      },
    },
    tokenType: '',
    localStorage: false,
    tokenRequired: false,
  },

  // Rules for Sass preprocessors
  // https://medium.com/javascript-in-plain-english/customize-bootstrap-in-nuxt-3da863703b35
  rules: [
    {
      test: /\.s[ac]ss$/i,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    },
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
  publicRuntimeConfig: {
    BASE_URL: process.env.BASE_URL,
    NUXT_ENV_API_ROUTE: process.env.NUXT_ENV_API_ROUTE,
    NUXT_ENV_PUSHER_KEY: process.env.NUXT_ENV_PUSHER_KEY,
    NUXT_ENV_RECAPTCHA_SITE_KEY: process.env.NUXT_ENV_RECAPTCHA_SITE_KEY,
  },

  // Disable the loading bar at the top of the page
  loading: true,

  // Laravel echo config (https://github.com/nuxt-community/laravel-echo)
  echo: {
    broadcaster: 'pusher',
    key: process.env.NUXT_ENV_PUSHER_KEY,
    disableStats: false,
    encrypted: true,
    authModule: true,
    connectOnLogin: true,
    cluster: 'eu',
    authEndpoint: process.env.BASE_URL + '/broadcasting/auth',
  },

  pwa: {
    manifest: {
      name: 'FeedBank',
      short_name: 'FeedBank',
      description: 'Event feedback system',
      theme_color: '#264653',
    },
    icons: {
      fileName: 'icon.png',
    },
  },

  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' }],
};
