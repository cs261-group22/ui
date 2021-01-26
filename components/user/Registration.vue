<template>
  <div class="container pt-24 md:pt-48 px-6 mx-auto flex flex-wrap flex-col items-center">
    <div>
      <h2 class="mt-6 text-center text-4xl md:text-5xl font-extrabold text-primary">
        Host Registration
      </h2>

      <p class="mt-2 text-center text-sm text-secondary">
        Already have a host account?

        <nuxt-link to="/sign-in" class="font-medium text-indigo-600 hover:text-indigo-500">
          Click here to sign in
        </nuxt-link>
      </p>
    </div>

    <form class="mt-8 space-y-6 w-96" action="#" method="POST">
      <input type="hidden" name="remember" value="true" />

      <div class="rounded-md shadow-sm">
        <div class="mb-6">
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            autocomplete="given-name"
            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            required
          />
        </div>

        <div class="mb-6">
          <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
          <input
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
            name="password"
            type="password"
            autocomplete="current-password"
            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="Password"
            required
          />
        </div>

        <div class="mb-6">
          <label for="password_confirmation" class="block text-sm font-medium text-gray-700"
            >Confirm Password</label
          >
          <input
            name="password_confirmation"
            type="password"
            autocomplete="current-password"
            required
            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="Password"
          />
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember_me"
            name="remember_me"
            type="checkbox"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label for="remember_me" class="ml-2 block text-sm text-gray-900"> Remember me </label>
        </div>

        <div class="text-sm">
          <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg
              class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          Sign in
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator';
import { Validate } from 'vuelidate-property-decorators';
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';

import AuthMixin from '~/mixins/auth';

const touchMap = new WeakMap();

@Component({
  mixins: [validationMixin],
})
export default class Registration extends AuthMixin {
  @Validate({ required })
  nameFirst: string = '';

  @Validate({ required, email })
  email: string = '';

  @Validate({ required, minLength: minLength(8) })
  password: string = '';

  @Validate({ required, sameAs: sameAs('password') })
  passwordConfirmation: string = '';

  error: string = '';
  message: string = '';

  async submit() {
    this.resetMessages();

    this.$v.$touch();
    if (this.$v.$invalid) return;

    try {
      await this.register({
        name_first: this.nameFirst,
        email: this.email,
        password: this.password,
        password_confirmation: this.passwordConfirmation,
      });

      await this.loginEmployee(this.email, this.password);
    } catch (error) {
      this.reportError(error, 'Unknown error with registration form');
    }
  }

  get nameFirstError(): String | undefined {
    if (!this.$v.nameFirst.$dirty) return;
    if (!this.$v.nameFirst.required) return 'Must provide your first name';
  }

  get emailError(): String | undefined {
    if (!this.$v.email.$dirty) return;
    if (!this.$v.email.email) return 'Must provide a valid e-mail address';
    if (!this.$v.email.required) return 'Must provide en e-mail address';
  }

  get passwordError(): String | undefined {
    if (!this.$v.password.$dirty) return;

    if (!this.$v.password.required) return 'Must provide a password.';
    if (!this.$v.password.minLength) return 'Password length must be 8 character or more.';
  }

  get passwordConfirmationError(): String | undefined {
    if (!this.$v.passwordConfirmation.$dirty) return;

    if (!this.$v.passwordConfirmation.required) return 'Must repeat provided password above.';
    if (!this.$v.passwordConfirmation.sameAs)
      return 'Password confirmation and password do not match.';
  }

  delayTouch(v: any) {
    v.$reset();
    if (touchMap.has(v)) {
      clearTimeout(touchMap.get(v));
    }
    touchMap.set(v, setTimeout(v.$touch, 1000));
  }

  resetMessages() {
    this.error = '';
    this.message = '';
  }

  reportError(error: any, defaultMessage: string) {
    if (error.response.data.message) {
      this.error = error.response.data.message;
    } else {
      this.error = defaultMessage;
    }
  }
}
</script>
