<template>
  <div class="flex-grow">
    <header class="bg-white shadow">
      <div class="lg:h-20 py-6 px-4 sm:px-6 lg:px-8 w-full flex items-center">
        <router-link to="?tab=question_submissions">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-6 mr-4 cursor-pointer"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </router-link>

        <p class="text-xl font-bold font-serif">
          {{ `${question.prompt}` }}
        </p>
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
              class="px-4 sm:px-6 lg:px-8 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
            >
              Response
            </th>

            <th
              v-if="question.type === 'free_text'"
              class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
            >
              Implicit Mood
            </th>

            <th
              v-if="question.type === 'free_text'"
              class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
            >
              Urgency
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="response in orderedResponses"
            :key="response.id"
            class="hover:bg-grey-200 cursor-pointer border-b-2 border-grey-300"
          >
            <th
              class="px-4 sm:px-6 lg:px-8 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left"
            >
              {{ getUserName(response) }}
            </th>

            <th
              class="px-4 sm:px-6 lg:px-8 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left font-normal"
            >
              {{ response.value || response.answer.value }}
            </th>

            <td
              v-if="question.type === 'free_text'"
              class="px-6 align-middle text-xs whitespace-no-wrap p-4 font-serif"
              :class="getMetricColour(getScaledMood(response))"
            >
              {{ `${getScaledMood(response) || 0}%` }}
            </td>

            <td
              v-if="question.type === 'free_text'"
              class="px-6 align-middle text-xs whitespace-no-wrap p-4 font-serif"
              :class="getMetricColour(getScaledUrgency(response))"
            >
              {{ `${getScaledUrgency(response) || 0}%` }}
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

import moment from 'moment';

import { UserMixin } from '~/mixins/user';

import ProgressButton from '~/components/common/ProgressButton.vue';

import { Event } from '~/types/models/event';
import { Question, QuestionType } from '~/types/models/question';
import { Response } from '~/types/models/response';

@Component({ components: { ProgressButton } })
export default class QuestionView extends UserMixin {
  QuestionType = QuestionType;

  @Prop({ type: Object, required: true })
  event!: Event;

  @Prop({ type: Object, required: true })
  question!: Question;

  moment = moment;

  get orderedResponses() {
    const responses: Response[] = [];

    for (const submission of this.event.sessions) {
      for (const response of submission.responses || []) {
        if (response.question_id === this.question.id) {
          responses.push(response);
        }
      }
    }

    return responses;
  }

  getUserName(response: Response) {
    const session = this.event.sessions.find((session) => session.id === response.session_id);

    return session?.user?.name || 'Guest';
  }

  getScaledMood(response: Response) {
    const score = response.sentiment?.sentiment.score || 0;

    return Math.round((score > 0 ? 0.5 + score / 2 : (1 - Math.abs(score)) / 2) * 100);
  }

  getScaledUrgency(response: Response) {
    const score = response.sentiment?.urgency || 0;

    return Math.round(score * 100);
  }

  getMetricColour(metric: number | undefined) {
    if (!metric) {
      return 'text-black';
    }

    if (metric <= 30) {
      return 'text-red-600';
    }

    if (metric <= 70) {
      return 'text-amber-400';
    }

    return 'text-green-600';
  }
}
</script>
