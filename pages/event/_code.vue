<template>
  <div v-if="event">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between w-full">
        <h1 class="text-3xl font-bold leading-tight text-primary">{{ event.name }}</h1>
      </div>
    </header>

    <div class="fade-in max-w-7xl mt-20 mx-auto py-6 px-4 sm:px-6 lg:px-8 flex-col justify-between w-full shadow-lg">
      <p class="text-2xl font-bold">{{ event.name }}</p>
    
      <p class="mt-3">Event Description: {{ event.description }}</p>

      <p class="mt-4">Logged in as: {{ isGuest ? 'guest' : 'employee' }}.</p>
      <p>User id: {{ userId }}.</p>

      <button class="mt-4 text-indigo-800 cursor-pointer underline" @click="logoutUser">
        Log out
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator';
import { UserMixin } from '~/mixins/user';

import AuthMixin from '~/mixins/auth';

@Component({
  layout: 'eventBanner',
  //middleware: ['auth'],
})
export default class Browse extends mixins(UserMixin, AuthMixin) {
  event: Event | null = null;

  async created() {
    try {
      const response = await this.$axios.get(
        `${process.env.NUXT_ENV_API_ROUTE}/events/code/${this.$route.params.code}`,
      );

      this.event = response.data.data;
    } catch {
      // todo: show error message
    }
  }

  logoutUser() {
    this.logout();
  }
}
</script>
