<template>
  <div>
    <div class="relative bg-gradient pt-8 pb-32 md:pt-16">
      <div class="px-4 md:px-10">
        <div class="flex flex-wrap">
          <div class="w-full lg:w-1/2 xl:w-1/4 px-4">
            <div
              class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg"
            >
              <div class="flex-auto p-4">
                <div class="w-full pr-4 max-w-full flex-grow flex-1">
                  <h5 class="text-gray-500 uppercase font-bold text-xs">
                    Currently Completing Form
                  </h5>
                  <span class="font-semibold text-2xl font-serif">
                    {{ activeAttendeeCount === null ? '&nbsp;' : activeAttendeeCount }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="w-full lg:w-1/2 xl:w-1/4 px-4">
            <div
              class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg"
            >
              <div class="flex-auto p-4">
                <div class="w-full pr-4 max-w-full flex-grow flex-1">
                  <h5 class="text-gray-500 uppercase font-bold text-xs">
                    Total Submissions Received
                  </h5>
                  <span class="font-semibold text-2xl font-serif">
                    {{ submissionsProcessed(event).length }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="w-full lg:w-1/2 xl:w-1/4 px-4">
            <div
              class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg"
            >
              <div class="flex items-center flex-auto p-4">
                <div class="w-full pr-4 max-w-full flex-grow flex-1">
                  <h5 class="text-gray-500 uppercase font-bold text-xs">Average Explicit Mood</h5>
                  <span
                    :key="(event.submissions || []).length"
                    class="font-semibold text-2xl font-serif"
                    :class="getMetricColour(averageExplicitMood)"
                  >
                    {{ averageExplicitMood ? `${averageExplicitMood}%` : 'N/A' }}
                  </span>
                </div>

                <p class="text-3xl">
                  {{ getMetricSmiley(averageExplicitMood) }}
                </p>
              </div>
            </div>
          </div>

          <div class="w-full lg:w-1/2 xl:w-1/4 px-4">
            <div
              class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg"
            >
              <div class="flex items-center flex-auto p-4">
                <div class="w-full pr-4 max-w-full flex-grow flex-1">
                  <h5 class="text-gray-500 uppercase font-bold text-xs">Average Implicit Mood</h5>
                  <span
                    :key="(event.submissions || []).length"
                    class="font-semibold text-2xl font-serif"
                    :class="getMetricColour(averageImplicitMood)"
                  >
                    {{ averageImplicitMood ? `${averageImplicitMood}%` : 'N/A' }}
                  </span>
                </div>

                <p class="text-3xl font-serif">
                  {{ getMetricSmiley(averageImplicitMood) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="px-4 md:px-10 mx-auto w-full -m-24 bg-grey-200 h-screen">
      <mood-graph :submissions="submissionsProcessed(event)" />

      <div class="flex flex-wrap mt-4">
        <div class="w-full mb-12 xl:mb-0 px-4">
          <div
            class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
          >
            <div class="rounded-t mb-0 px-2 py-3 border-0">
              <div class="flex flex-wrap items-center">
                <div class="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 class="font-bold text-base">Recent Submisions</h3>
                </div>
                <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                  <router-link to="?tab=user_submissions">
                    <button
                      class="bg-quinary text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      style="transition: all 0.15s ease"
                    >
                      See all
                    </button>
                  </router-link>
                </div>
              </div>
            </div>
            <div class="block w-full overflow-x-auto">
              <table class="items-center w-full bg-transparent border-collapse mb-4">
                <thead>
                  <tr>
                    <th
                      class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
                    >
                      User
                    </th>

                    <th
                      class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
                    >
                      Submitted at
                    </th>
                    <th
                      class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
                    >
                      Explicit Mood
                    </th>
                    <th
                      class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
                    >
                      Implicit Mood
                    </th>
                    <th
                      class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
                    >
                      Urgency
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="submission in recentSubmissions"
                    :key="submission.id"
                    class="cursor-pointer hover:bg-grey-200"
                    @click="viewSubmission(submission)"
                  >
                    <th
                      class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left"
                    >
                      {{ submission.user.name || 'Guest' }}
                    </th>
                    <td
                      class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4"
                    >
                      {{ moment(submission.started_at).format('MMMM Do YYYY [at] h:mma') }}
                    </td>
                    <td
                      :class="getMetricColour(submission.mood)"
                      class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 font-serif"
                    >
                      {{ submission.mood }}%
                    </td>
                    <td
                      :class="getMetricColour(calculateSubmissionImplicitMood(submission))"
                      class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 font-serif"
                    >
                      {{ `${calculateSubmissionImplicitMood(submission) || 0}%` }}
                    </td>
                    <td
                      :class="getMetricColour(calculateSubmissionUrgency(submission))"
                      class="px-6 align-middle text-xs whitespace-no-wrap p-4 font-serif"
                    >
                      {{ `${calculateSubmissionUrgency(submission) || 0}%` }}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="flex w-full justify-center mb-4">
                <p class="italic text-sm">Click a submission to view the recorded responses.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full px-4">
          <div
            class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
          >
            <div class="rounded-t mb-0 px-4 py-3 border-0">
              <div class="flex flex-wrap items-center">
                <div class="relative w-full px-2 max-w-full flex-grow flex-1">
                  <h3 class="font-semibold text-base text-gray-800">Popular Keywords</h3>
                </div>
                <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                  <router-link to="?tab=analytics">
                    <button
                      class="bg-quinary text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      style="transition: all 0.15s ease"
                    >
                      View Analysis
                    </button>
                  </router-link>
                </div>
              </div>
            </div>
            <div class="block w-full overflow-x-auto">
              <table class="items-center w-full bg-transparent border-collapse">
                <thead class="thead-light">
                  <tr>
                    <th
                      class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
                    >
                      Word
                    </th>
                    <th
                      class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
                    >
                      Occurences
                    </th>
                    <th
                      class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
                      style="min-width: 140px"
                    >
                      Frequency
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="keyword in popularKeywords(submissionsProcessed(event))"
                    :key="keyword.word"
                  >
                    <th
                      class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left capitalize"
                    >
                      {{ keyword.word }}
                    </th>
                    <td
                      class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4"
                    >
                      {{ keyword.occurrences }}
                    </td>
                    <td
                      class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4"
                    >
                      <div class="flex items-center">
                        <span class="mr-2">{{ keyword.frequency }}%</span>
                        <div class="relative w-full">
                          <div class="overflow-hidden h-2 text-xs flex rounded bg-red-200">
                            <div
                              :style="`width: ${keyword.frequency}%`"
                              class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mixins, Prop } from 'nuxt-property-decorator';
import { Component } from 'vue-property-decorator';

import moment from 'moment';

import ProgressButton from '~/components/common/ProgressButton.vue';
import MoodGraph from '~/components/event-results/summary/partials/MoodGraph.vue';

import { UserMixin } from '~/mixins/user';
import { ResultsMixin } from '~/mixins/results';

import { Event } from '~/types/models/event';
import { Session } from '~/types/models/session';

@Component({ components: { ProgressButton, MoodGraph } })
export default class Summary extends mixins(UserMixin, ResultsMixin) {
  @Prop({ type: Object, required: true })
  event!: Event;

  moment = moment;
  eventPresenceCount: number | null = null;
  feedbackPresenceCount: number | null = null;

  created() {
    // Join the event presence channels
    (this as any).$echo
      .join(`attendee-presence.${this.event?.id}`)
      .here((users: any) => (this.eventPresenceCount = users.length))
      .joining(() => (this.eventPresenceCount = (this.eventPresenceCount || 0) + 1))
      .leaving(() => (this.eventPresenceCount = (this.eventPresenceCount || 0) - 1));

    (this as any).$echo
      .join(`event-feedback-presence.${this.event?.id}`)
      .here((users: any) => (this.feedbackPresenceCount = users.length))
      .joining(() => (this.feedbackPresenceCount = (this.feedbackPresenceCount || 0) + 1))
      .leaving(() => (this.feedbackPresenceCount = (this.feedbackPresenceCount || 0) - 1));
  }

  beforeDestroy() {
    (this as any).$echo.leave(`attendee-presence.${this.event?.id}`);
    (this as any).$echo.leave(`event-feedback-presence.${this.event?.id}`);
  }

  get activeAttendeeCount() {
    if (this.eventPresenceCount === null || this.feedbackPresenceCount === null) {
      return null;
    }

    return this.eventPresenceCount - this.feedbackPresenceCount;
  }

  get recentSubmissions() {
    return this.submissionsProcessed(this.event)
      .sort((a, b) => {
        if (a.started_at === b.started_at) {
          return 0;
        }

        return (a.started_at as Date) < (b.started_at as Date) ? 1 : -1;
      })
      .slice(0, 5);
  }

  get averageExplicitMood() {
    let total = 0;
    let count = 0;

    for (const session of this.event.sessions) {
      total += session.mood || 0;
      count++;
    }

    return Math.round(total / count);
  }

  get averageImplicitMood() {
    let total = 0;
    let count = 0;

    for (const session of this.submissionsProcessed(this.event)) {
      total += this.calculateSubmissionImplicitMood(session);
      count++;
    }

    return Math.round(total / count);
  }

  getMetricColour(metric: number) {
    if (!metric) {
      return 'text-black';
    }

    if (metric < 40) {
      return 'text-red-600';
    }

    if (metric < 70) {
      return 'text-yellow-500';
    }

    return 'text-green-600';
  }

  getMetricSmiley(metric: number) {
    if (!metric) {
      return '';
    }

    if (metric <= 25) {
      return '😠';
    }

    if (metric <= 50) {
      return '😐';
    }

    if (metric <= 70) {
      return '🙂';
    }

    return '😀';
  }

  viewSubmission(session: Session) {
    this.$router.push({
      query: { ...this.$route.query, tab: 'user_submissions', submission: session.id.toString() },
    });
  }
}
</script>

<style scoped>
.bg-gradient {
  background-image: linear-gradient(to right, #f4a261 0%, #e76f51 51%, #f4a261 100%);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
