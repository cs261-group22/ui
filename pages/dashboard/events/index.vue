<template>
  <div>
    <form-modal
      v-if="creatingEvent"
      title="Create new event"
      action="Create"
      @cancelled="creatingEvent = false"
      @confirmed="createEvent"
    >
      <p class="mb-4">Enter a name and optional description below to create the event.</p>

      <input
        v-model="eventName"
        type="text"
        name="name"
        placeholder="Event name"
        class="block shadow-sm sm:text-sm border-gray-300 rounded-md w-full mb-2"
      />

      <textarea
        v-model="eventDescription"
        name="description"
        rows="3"
        class="blockshadow-sm w-full sm:text-sm border-gray-300 rounded-md"
        placeholder="Event description"
      />
    </form-modal>

    <confirmation-modal
      v-if="eventToDelete"
      title="Are you sure?"
      description="Deleting this event will also remove all results associated with it."
      action="Delete"
      @confirmed="deleteEvent"
      @cancelled="cancelDeleteEvent"
    />

    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between w-full">
        <h1 class="text-3xl font-bold leading-tight text-primary">Manage Your Events</h1>

        <button
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-quinary"
          @click="creatingEvent = true"
        >
          Create new event
        </button>
      </div>
    </header>

    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="flex flex-col">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <loader :loading="loadingEvents">
                  <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Name
                          </th>

                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Code
                          </th>

                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Starts at
                          </th>

                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Ends at
                          </th>

                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>

                          <th
                            scope="col"
                            class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="event in events" :key="event.id">
                          <td class="px-6 py-4 whitespace-nowrap">
                            <span class="text-sm font-medium text-gray-900">{{ event.name }}</span>
                          </td>

                          <td class="px-6 py-4 whitespace-nowrap">
                            <span class="text-sm font-medium text-gray-900">{{ event.code }}</span>
                          </td>

                          <td class="px-6 py-4 whitespace-nowrap">
                            <span class="text-sm font-medium text-gray-900">
                              {{ formatDate(event.starts_at) }}</span
                            >
                          </td>

                          <td class="px-6 py-4 whitespace-nowrap">
                            <span class="text-sm font-medium text-gray-900">
                              {{ formatDate(event.ends_at) }}</span
                            >
                          </td>

                          <td class="px-6 py-4 whitespace-nowrap">
                            <span
                              v-if="event.is_draft"
                              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                            >
                              Draft
                            </span>

                            <span
                              v-else
                              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                            >
                              Live
                            </span>
                          </td>

                          <td class="px-3 py-4 whitespace-nowrap text-sm font-medium">
                            <router-link
                              v-if="event.is_draft"
                              :to="{ name: 'dashboard-events-id-modify', params: { id: event.id } }"
                              class="text-indigo-600 hover:text-indigo-900 mr-2"
                            >
                              Configure Event
                            </router-link>

                            <router-link
                              v-else
                              :to="{
                                name: 'dashboard-events-id-results',
                                params: { id: event.id },
                              }"
                              class="text-indigo-600 hover:text-indigo-900 mr-2"
                            >
                              View Responses
                            </router-link>

                            <span>|</span>

                            <button
                              class="text-indigo-600 hover:text-indigo-900 ml-2"
                              @click="confirmDeletion(event.id)"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </loader>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Event } from '~/types/models/event';

import FormModal from '~/components/common/FormModal.vue';
import ConfirmationModal from '~/components/common/ConfirmationModal.vue';

@Component({
  layout: 'dashboard',
  components: { FormModal, ConfirmationModal },
  middleware: ['auth'],
})
export default class Events extends Vue {
  events: Event[] = [];
  loadingEvents = true;
  creatingEvent = false;

  eventName = '';
  eventDescription = '';
  eventToDelete: number | null = null;

  async created() {
    // todo: store events in vuex so we don't have to request them again

    try {
      this.loadingEvents = true;

      const response = await this.$axios.get(`${process.env.NUXT_ENV_API_ROUTE}/events`);

      this.events = response.data.data;
      this.loadingEvents = false;
    } catch {
      // todo: show error message
    }
  }

  async deleteEvent() {
    try {
      await this.$axios.delete(`${process.env.NUXT_ENV_API_ROUTE}/events/${this.eventToDelete}`);

      this.events = this.events.filter((event) => event.id !== this.eventToDelete);
      this.eventToDelete = null;
    } catch {
      // todo: show error message
    }
  }

  async createEvent() {
    try {
      const response = await this.$axios.post(`${process.env.NUXT_ENV_API_ROUTE}/events`, {
        is_draft: true,
        allow_guests: true,
        name: this.eventName,
        description: this.eventDescription,
      });

      this.events.push(response.data.data as Event);

      this.creatingEvent = false;
      this.eventName = '';
      this.eventDescription = '';
    } catch {
      // todo: show error message
    }
  }

  confirmDeletion(eventId: number) {
    this.eventToDelete = eventId;
  }

  cancelDeleteEvent() {
    this.eventToDelete = null;
  }

  formatDate(date: string) {
    const dateObject = new Date(date);

    return dateObject.toLocaleString();
  }
}
</script>
