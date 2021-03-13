<template>
  <div class="flex-grow">
    <header class="bg-white shadow">
      <div class="lg:h-20 py-6 px-4 sm:px-6 lg:px-8 w-full">
        <div class="flex justify-between lg:items-center flex-col lg:flex-row">
          <p class="text-lg xl:text-xl font-bold mb-4 lg:mb-0 font-serif">
            Submissions (By Question)
          </p>

          <div class="flex flex-col sm:flex-row">
            <input
              v-model="search"
              required
              name="search"
              placeholder="Search by question prompt"
              class="block shadow-sm sm:text-sm border border-gray-300 rounded-md px-2 py-2 sm:py-0 mr-3 xl:mr-6 w-full sm:w-52 mb-2 sm:mb-0"
            />

            <select v-model="sortingOption" class="rounded-md shadow-sm sm:text-sm border-gray-300">
              <option :value="SortingOption.ORDER">Order by configuration</option>
              <option :value="SortingOption.PROMPT">Order by prompt</option>
              <option :value="SortingOption.TYPE">Order by type</option>
              <option :value="SortingOption.MOOD">Order by mood</option>
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
              Prompt
            </th>

            <th
              class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
            >
              Type
            </th>

            <th
              class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
            >
              Average Implicit Mood
            </th>

            <th
              class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
            >
              Average Urgency
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="question in orderedQuestions"
            :key="question.id"
            class="hover:bg-grey-200 cursor-pointer border-b-2 border-grey-300"
            @click="viewQuestion(question)"
          >
            <td
              class="px-4 sm:px-6 lg:px-8 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left font-bold"
            >
              {{ question.prompt }}
            </td>

            <td class="px-6 align-middle text-xs whitespace-no-wrap p-4">
              {{ question.type === QuestionType.FREE_TEXT ? 'Free Text' : 'Multiple Choice' }}
            </td>

            <td
              class="px-6 align-middle text-xs whitespace-no-wrap p-4 font-serif"
              :class="getMetricColour(calculateQuestionMood(question))"
            >
              {{ `${calculateQuestionMood(question) || 0}%` }}
            </td>

            <td
              class="px-6 align-middle text-xs whitespace-no-wrap p-4 font-serif"
              :class="getMetricColour(calculateQuestionUrgency(question))"
            >
              {{ `${calculateQuestionUrgency(question) || 0}%` }}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex w-full justify-center">
        <p class="italic text-sm">Click a question to view the recorded responses.</p>
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
import { Question, QuestionType } from '~/types/models/question';
import { Response } from '~/types/models/response';

enum SortingOption {
  MOOD = 'mood',
  TYPE = 'type',
  ORDER = 'order',
  PROMPT = 'prompt',
  URGENCY = 'urgency',
}

@Component({ components: { ProgressButton } })
export default class QuestionList extends ResultsMixin {
  @Prop({ type: Object, required: true })
  event!: Event;

  search = '';
  moment = moment;
  SortingOption = SortingOption;
  sortingOption: SortingOption = SortingOption.ORDER;

  QuestionType = QuestionType;

  get orderedQuestions() {
    let questions = this.event.questions;

    if (this.search) {
      questions = questions.filter((question) =>
        question?.prompt?.toLowerCase().startsWith(this.search.toLowerCase()),
      );
    }

    switch (this.sortingOption) {
      case SortingOption.ORDER:
        return questions.sort((a, b) => (a.order as number) - (b.order as number));

      case SortingOption.PROMPT:
        return questions.sort((a, b) =>
          a.prompt === b.prompt ? 0 : (a.prompt as string) < (b.prompt as string) ? -1 : 1,
        );

      case SortingOption.TYPE:
        return questions.sort((a, b) => (a.type === b.type ? 0 : a.type < b.type ? -1 : 1));

      case SortingOption.URGENCY: {
        const responsesForQuestion: Map<number, Response[]> = new Map();

        for (const session of this.event.sessions) {
          for (const response of session.responses || []) {
            if (!response.value) {
              continue;
            }

            responsesForQuestion.set(response.question_id, [
              ...(responsesForQuestion.get(response.question_id) || []),
              response,
            ]);
          }
        }

        const urgencyForQuestion: Map<number, number> = new Map();

        for (const [question, responses] of responsesForQuestion.entries()) {
          let total = 0;
          let count = 0;

          for (const response of responses) {
            total += response.sentiment?.urgency || 0;
            count += 1;
          }

          urgencyForQuestion.set(question, Math.round((total / count) * 100));
        }

        return questions.sort(
          (a, b) =>
            (urgencyForQuestion.get(b.id as number) || 0) -
            (urgencyForQuestion.get(a.id as number) || 0),
        );
      }

      case SortingOption.MOOD: {
        const responsesForQuestion = this.questionResponseMap;
        const moodForQuestion: Map<number, number> = new Map();

        for (const [question, responses] of responsesForQuestion.entries()) {
          let total = 0;
          let count = 0;

          for (const response of responses) {
            const score = response.sentiment?.sentiment.score || 0;
            total += score > 0 ? 0.5 + score / 2 : (1 - Math.abs(score)) / 2;
            count += 1;
          }

          moodForQuestion.set(question, Math.round((total / count) * 100));
        }

        return questions.sort(
          (a, b) =>
            (moodForQuestion.get(b.id as number) || 0) - (moodForQuestion.get(a.id as number) || 0),
        );
      }
    }
  }

  calculateQuestionUrgency(question: Question) {
    let total = 0;
    let count = 0;

    for (const submission of this.event.sessions) {
      for (const response of submission.responses || []) {
        if (response.question_id !== question.id) {
          continue;
        }

        if (!response.sentiment?.sentiment.score) {
          continue;
        }

        total += response.sentiment.urgency;
        count += 1;
      }
    }

    return Math.round((total / count) * 100);
  }

  calculateQuestionMood(question: Question) {
    let total = 0;
    let count = 0;

    for (const submission of this.event.sessions) {
      for (const response of submission.responses || []) {
        if (response.question_id !== question.id) {
          continue;
        }

        if (!response.sentiment?.sentiment.score) {
          continue;
        }

        const score = response.sentiment.sentiment.score;

        total += score > 0 ? 0.5 + score / 2 : (1 - Math.abs(score)) / 2;
        count += 1;
      }
    }

    return Math.round((total / count) * 100);
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

  viewQuestion(question: Question) {
    this.$router.push({ query: { ...this.$route.query, question: question?.id?.toString() } });
  }

  get questionResponseMap() {
    const responsesForQuestion: Map<number, Response[]> = new Map();

    for (const session of this.event.sessions) {
      for (const response of session.responses || []) {
        if (!response.value) {
          continue;
        }

        responsesForQuestion.set(response.question_id, [
          ...(responsesForQuestion.get(response.question_id) || []),
          response,
        ]);
      }
    }

    return responsesForQuestion;
  }
}
</script>
