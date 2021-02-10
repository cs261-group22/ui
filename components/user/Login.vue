<template>
  <div class="container pt-24 md:pt-48 px-6 mx-auto flex flex-wrap flex-col items-center">
    <div>
      <h2 class="mt-6 text-center text-3xl md:text-5xl font-extrabold text-primary">
        {{ heading }}
      </h2>

      <p class="mt-2 text-center text-sm text-secondary">
        <span v-if="isDashboardLogin">
          {{
            verifiedEmail
              ? 'Your account has been verified successfully, please enter your details below.'
              : 'To continue to the host dashboard, enter your details below.'
          }}
        </span>
        <span v-else>To continue to this event, enter your details below.</span>
      </p>
    </div>

    <div class="mt-8 space-y-6 w-96">
      <div class="rounded-md shadow-sm">
        <div class="mb-6">
          <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            v-model="email"
            type="email"
            name="email"
            autocomplete="email"
            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            required
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            name="password"
            type="password"
            autocomplete="current-password"
            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="Password"
            required
          />
        </div>
      </div>

      <!-- <div class="flex items-center justify-between">
        <div class="text-sm">
          <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
            Forgot your password?
          </a>
        </div>
      </div> -->

      <div>
        <button
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="submit"
        >
          Sign in
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator';

import AuthMixin from '~/mixins/auth';

@Component
export default class Login extends AuthMixin {
  email: string = '';
  password: string = '';

  async submit() {
    try {
      await this.loginEmployee(this.email, this.password);

      // todo: although not vulnerable to xss, this should be handled in vuex
      if (this.isDashboardLogin) {
        this.$router.push('/dashboard');
      } else {
        this.$router.push(`/event/${this.$route.query.target}`);
      }
    } catch {
      // todo: show message
    }
  }

  get isDashboardLogin() {
    return this.$route.query.target === 'dashboard';
  }

  get heading() {
    return this.isDashboardLogin ? 'Host Dashboard Login' : 'Employee Login';
  }

  get verifiedEmail() {
    return this.$route.query.verified === '1';
  }
}
</script>
