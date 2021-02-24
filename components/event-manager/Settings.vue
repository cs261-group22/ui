<template>
  <div class="flex-grow min-h-screen">
    <header class="bg-white shadow">
      <div class="md:h-24 flex items-center lg:h-20 max-w-7xl py-6 px-4 sm:px-6 lg:px-8 w-full">
        <h1 class="text-2xl font-bold">Manage Event Settings</h1>
      </div>
    </header>

    <div class="py-6 px-4 sm:px-6 lg:px-8 max-w-6xl">
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-black">Name</label>
        <input
          v-model="event.name"
          type="text"
          name="name"
          class="mt-1 text-black w-full block shadow-sm sm:text-sm border-gray-300 rounded-md"
          required
          @keyup="updateEventDebounced()"
        />
      </div>

      <div class="mb-4">
        <label for="description" class="block text-sm font-medium text-black">Description</label>
        <textarea
          v-model="event.description"
          name="description"
          class="mt-1 text-black w-full block shadow-sm sm:text-sm border-gray-300 rounded-md"
          required
          @keyup="updateEventDebounced()"
        />
      </div>

      <div class="mb-4">
        <label for="starts_at" class="block text-sm font-medium text-black">Starts At</label>
        <datetime
          v-model="event.starts_at"
          type="datetime"
          name="starts_at"
          input-class="mt-1 w-full text-black block shadow-sm sm:text-sm border-gray-300 rounded-md"
          @keyup="updateEventDebounced()"
        />
      </div>

      <div class="mb-4">
        <label for="ends_at" class="block text-sm font-medium text-black">Ends At</label>
        <datetime
          v-model="event.ends_at"
          type="datetime"
          name="ends_at"
          input-class="mt-1 w-full text-black block shadow-sm sm:text-sm border-gray-300 rounded-md"
          @keyup="updateEventDebounced()"
        />
      </div>

      <div class="mb-4">
        <label for="max_sessions" class="block text-sm font-medium text-black">Max Sessions</label>
        <input
          v-model.number="event.max_sessions"
          type="number"
          name="max_sessions"
          class="mt-1 w-full text-black block shadow-sm sm:text-sm border-gray-300 rounded-md"
          @keyup="updateEventDebounced()"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Allow guests?</label>
        <input
          v-model="event.allow_guests"
          type="checkbox"
          class="form-checkbox h-5 w-5 text-primary"
          @change="updateEventDebounced()"
        /><span class="ml-2 text-sm font-medium">Yes</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop } from 'nuxt-property-decorator';
import { Component, Vue } from 'vue-property-decorator';
import { Datetime } from 'vue-datetime';
import _ from 'lodash';

import { Event } from '~/types/models/event';

@Component({ components: { Datetime } })
export default class EventSettings extends Vue {
  @Prop({ type: Object, required: true })
  value!: Event;

  updateEventDebounced = _.debounce(this.updateEvent, 500);

  updateEvent() {
    this.$axios.put(`${process.env.NUXT_ENV_API_ROUTE}/events/${this.event?.id}`, this.event);
  }

  get event() {
    return this.value;
  }

  set event(event: Event) {
    this.$emit('input', event);
  }
}
</script>
