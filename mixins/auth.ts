import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AuthMixin extends Vue {
  async loginEmployee(email: string, password: string, token: string) {
    await this.requestCookie();
    await this.$auth.loginWith('local', {
      data: {
        email,
        password,
        'recaptcha-response': token,
      },
    });
  }

  async loginGuest(token: string) {
    await this.requestCookie();

    let response = await this.$axios.$post(process.env.NUXT_ENV_API_ROUTE + '/login/guest', {
      'recaptcha-response': token,
    });

    this.$auth.setToken('local', 'Bearer ' + response.token);
    this.$axios.setHeader('Authorization', 'Bearer ' + response.token);
    this.$auth.ctx.app.$axios.setHeader('Authorization', 'Bearer ' + response.token);

    response = await this.$axios.get(process.env.NUXT_ENV_API_ROUTE + '/user');

    this.$auth.setUser(response.data);
  }

  async logout() {
    await this.$auth.logout();
  }

  async requestCookie() {
    await this.$axios.$get('/sanctum/csrf-cookie', {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
      withCredentials: true,
    });
  }
}
