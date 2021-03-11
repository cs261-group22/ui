<template>
  <div class="flex-grow">
    <header class="bg-white shadow">
      <div class="lg:h-20 py-6 px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center">
        <div class="flex justify-between lg:items-center flex-col lg:flex-row w-full">
          <div class="flex items-center">
            <router-link to="?tab=user_submissions">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="w-6 mr-5 cursor-pointer"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </router-link>

            <div>
              <p class="text-xl font-bold font-serif">
                {{ `Submission from ${submission.user.name || 'Guest'}` }}
              </p>

              <p class="block lg:hidden italic text-sm">
                Submitted on {{ moment(submission.started_at).format('MMMM Do YYYY [at] h:mma') }}
              </p>
            </div>
          </div>

          <p class="hidden lg:block italic text-sm">
            Submitted on {{ moment(submission.started_at).format('MMMM Do YYYY [at] h:mma') }}
          </p>
        </div>
      </div>
    </header>

    <div class="max-w-6xl p-8">
      <div
        v-for="question in event.questions"
        :key="question.id"
        class="mb-6 p-6 w-full bg-grey-200 rounded-md shadow-md text-black flex items-center justify-between"
      >
        <div class="w-full mr-12">
          <div class="w-full">
            <p class="text-xl font-bold mb-1 font-serif">
              {{ question.prompt }}
            </p>
          </div>

          <template v-if="question.type === QuestionType.FREE_TEXT">
            <p class="italic mb-4">"{{ getFreeTextResponse(question) }}"</p>

            <p class="px-2 h-8 gradient-button is-dark text-sm">
              <svg
                v-if="analysisVisible.has(question.id)"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="w-4 mr-2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 11l7-7 7 7M5 19l7-7 7 7"
                />
              </svg>

              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="w-4 mr-2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
                />
              </svg>

              <span @click="toggleAnalysis(question)">
                {{ analysisVisible.has(question.id) ? 'Hide' : 'View' }} Analysis
              </span>
            </p>
            <div
              v-show="analysisVisible.has(question.id)"
              class="border border-grey-400 rounded-md w-full text-sm p-6 mt-4"
            >
              <p class="italic mb-4">
                The system identified the following characteristics from the user's response, which
                will be used to build the feedback report.
              </p>

              <p>
                <span class="font-bold">Identified persons:</span>
                {{ getResponseEntities(question) || 'None detected' }}
              </p>

              <p>
                <span class="font-bold">Identified subjects:</span>
                {{ getResponseSubjects(question) || 'None detected' }}
              </p>

              <p>
                <span class="font-bold">Identified word pairs:</span>
                {{ getResponseWordPairs(question) || 'None detected' }}
              </p>

              <p class="mb-4">
                <span class="font-bold">Identified frequent words:</span>
                {{ getResponseImportantWords(question) || 'None detected' }}
              </p>

              <p class="font-bold mb-2">Mood / urgency analysis:</p>
              <canvas :id="`scale-${question.id}`" class="mb-4" />

              <p class="font-bold mb-2">Similar word groupings:</p>
              <div :id="`pca-${question.id}`" />
            </div>
          </template>

          <template v-else>
            <ul class="list-disc ml-6">
              <div v-for="answer in getSelectedAnswers(question)" :key="answer.id">
                <li class="italic">
                  {{ answer.value }}
                </li>
              </div>
            </ul>

            <p v-if="!getSelectedAnswers(question).length" class="italic">No answers selected.</p>
          </template>
        </div>

        <span title="Free text" class="p-2 bg-primary rounded-full text-white">
          <img
            v-if="question.type === QuestionType.FREE_TEXT"
            class="w-4"
            src="~/assets/icons/free-text-md.svg"
          />
          <img v-else class="w-4" src="~/assets/icons/multiple-choice-md.svg" />
        </span>
      </div>

      <div id="agg-pca" />

      <div class="w-full p-6 w-full bg-grey-200 rounded-md shadow-md text-black">
        <p class="text-xl font-bold font-serif mb-4">Explicit Mood</p>

        <div class="px-4">
          <div class="flex mb-2 text-5xl justify-between">
            <p class="cursor-pointer" @click="session.mood = 0">😠</p>
            <p class="cursor-pointer" @click="session.mood = 25">🙁</p>
            <p class="cursor-pointer" @click="session.mood = 50">😐</p>
            <p class="cursor-pointer" @click="session.mood = 75">🙂</p>
            <p class="cursor-pointer" @click="session.mood = 100">😀</p>
          </div>
          <input
            :value="submission.mood"
            class="w-full mb-2"
            type="range"
            min="0"
            max="100"
            disabled
          />
          <div class="flex justify-between">
            <p>Very Dissatisfied</p>
            <p class="-ml-5">Neutral</p>
            <p class="text-right lg:text-left">Very Satisfied</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop } from 'nuxt-property-decorator';
