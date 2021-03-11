<template>
  <div class="flex flex-col lg:flex-row w-full">
    <div class="sidebar bg-primarydark">
      <div class="sidebar-header h-24 lg:h-20 px-6 lg:px-8 hidden lg:flex">
        <p class="font-bold text-white">{{ truncatedEventName }}</p>

        <p class="text-xs text-grey-500 inline-flex items-center">
          <span
            class="animate-pulse h-1.5 w-1.5 inline-flex rounded-full bg-green-400 mr-2 opacity-75"
          />
          Receiving Live Feedback
        </p>
      </div>

      <div class="sidebar-content lg:px-6 lg:py-4 lg:px-8">
        <ul class="flex flex-wrap lg:flex-nowrap justify-evenly lg:block sidebar-nav list-reset">
          <li :class="{ active: resultTab === ResultTab.SUMMARY }" class="mx-2 lg:mx-0">
            <router-link :to="`?tab=${ResultTab.SUMMARY}`">Summary </router-link>
          </li>

          <li :class="{ active: resultTab === ResultTab.USER_SUBMISSIONS }" class="mx-2 lg:mx-0">
            <router-link :to="`?tab=${ResultTab.USER_SUBMISSIONS}`">
              Submissions (by user)
            </router-link>
          </li>

          <li
            :class="{ active: resultTab === ResultTab.QUESTION_SUBMISSIONS }"
            class="mx-2 lg:mx-0"
          >
            <router-link :to="`?tab=${ResultTab.QUESTION_SUBMISSIONS}`">
              Submissions (by question)
            </router-link>
          </li>

          <li :class="{ active: resultTab === ResultTab.ANALYTICS }" class="mx-2 lg:mx-0">
            <router-link :to="`?tab=${ResultTab.ANALYTICS}`"> Feedback Analysis </router-link>
          </li>

          <li :class="{ active: resultTab === ResultTab.EXPORT }" class="mx-2 lg:mx-0">
            <router-link :to="`?tab=${ResultTab.EXPORT}`"> Feedback Export </router-link>
          </li>
        </ul>
      </div>
    </div>

    <loader :loading="loading" class="page-content">
      <template v-if="!loading">
        <export v-if="resultTab === ResultTab.EXPORT" :event="event" />
        <sentiment v-if="resultTab === ResultTab.ANALYTICS" :event="event" />
        <summary-component v-if="resultTab === ResultTab.SUMMARY" :event="event" />
        <user-submissions v-if="resultTab === ResultTab.USER_SUBMISSIONS" :event="event" />
        <question-submissions v-if="resultTab === ResultTab.QUESTION_SUBMISSIONS" :event="event" />
      </template>
    </loader>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator';

import _ from 'lodash';

import { Event } from '~/types/models/event';

import Export from '~/components/event-results/export/Export.vue';
import Summary from '~/components/event-results/summary/Summary.vue';
import Sentiment from '~/components/event-results/sentiment/Sentiment.vue';
import UserSubmissions from '~/components/event-results/user-submissions/UserSubmissions.vue';
import QuestionSubmissions from '~/components/event-results/question-submissions/QuestionSubmissions.vue';
import { errorsStore } from '~/store';

enum ResultTab {
  EXPORT = 'export',
  SUMMARY = 'summary',
  ANALYTICS = 'analytics',
  USER_SUBMISSIONS = 'user_submissions',
  QUESTION_SUBMISSIONS = 'question_submissions',
}

@Component({
  layout: 'dashboard',
  middleware: ['auth'],
  components: {
    Export,
    Sentiment,
    UserSubmissions,
    QuestionSubmissions,
    SummaryComponent: Summary,
  },
})
export default class EventResults extends Vue {
  ResultTab = ResultTab;

  loading = true;
  event: Event | null = null;
  resultTab: ResultTab | null = null;

  async created() {
    try {
      const eventResponse = await this.$axios.get(
        `${process.env.NUXT_ENV_API_ROUTE}/events/${this.$route.params.id}`,
      );

      this.event = eventResponse.data.data;

      // If the event is a draft, results cannot be viewed
      // eslint-disable-next-line camelcase
      if (this.event?.is_draft) {
        return this.$router.push('/dashboard/events');
      }

      const sessionsResponse = await this.$axios.get(
        `${process.env.NUXT_ENV_API_ROUTE}/events/${this.$route.params.id}/sessions`,
      );

      if (this.event) {
        this.event.sessions = sessionsResponse.data.data;
      }

      // Join the event feedback channel
      (this as any).$echo.private(`event-submissions.${this.event?.id}`).listen(
        'SessionAnalysisReceived',
        (event: any) =>
          (this.event = {
            ...this.event,
            sessions: [...(this.event?.sessions || []), event.session],
          } as Event),
      );

      this.loading = false;
    } catch {
      errorsStore.flashError(
        'Sorry, an unknown error occurred while fetching the event responses.',
      );
    }
  }

  @Watch('$route', { immediate: true })
  handleRouteChanged(route: any) {
    this.resultTab = route.query.tab || ResultTab.SUMMARY;
  }

  get truncatedEventName() {
    return _.truncate(this.event?.name || '', { length: 30 });
  }
}
</script>
