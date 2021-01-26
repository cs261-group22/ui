<template>
  <div
    class="container pt-24 md:pt-48 px-6 mx-auto flex flex-wrap flex-col md:flex-row items-center"
  >
    <loader :loading="!event">
      <div
        v-if="event"
        class="flex flex-col w-full mb-16 justify-center lg:items-start overflow-y-hidden"
      >
        <h1 class="my-4 text-4xl md:text-5xl text-primary font-bold leading-tight fade-in">
          Joining {{ event.name }}
        </h1>

        <p class="leading-normal text-secondary md:text-2xl mb-8 fade-in">
          {{ event.description }}
        </p>

        <div class="flex justify-start fade-in">
          <nuxt-link
            :to="{ name: 'sign-in', query: { target: code } }"
            class="mr-4 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-quinary"
          >
            Join as employee
          </nuxt-link>

          <button
            class="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-quaternary"
            @click="joinAsGuest()"
          >
            Join as guest
          </button>
        </div>
      </div>
    </loader>

    <div class="w-full xl:w-3/5 py-6 overflow-y-hidden">
      <img class="w-5/6 mx-auto lg:mr-0" src="/devices.svg" />
    </div>

    <div class="w-full pt-16 pb-6 text-sm text-center md:text-left fade-in">
      <a class="text-gray-500 no-underline hover:no-underline" href="#">&copy; CS261 Group 22 </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';

import Loader from '~/components/common/Loader.vue';
import AuthMixin from '~/mixins/auth';

@Component({
  layout: 'landing',
  components: { Loader },
})
export default class Join extends AuthMixin {
  event: Event | null = null;

  async created() {
    try {
      const response = await this.$axios.get(
        `${process.env.NUXT_ENV_API_ROUTE}/events/code/${this.code}`,
      );

      this.event = response.data.data;
    } catch {
      // todo: show error message
    }
  }

  async joinAsGuest() {
    await this.loginGuest();

    this.$router.push(`/event/${this.code}`);
  }

  get code() {
    return this.$route.params.code;
  }
}
</script>
