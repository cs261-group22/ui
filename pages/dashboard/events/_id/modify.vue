<template>
  <div class="flex flex-col lg:flex-row w-full">
    <div class="sidebar bg-primarydark">
      <div class="sidebar-header h-24 lg:h-20 px-6 lg:px-8 hidden lg:flex">
        <p class="font-medium text-white">{{ truncatedEventName }}</p>

        <p class="text-xs text-grey-500">Draft Event</p>
      </div>

      <div class="sidebar-content px-6 lg:px-6 lg:py-4 lg:px-8">
        <ul class="flex justify-between sm:justify-evenly lg:block sidebar-nav list-reset">
          <li :class="{ active: eventTab === EventTab.SETTINGS }">
            <router-link :to="`?tab=${EventTab.SETTINGS}`"> Settings </router-link>
          </li>

          <li :class="{ active: eventTab === EventTab.HOSTS }">
            <router-link :to="`?tab=${EventTab.HOSTS}`"> Hosts </router-link>
          </li>

          <li :class="{ active: eventTab === EventTab.QUESTIONS }">
            <router-link :to="`?tab=${EventTab.QUESTIONS}`"> Questions </router-link>
          </li>

          <li :class="{ active: eventTab === EventTab.PUBLISH }">
            <router-link :to="`?tab=${EventTab.PUBLISH}`"> Publish </router-link>
          </li>
        </ul>
      </div>
    </div>

    <loader :loading="event === null" class="page-content">
      <hosts v-if="eventTab === EventTab.HOSTS" :key="EventTab.HOSTS" v-model="event" />
      <publish v-if="eventTab === EventTab.PUBLISH" :key="EventTab.PUBLISH" :event="event" />
      <settings v-if="eventTab === EventTab.SETTINGS" :key="EventTab.SETTINGS" v-model="event" />
      <questions v-if="eventTab === EventTab.QUESTIONS" :key="EventTab.QUESTIONS" v-model="event" />
    </loader>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator';

import _ from 'lodash';

import { Event } from '~/types/models/event';

import Hosts from '~/components/event-manager/Hosts.vue';
import Publish from '~/components/event-manager/Publish.vue';
import Settings from '~/components/event-manager/Settings.vue';
import Questions from '~/components/event-manager/Questions.vue';
import ProgressButton from '~/components/common/ProgressButton.vue';
import { errorsStore } from '~/utils/store-accessor';

enum EventTab {
  HOSTS = 'hosts',
  PUBLISH = 'publish',
  SETTINGS = 'settings',
  QUESTIONS = 'questions',
}

@Component({
  layout: 'dashboard',
  middleware: ['auth'],
  components: { ProgressButton, Hosts, Publish, Settings, Questions },
})
export default class ModifyEvent extends Vue {
  EventTab = EventTab;

  event: Event | null = null;
  eventTab: EventTab | null = null;

  async created() {
    try {
      const response = await this.$axios.get(
        `${process.env.NUXT_ENV_API_ROUTE}/events/${this.$route.params.id}`,
      );

      this.event = response.data.data;

      // If the event is not a draft, the questions cannot be modified
      // eslint-disable-next-line camelcase
      if (!this.event?.is_draft) {
        return this.$router.push('/dashboard/events');
      }
    } catch {
      errorsStore.flashError('Sorry, an unknown error occurred while fetching the event.');
    }
  }

  @Watch('$route', { immediate: true })
  handleRouteChanged(route: any) {
    this.eventTab = route.query.tab || EventTab.SETTINGS;
  }

  get truncatedEventName() {
    return _.truncate(this.event?.name || '', { length: 30 });
  }
}
</script>
