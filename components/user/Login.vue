<template>
  <div class="text-center">
    <div
      class="inline-flex mx-auto flex-col items-center bg-white rounded-lg py-8 px-6 sm:py-10 sm:px-8 lg:py-16 lg:px-20"
    >
      <div>
        <h2 class="text-3xl text-center md:text-4xl font-extrabold text-primary font-serif">
          {{ heading }}
        </h2>

        <p class="mt-2 text-sm text-center text-secondary">
          <span v-if="isDashboardLogin">
            {{
              verifiedEmail
                ? 'Your account has been verified successfully.'
                : 'To continue to the host dashboard, enter your details below.'
            }}
          </span>
          <span v-else>To continue to this event, enter your details below.</span>
        </p>

        <p v-if="failure" class="mt-2 text-sm text-center text-red-700 max-w-md">
          Sorry, your login request was not successful, please check your email address and
          password.
        </p>
      </div>

      <div class="mt-8 space-y-6 w-full md:w-96">
        <div class="rounded-md shadow-sm">
          <div class="mb-6">
            <label for="email" class="block text-sm font-medium text-primary text-left"
              >Email Address</label
            >
            <input
              v-model="email"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="Email Address"
              class="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>

          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-primary text-left"
              >Password</label
            >
            <input
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              class="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              placeholder="Password"
              required
            />
          </div>
        </div>

        <div>
          <vue-recaptcha
            ref="recaptcha"
            size="invisible"
            :sitekey="recaptchaKey"
            @verify="submit"
            @expired="resetCaptcha"
          >
            <button class="gradient-button is-dark w-full h-10">Sign in</button>
          </vue-recaptcha>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Ref } from 'nuxt-property-decorator';

import VueRecaptcha from 'vue-recaptcha';
import AuthMixin from '~/mixins/auth';

@Component({ components: { VueRecaptcha } })
export default class Login extends AuthMixin {
  email: string = '';
  password: string = '';

  @Ref('recaptcha') readonly recaptcha!: VueRecaptcha;

  submit(token: string) {
    this.loginEmployee(this.email, this.password, token)
      .then(() => {
        if (this.isDashboardLogin) {
          this.$router.push('/dashboard/events');
        } else {
          this.$router.push(`/event/${this.$route.query.target}`);
        }
      })
      .catch(() => {
        window.location.href = `?failure=1&target=${this.$route.query.target}`;
      });
  }

  resetCaptcha() {
    this.recaptcha.reset();
  }

  get failure() {
    return this.$route.query.failure;
  }

  get isDashboardLogin() {
    return !this.$route.query.target || this.$route.query.target === 'dashboard';
  }

  get heading() {
    return this.isDashboardLogin ? 'Host Dashboard Login' : 'Employee Login';
  }

  get verifiedEmail() {
    return this.$route.query.verified === '1';
  }

  get recaptchaKey() {
    return process.env.NUXT_ENV_RECAPTCHA_SITE_KEY;
  }
}
</script>
