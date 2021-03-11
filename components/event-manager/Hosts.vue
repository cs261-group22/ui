<template>
  <div class="flex-grow">
    <header class="bg-white shadow">
      <div
        class="lg:h-20 py-6 px-6 lg:px-8 w-full flex justify-between lg:items-center flex-col lg:flex-row"
      >
        <p class="text-xl font-bold mb-4 lg:mb-0 font-serif">Manage Event Hosts</p>

        <div class="flex">
          <input
            v-model="email"
            required
            type="text"
            name="email"
            placeholder="Email address"
            class="block shadow-sm sm:text-sm border-gray-300 rounded-md mr-6 w-96"
          />

          <progress-button :compact="true" @click="addHost"> Add Host </progress-button>
        </div>
      </div>
    </header>

    <div class="px-6 lg:px-0 mt-6 lg:mt-0">
      <table class="w-full table-auto bg-transparent border-collapse">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-8 py-3 text-left text-xs font-semibold bg-gray-100 text-gray-600 uppercase tracking-wider hidden border border-solid border-l-0 border-r-0 border-gray-200 lg:table-cell"
            >
              Name
            </th>

            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-semibold bg-gray-100 text-gray-600 uppercase tracking-wider hidden border border-solid border-l-0 border-r-0 border-gray-200 lg:table-cell"
            >
              Email
            </th>

            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-semibold bg-gray-100 text-gray-600 uppercase tracking-wider hidden border border-solid border-l-0 border-r-0 border-gray-200 lg:table-cell"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="host in event.hosts"
            :key="host.id"
            class="flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-6 lg:mb-0 border rounded-md bg-grey-200 lg:bg-white"
          >
            <td
              class="px-8 py-2 text-sm font-semibold lg:py-4 whitespace-nowrap text-right sm:text-center lg:text-left block w-full lg:w-auto lg:table-cell relative lg:static"
            >
              <span
                class="lg:hidden absolute top-0 left-0 bg-primary text-center text-white w-24 px-2 py-3 text-xs font-bold uppercase rounded-tl-md"
              >
                Name
              </span>

              {{ host.name }}
            </td>

            <td
              class="px-6 py-2 text-sm lg:py-4 whitespace-nowrap text-right sm:text-center lg:text-left block w-full lg:w-auto lg:table-cell relative lg:static"
            >
              <span
                class="lg:hidden absolute top-0 left-0 bg-primary text-center text-white w-24 px-2 py-3 text-xs font-bold uppercase"
              >
                Email
              </span>

              {{ host.email }}
            </td>

            <td
              class="px-6 py-2 text-sm lg:py-4 whitespace-nowrap text-right sm:text-center lg:text-left block w-full lg:w-auto lg:table-cell relative lg:static"
            >
              <span
                class="lg:hidden absolute top-0 left-0 bg-primary text-center text-white w-24 px-2 py-3 text-xs font-bold uppercase rounded-bl-md"
              >
                Actions
              </span>

              <span
                v-if="host.id !== userId"
                class="text-indigo-600 hover:text-indigo-900 mr-4 texm-sm cursor-pointer"
                @click="removeHost(host)"
              >
                Remove Host
              </span>

              <span v-else class="text-sm"> N/A </span>
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
import { errorsStore } from '~/store';

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
      errorsStore.flashError('Sorry, that email address does not exist in the system.');
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
      errorsStore.flashError('Sorry, an unknown error occurred while performing that action.');
    }
  }
}
</script>
