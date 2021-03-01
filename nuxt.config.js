export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'CS261',
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700',
      },
    ],
  },

  pageTransition: 'page',

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['@/assets/sass/app.scss'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/event-bus.ts',
    '@/plugins/datepicker.ts',
    '@/plugins/axios-accessor.ts',
    '@/plugins/service-injector.ts',
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules to build (https://go.nuxtjs.dev/config-modules)
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/tailwindcss'],

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
  },

  // Disable the loading bar at the top of the page
  loading: false,
};
