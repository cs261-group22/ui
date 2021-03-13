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
      <div
        class="max-w-7xl mx-auto py-6 md:py-4 px-6 lg:px-8 flex w-full justify-between md:items-center flex-col md:flex-row"
      >
        <h1 class="text-xl font-bold leading-tight text-primary font-serif mb-2 md:mb-0">
          Manage Your Events
        </h1>

        <div>
          <button class="gradient-button is-compact" @click="creatingEvent = true">
            Create new event
          </button>
        </div>
      </div>
    </header>

    <main>
      <div class="max-w-7xl mx-auto py-6 lg:px-8">
        <div class="flex flex-col">
          <div class="-my-2 overflow-x-auto lg:-mx-8">
            <div class="py-2 px-6 align-middle inline-block min-w-full lg:px-8">
              <loader :loading="loadingEvents">
                <div class="overflow-hidden lg:border-b lg:border-gray-200 lg:shadow lg:rounded-lg">
                  <table class="min-w-full lg:divide-y lg:divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                        >
                          Name
                        </th>

                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                        >
                          Code
                        </th>

                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                        >
                          Starts at
                        </th>

                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                        >
                          Ends at
                        </th>

                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                        >
                          Status
                        </th>

                        <th
                          scope="col"
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr
                        v-for="event in events"
                        :key="event.id"
                        class="flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-6 lg:mb-0 border rounded-md bg-grey-200 lg:bg-white"
                      >
                        <td
                          class="px-6 py-2 lg:py-4 whitespace-nowrap text-right sm:text-center lg:text-left block w-full lg:w-auto lg:table-cell relative lg:static"
                        >
                          <span
                            class="lg:hidden absolute top-0 left-0 bg-primary text-center text-white w-22 px-2 py-3 text-xs font-bold uppercase rounded-tl-md"
                          >
                            Name
                          </span>

                          <span class="text-sm font-medium text-gray-900">{{ event.name }}</span>
                        </td>

                        <td
                          class="px-6 py-2 lg:py-4 whitespace-nowrap text-right sm:text-center lg:text-left block w-full lg:w-auto lg:table-cell relative lg:static"
                        >
                          <span
                            class="lg:hidden absolute top-0 left-0 bg-primary text-center text-white w-22 px-2 py-3 text-xs font-bold uppercase"
                          >
                            Code
                          </span>

                          <span class="text-sm font-medium text-gray-900">{{ event.code }}</span>
                        </td>

                        <td
                          class="px-6 py-2 lg:py-4 whitespace-nowrap text-right sm:text-center lg:text-left block w-full lg:w-auto lg:table-cell relative lg:static"
                        >
                          <span
                            class="lg:hidden absolute top-0 left-0 bg-primary text-center text-white w-22 px-2 py-3 text-xs font-bold uppercase"
                          >
                            Starts at
                          </span>
                          <span class="text-sm font-medium text-gray-900">
                            {{ formatDate(event.starts_at) }}</span
                          >
                        </td>

                        <td
                          class="px-6 py-2 lg:py-4 whitespace-nowrap text-right sm:text-center lg:text-left block w-full lg:w-auto lg:table-cell relative lg:static"
                        >
                          <span
                            class="lg:hidden absolute top-0 left-0 bg-primary text-center text-white w-22 px-2 py-3 text-xs font-bold uppercase"
                          >
                            Ends at
                          </span>
                          <span class="text-sm font-medium text-gray-900">
                            {{ formatDate(event.ends_at) }}</span
                          >
                        </td>

                        <td
                          class="px-6 py-2 lg:py-4 whitespace-nowrap text-right sm:text-center lg:text-left block w-full lg:w-auto lg:table-cell relative lg:static"
                        >
                          <span
                            class="lg:hidden absolute top-0 left-0 bg-primary text-center text-white w-22 px-2 py-3 text-xs font-bold uppercase"
                          >
                            Status
                          </span>
                          <span
                            v-if="event.is_draft"
                            class="px-4 lg:px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                          >
                            Draft
                          </span>

                          <span
                            v-else
                            class="px-4 lg:px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                          >
                            Live
                          </span>
                        </td>

                        <td
                          class="px-6 py-2 lg:py-4 whitespace-nowrap text-right sm:text-center lg:text-left block w-full lg:w-auto lg:table-cell relative lg:static"
                        >
                          <span
                            class="lg:hidden absolute top-0 left-0 bg-primary text-center text-white w-22 px-2 py-3 text-xs font-bold uppercase rounded-bl-md"
                          >
                            Actions
                          </span>
                          <router-link
                            v-if="event.is_draft"
                            :to="{ name: 'dashboard-events-id-modify', params: { id: event.id } }"
                            class="text-indigo-600 hover:text-indigo-900 text-sm lg:text-md mr-1 lg:mr-2"
                          >
                            Configure Event
                          </router-link>

                          <router-link
                            v-else
                            :to="{
                              name: 'dashboard-events-id-results',
                              params: { id: event.id },
                            }"
                            class="text-indigo-600 hover:text-indigo-900 text-sm lg:text-md mr-1 lg:mr-2"
                          >
                            View Responses
                          </router-link>

                          <span class="text-sm lg:text-md">|</span>

                          <button
                            class="text-indigo-600 hover:text-indigo-900 text-sm lg:text-md ml-1 lg:ml-2"
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
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Event } from '~/types/models/event';

import FormModal from '~/components/common/FormModal.vue';
import ConfirmationModal from '~/components/common/ConfirmationModal.vue';
import { errorsStore } from '~/utils/store-accessor';

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
    try {
      this.loadingEvents = true;

      const response = await this.$axios.get(`${process.env.NUXT_ENV_API_ROUTE}/events`);

      this.events = response.data.data;
      this.loadingEvents = false;
    } catch {
      errorsStore.flashError('Sorry, an unknown error occurred while performing that action.');
    }
  }

  async deleteEvent() {
    try {
      await this.$axios.delete(`${process.env.NUXT_ENV_API_ROUTE}/events/${this.eventToDelete}`);

      this.events = this.events.filter((event) => event.id !== this.eventToDelete);
      this.eventToDelete = null;
    } catch {
      errorsStore.flashError('Sorry, an unknown error occurred while deleting that event.');
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
      errorsStore.flashError('Sorry, an unknown error occurred while creating the event.');
    }
  }

  confirmDeletion(eventId: number) {
    this.eventToDelete = eventId;
  }

  cancelDeleteEvent() {
    this.eventToDelete = null;
  }

  formatDate(date: string) {
    if (!date) {
      return 'Not set'
    }

    const dateObject = new Date(date);

    return dateObject.toLocaleString();
  }
}
</script>
