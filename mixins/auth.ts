import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AuthMixin extends Vue {
  async loginEmployee(email: string, password: string) {
    await this.requestCookie();
    await this.$auth.loginWith('local', {
      data: {
        email,
        password,
      },
    });
  }

  async loginGuest() {
    await this.requestCookie();

    // todo
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

  async recoverPassword(email: string) {
    await this.requestCookie();
    await this.$axios.$post(process.env.NUXT_ENV_API_ROUTE + '/recover-password', {
      email,
    });
  }

  async resetPassword(token: string, email: string, password: string) {
    await this.$axios.$post(process.env.NUXT_ENV_API_ROUTE + '/reset-password', {
      token,
      email,
      password,
      password_confirmation: password,
    });
  }

  async register(details: Object) {
    await this.$axios.$post(process.env.NUXT_ENV_API_ROUTE + '/register', details);
  }
}
