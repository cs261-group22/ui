<template>
  <div class="container pt-24 md:pt-48 px-6 mx-auto flex flex-wrap flex-col items-center">
    <template v-if="tokenProvided">
      <div>
        <h2 class="mt-6 text-center text-4xl md:text-5xl font-extrabold text-primary">
          Complete Registration
        </h2>

        <p class="mt-2 text-center text-sm text-secondary">
          To complete the setup of your account, please provide some additional details.
        </p>
      </div>

      <div class="mt-8 space-y-6 w-full md:w-96">
        <input type="hidden" name="remember" value="true" />

        <div class="rounded-md shadow-sm">
          <div class="mb-6">
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input
              v-model="form.name"
              type="text"
              name="name"
              autocomplete="given-name"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>

          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              v-model="form.password"
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
              v-model="form.passwordConfirmation"
              name="password_confirmation"
              type="password"
              autocomplete="current-password"
              required
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            @click="submit"
          >
            Register
          </button>
        </div>

        <p v-if="errorMessage" class="text-red-400 w-full text-center">{{ errorMessage }}</p>
      </div>
    </template>

    <template v-else>
      <h2 class="mt-6 text-center text-4xl md:text-5xl font-extrabold text-primary">
        Invalid Token.
      </h2>

      <p class="mt-2 text-center text-sm text-secondary">
        Sorry, that verification token was not valid. If this issue persists, please ask your
        referrer to invite you again.
      </p>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator';
import AuthMixin from '~/mixins/auth';
import { UserMixin } from '~/mixins/user';

@Component
export default class EmailVerification extends mixins(AuthMixin, UserMixin) {
  tokenId = '';
  tokenEmail = '';
  tokenTimestamp = '';
  tokenProvided = true;

  form: any = {
    name: '',
    password: '',
    passwordConfirmation: '',
  };

  errorMessage = '';

  created() {
    const rawToken = this.$route.query.token;

    if (!rawToken) {
      this.tokenProvided = false;
      return;
    }

    const decodedToken = atob(rawToken as string).split('/');

    if (decodedToken.length !== 3) {
      this.tokenProvided = false;
      return;
    }

    this.tokenId = decodedToken[0];
    this.tokenEmail = decodedToken[1];
    this.tokenTimestamp = decodedToken[2];
  }

  async submit() {
    try {
      await this.$axios.post(process.env.NUXT_ENV_API_ROUTE + '/email/verify', {
        id: this.tokenId,
        name: this.form.name,
        email: this.tokenEmail,
        password: this.form.password,
        timestamp: this.tokenTimestamp,
        password_confirmation: this.form.passwordConfirmation,
      });

      if (this.$auth.loggedIn) {
        this.$auth.logout();
      }

      this.$router.push('/sign-in?target=dashboard&verified=1');
    } catch (error) {
      const errorMessages: any = {
        401: 'Sorry, that verification link has expired. Please ask your referrer to invite you again.',
        403: 'Sorry, your account has already been verified.',
        422: 'Sorry, their was an issue with the account details you provided. Please ensure the passwords match.',
      };

      this.errorMessage =
        error.response.status in errorMessages
          ? errorMessages[error.response.status]
          : 'Sorry, an unkown error occured during verification. Please try agian later';
    }
  }
}
</script>
