<template>
  <div v-if="event" class="container p-8">
    <p class="text-2xl mb-4">Event Page</p>

    <p>Event: {{ event.name }}</p>
    <p>Event Description: {{ event.description }}</p>

    <p class="mt-4">Logged in as: {{ isGuest ? 'guest' : 'employee' }}.</p>
    <p>User id: {{ userId }}.</p>

    <button class="mt-4 text-indigo-800 cursor-pointer underline" @click="logoutUser">
      Log out
    </button>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator';
import { UserMixin } from '~/mixins/user';

import AuthMixin from '~/mixins/auth';

@Component({
  layout: 'default',
  middleware: ['auth'],
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
