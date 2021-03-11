<template>
  <div class="text-center">
    <div
      class="inline-flex mx-auto flex-col items-center bg-white rounded-lg py-8 px-6 sm:py-10 sm:px-8 lg:py-16 lg:px-20"
    >
      <loader :loading="!fetchedEvent">
        <template v-if="event && !event.is_draft">
          <h1
            class="mb-1 text-left text-3xl md:text-4xl text-primary font-bold leading-tight fade-in font-serif font-serif"
          >
            Joining {{ event.name }}
          </h1>

          <p class="leading-normal text-left text-secondary md:text-xl mb-8 fade-in font-semibold">
            {{ event.description }}
          </p>

          <div class="mb-6 max-w-2xl text-left">
            <p v-if="event.allow_guests">
              <span class="block mb-2">
                This event allows for you to join as an employee or a guest.
              </span>

              If you wish for your responses to be anonymous, or if you don't have an employee
              account, please join the event as a guest.
            </p>

            <p v-else>
              This event only allows employees to join. All responses will be associated with your
              account.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row justify-start fade-in">
            <nuxt-link
              :to="{ name: 'sign-in', query: { target: code } }"
              class="mb-4 sm:mb-0 sm:mr-4 gradient-button is-dark"
            >
              Join as employee
            </nuxt-link>

            <vue-recaptcha size="invisible" :sitekey="recaptchaKey" @verify="joinAsGuest">
              <button v-if="event.allow_guests" class="gradient-button w-full sm:w-auto">
                Join as guest
              </button>
            </vue-recaptcha>
          </div>
        </template>

        <template v-else>
          <h1 class="my-4 text-4xl md:text-5xl text-primary font-bold leading-tight fade-in">
            Sorry!
          </h1>

          <p class="leading-normal text-secondary md:text-2xl mb-8 fade-in">
            You can't join that event at the moment. Please try again later.
          </p>
        </template>
      </loader>
    </div>
  </div>
</template>

<script lang="ts">
import { mixins } from 'nuxt-property-decorator';
import { Component } from 'vue-property-decorator';

import VueRecaptcha from 'vue-recaptcha';
import Loader from '~/components/common/Loader.vue';

import AuthMixin from '~/mixins/auth';
import { UserMixin } from '~/mixins/user';
import { Event } from '~/types/models/event';
import { errorsStore } from '~/utils/store-accessor';

@Component({
  layout: 'landing',
  components: { Loader, VueRecaptcha },
})
export default class Join extends mixins(AuthMixin, UserMixin) {
  event: Event | null = null;
  fetchedEvent = false;

  async created() {
    try {
      const response = await this.$axios.get(
        `${process.env.NUXT_ENV_API_ROUTE}/events/code/${this.code}`,
      );

      this.event = response.data.data;

      // eslint-disable-next-line camelcase
      if (this.isLoggedIn && (this.event?.allow_guests || !this.isGuest)) {
        this.$router.push(`/event/${this.code}`);
      }
    } catch {
      // Let the request fail silently
    } finally {
      this.fetchedEvent = true;
    }
  }

  async joinAsGuest(token: string) {
    try {
      await this.loginGuest(token);
      this.$router.push(`/event/${this.code}`);
    } catch (error) {
      errorsStore.flashError(
        'Sorry, an unknown error occurred while joining the event, please try again later.',
      );
    }
  }

  get code() {
    return this.$route.params.code;
  }

  get recaptchaKey() {
    return process.env.NUXT_ENV_RECAPTCHA_SITE_KEY;
  }
}
</script>
