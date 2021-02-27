<template>
  <div class="flex-grow">
    <header class="bg-white shadow">
      <div class="h-24 lg:h-20 py-6 px-4 sm:px-6 lg:px-8 w-full">
        <div class="flex align-items justify-between">
          <p class="text-2xl font-bold">Manage Event Hosts</p>

          <div class="flex">
            <input
              v-model="email"
              required
              type="text"
              name="email"
              placeholder="Email address"
              class="block shadow-sm sm:text-sm border-gray-300 rounded-md mr-6 w-96"
            />

            <progress-button @click="addHost"> Add Host </progress-button>
          </div>
        </div>
      </div>
    </header>

    <div class="m-6 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-primarydark">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Name
            </th>

            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Email
            </th>

            <th
              scope="col"
              class="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="host in event.hosts" :key="host.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              {{ host.name }}
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-sm">
              {{ host.email }}
            </td>

            <td class="px-3 py-4 whitespace-nowrap text-sm font-medium">
              <span
                v-if="host.id !== userId"
                class="text-indigo-600 hover:text-indigo-900 mr-4 cursor-pointer"
                @click="removeHost(host)"
              >
                Remove Host
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop } from 'nuxt-property-decorator';
import { Component } from 'vue-property-decorator';

import ProgressButton from '~/components/common/ProgressButton.vue';

import { Event } from '~/types/models/event';
import { User } from '~/types/models/user';
import { UserMixin } from '~/mixins/user';

@Component({ components: { ProgressButton } })
export default class EventHosts extends UserMixin {
  @Prop({ type: Object, required: true })
  value!: Event;

  email = '';
  addingUser = false;

  get event() {
    return this.value;
  }

  set event(event: Event) {
    this.$emit('input', event);
  }

  async addHost() {
    const hosts = [...(this.event?.hosts?.map((host) => host.email) || []), this.email];

    try {
      const response = await this.$axios.patch(
        `${process.env.NUXT_ENV_API_ROUTE}/events/${this.event.id}/hosts`,
        { hosts },
      );

      this.event.hosts = response.data.data;
    } catch {
      // todo: show error message
    }
  }

  async removeHost(user: User) {
    const hosts =
      this.event?.hosts?.filter((host) => host.id !== user.id).map((host) => host.email) || [];

    try {
      const response = await this.$axios.patch(
        `${process.env.NUXT_ENV_API_ROUTE}/events/${this.event.id}/hosts`,
        { hosts },
      );

      this.event.hosts = response.data.data;
    } catch {
      // todo: show error message
    }
  }
}
</script>
