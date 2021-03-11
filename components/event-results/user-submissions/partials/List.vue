<template>
  <div class="flex-grow">
    <header class="bg-white shadow">
      <div class="lg:h-20 py-6 px-4 sm:px-6 lg:px-8 w-full">
        <div class="flex justify-between lg:items-center flex-col lg:flex-row">
          <p class="text-lg xl:text-xl font-bold mb-4 lg:mb-0 font-serif">Submissions (By User)</p>

          <div class="flex flex-col sm:flex-row">
            <input
              v-model="search"
              required
              name="search"
              placeholder="Search by user name"
              class="block shadow-sm sm:text-sm border border-gray-300 rounded-md px-2 py-2 sm:py-0 mr-6 w-full sm:w-48 mb-2 sm:mb-0"
            />

            <select v-model="sortingOption" class="rounded-md shadow-sm sm:text-sm border-gray-300">
              <option :value="SortingOption.SUBMISSION_DATE" selected>
                Order by submission date
              </option>
              <option :value="SortingOption.USER_NAME">Order by user name</option>
              <option :value="SortingOption.EXPLICIT_MOOD">Order by explicit mood</option>
              <option :value="SortingOption.IMPLICIT_MOOD">Order by implicit mood</option>
              <option :value="SortingOption.URGENCY">Order by urgency</option>
            </select>
          </div>
        </div>
      </div>
    </header>

    <div class="break-words overflow-x-auto">
      <table class="w-full h-full table-auto bg-transparent border-collapse mb-8">
        <thead>
          <tr>
            <th
              class="px-4 sm:px-6 lg:px-8 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
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
            v-for="session in orderedSubmissions"
            :key="session.id"
            class="hover:bg-grey-200 cursor-pointer border-b-2 border-grey-300"
            @click="viewSubmission(session)"
          >
            <th
              class="px-4 sm:px-6 lg:px-8 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left"
            >
              {{ session.user.name || 'Guest' }}
            </th>

            <td class="px-6 align-middle text-xs whitespace-no-wrap p-4">
              {{ moment(session.started_at).format('MMMM Do YYYY [at] h:mma') }}
            </td>

            <td
              class="px-6 align-middle text-xs whitespace-no-wrap p-4 font-serif"
              :class="getMetricColour(session.mood)"
            >
              {{ session.mood }}%
            </td>

            <td
              class="px-6 align-middle text-xs whitespace-no-wrap p-4 font-serif"
              :class="getMetricColour(calculateSubmissionImplicitMood(session))"
            >
              {{
                calculateSubmissionImplicitMood(session)
                  ? `${calculateSubmissionImplicitMood(session)}%`
                  : 'N/A'
              }}
            </td>

            <td
              class="px-6 align-middle text-xs whitespace-no-wrap p-4 font-serif"
              :class="getMetricColour(calculateSubmissionUrgency(session))"
            >
              {{
                calculateSubmissionUrgency(session)
                  ? `${calculateSubmissionUrgency(session)}%`
                  : 'N/A'
              }}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex w-full justify-center">
        <p class="italic text-sm">Click a submission to view the recorded responses.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop } from 'nuxt-property-decorator';
import { Component } from 'vue-property-decorator';

import moment from 'moment';

import { ResultsMixin } from '~/mixins/results';

import ProgressButton from '~/components/common/ProgressButton.vue';

import { Event } from '~/types/models/event';
import { Session } from '~/types/models/session';

enum SortingOption {
  USER_NAME = 'name',
  URGENCY = 'urgency',
  EXPLICIT_MOOD = 'mood-explicit',
  IMPLICIT_MOOD = 'mood-implicit',
  SUBMISSION_DATE = 'submission-date',
}

@Component({ components: { ProgressButton } })
export default class SubmissionList extends ResultsMixin {
  @Prop({ type: Object, required: true })
  event!: Event;

  search = '';
  moment = moment;
  SortingOption = SortingOption;
  sortingOption: SortingOption = SortingOption.SUBMISSION_DATE;

  get orderedSubmissions() {
    let sessions = [...this.event.sessions];

    if (this.search) {
      sessions = sessions.filter((session) =>
        (session?.user?.name?.toLowerCase() || 'guest').startsWith(this.search.toLowerCase()),
      );
    }

    switch (this.sortingOption) {
      case SortingOption.SUBMISSION_DATE:
        return sessions.sort((a, b) => {
          if (a.started_at === b.started_at) {
            return 0;
          }

          return (a.started_at as Date) < (b.started_at as Date) ? 1 : -1;
        });

      case SortingOption.USER_NAME:
        return sessions.sort((a, b) => {
          const nameA = a.user?.name || 'Guest';
          const nameB = b.user?.name || 'Guest';

          return nameA === nameB ? 0 : nameA < nameB ? -1 : 1;
        });

      case SortingOption.URGENCY:
        return sessions.sort(
          (a, b) =>
            (this.calculateSubmissionUrgency(b) || 0) - (this.calculateSubmissionUrgency(a) || 0),
        );

      case SortingOption.IMPLICIT_MOOD:
        return sessions.sort(
          (a, b) =>
            this.calculateSubmissionImplicitMood(b) - this.calculateSubmissionImplicitMood(a),
        );

      case SortingOption.EXPLICIT_MOOD:
        return sessions.sort((a, b) => (b.mood || 0) - (a.mood || 0));
    }
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

  viewSubmission(session: Session) {
    this.$router.push({ query: { ...this.$route.query, submission: session.id.toString() } });
  }
}
</script>