import { Component } from 'vue-property-decorator';

import moment from 'moment';
import Chart from 'chart.js';
import embed from 'vega-embed';

import { UserMixin } from '~/mixins/user';

import ProgressButton from '~/components/common/ProgressButton.vue';

import { Event } from '~/types/models/event';
import { Session } from '~/types/models/session';
import { Question, QuestionType } from '~/types/models/question';

@Component({ components: { ProgressButton } })
export default class SubmissionView extends UserMixin {
  QuestionType = QuestionType;

  @Prop({ type: Object, required: true })
  event!: Event;

  @Prop({ type: Object, required: true })
  submission!: Session;

  moment = moment;
  analysisVisible: Set<number> = new Set();

  mounted() {
    this.$nextTick(function () {
      const responseGraphConfig = {
        type: 'bar',
        options: {
          indexAxis: 'y',

          legend: {
            display: false,
          },

          scales: {
            yAxes: [
              {
                display: true,
                labelString: 'Score / 100',
                ticks: {
                  beginAtZero: true,
                  suggestedMin: 0,
                  suggestedMax: 100,
                },
              },
            ],
          },
          responsive: true,
        },
      };

      // Initialize graphs for each response
      for (const response of this.submission.responses || []) {
        if (!response.sentiment) {
          continue;
        }

        // Embed PCA graph
        const pcaGraph = JSON.parse(response.sentiment.pca_graph);
        embed(`#pca-${response.question_id}`, pcaGraph);

        const score = response.sentiment.sentiment.score;
        const ctx = (document?.getElementById(`scale-${response.question_id}`) as any)?.getContext(
          '2d',
        );

        const config = {
          ...responseGraphConfig,

          data: {
            labels: ['Mood', 'Urgency'],
            datasets: [
              {
                backgroundColor: '#e76f51',
                borderColor: '#e76f51',
                borderWidth: 1,
                data: [
                  Math.round((score > 0 ? 0.5 + score / 2 : (1 - Math.abs(score)) / 2) * 100),
                  Math.round(response.sentiment.urgency * 100),
                ],
              },
            ],
          },
        } as any;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _ = new Chart(ctx, config);
      }
    });
  }

  toggleAnalysis(question: Question) {
    if (!question?.id) {
      return;
    }

    const updatedAnalysisVisisble = new Set(this.analysisVisible);

    if (updatedAnalysisVisisble.has(question.id)) {
      updatedAnalysisVisisble.delete(question.id);
    } else {
      updatedAnalysisVisisble.add(question.id);
    }

    this.analysisVisible = updatedAnalysisVisisble;
  }

  getFreeTextResponse(question: Question) {
    const matchingResponses = this.getResponses(question);

    if (!matchingResponses) {
      return 'Currently unavailable.';
    }

    return matchingResponses[0].value || 'Currently unavailable.';
  }

  getSelectedAnswers(question: Question) {
    return question.answers?.filter((answer) =>
      this.submission?.responses?.some((response) => response.answer_id === answer.id),
    );
  }

  getResponseImportantWords(question: Question) {
    const matchingResponses = this.getResponses(question);

    if (!matchingResponses) {
      return 'Currently unavailable';
    }

    // eslint-disable-next-line camelcase
    return Object.keys(matchingResponses[0].sentiment?.frequent_words || {}).join(', ');
  }

  getResponseWordPairs(question: Question) {
    const matchingResponses = this.getResponses(question);

    if (!matchingResponses) {
      return 'Currently unavailable';
    }

    // eslint-disable-next-line camelcase
    return Object.keys(matchingResponses[0].sentiment?.word_pairs || {}).join(', ');
  }

  getResponseSubjects(question: Question) {
    const matchingResponses = this.getResponses(question);

    if (!matchingResponses) {
      return 'Currently unavailable';
    }

    // eslint-disable-next-line camelcase
    return Object.keys(matchingResponses[0].sentiment?.subjects || {}).join(', ');
  }

  getResponseEntities(question: Question) {
    const matchingResponses = this.getResponses(question);

    if (!matchingResponses) {
      return 'Currently unavailable';
    }

    return matchingResponses[0].sentiment?.entities.join(', ');
  }

  getResponses(question: Question) {
    return this.submission?.responses?.filter((response) => response.question_id === question.id);
  }

  getMetricColour(rawMetric: string) {
    if (!rawMetric.endsWith('%')) {
      return 'bg-grey-400';
    }

    const metric = parseInt(rawMetric.slice(0, -1));

    if (metric <= 30) {
      return 'bg-red-600';
    }

    if (metric <= 70) {
      return 'bg-amber-400';
    }

    return 'bg-green-600';
  }
}
</script>
