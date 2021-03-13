<template>
  <div class="flex-grow">
    <header class="bg-white shadow mb-8">
      <div class="flex items-center lg:h-20 py-6 px-4 sm:px-6 lg:px-8 w-full">
        <p class="text-xl font-bold mb-4 lg:mb-0 font-serif">Feedback Analysis</p>
      </div>
    </header>

    <div class="bg-grey-200 mx-6 lg:mx-8 mb-8 p-6 rounded-md shadow-md">
      <p class="font-bold">What are these charts?</p>

      <p>
        The charts on this page have been generated from the features that the system has identified
        across <span class="font-bold">all</span> the feedback provided for this event. Since this
        process is entirely automated, the system may make some occasional mistakes. As such, it is
        recommended to also check the individual feedback responses before making any conclusions.
      </p>
    </div>

    <div class="px-4 sm:px-6 lg:px-8 flex flex-wrap xl:flex-nowrap">
      <div class="mb-6 p-6 bg-grey-200 rounded-md shadow-md w-full xl:w-1/2 xl:mr-8">
        <p class="font-bold text-center mb-2">Mood Over Time</p>

        <p class="italic mb-4 text-sm text-center">
          The change in implict and explict mood of responses over the course of the event.
        </p>

        <div class="relative mx-auto h-96">
          <canvas id="mood-time"></canvas>
        </div>
      </div>

      <div class="mb-6 p-6 bg-grey-200 rounded-md shadow-md w-full xl:w-1/2">
        <p class="font-bold text-center mb-2">Urgency Over Time</p>

        <p class="italic mb-4 text-sm text-center">
          The change in urgency of responses over the course of the event.
        </p>

        <div class="relative mx-auto h-96">
          <canvas id="urgency-time"></canvas>
        </div>
      </div>
    </div>

    <div class="px-4 sm:px-6 lg:px-8 flex flex-wrap xl:flex-nowrap">
      <div class="mb-6 p-6 bg-grey-200 rounded-md shadow-md w-full xl:w-1/2 xl:mr-8">
        <p class="font-bold text-center mb-2">Average Mood by Person</p>

        <p class="italic mb-4 text-sm text-center">
          The average explicit and implicit moods for commonly mentioned persons.
        </p>

        <div class="relative mx-auto xl:h-96">
          <canvas id="mood-person"></canvas>
        </div>
      </div>

      <div class="mb-6 p-6 bg-grey-200 rounded-md shadow-md w-full xl:w-1/2">
        <p class="font-bold text-center mb-2">Average Mood by Subject</p>

        <p class="italic mb-4 text-sm text-center">
          The average explicit and implicit moods for commonly mentioned subjects.
        </p>

        <div class="relative mx-auto xl:h-96">
          <canvas id="mood-subject"></canvas>
        </div>
      </div>
    </div>

    <div class="px-4 sm:px-6 lg:px-8 flex flex-wrap xl:flex-nowrap">
      <div class="mb-6 p-6 bg-grey-200 rounded-md shadow-md w-full xl:w-1/2 xl:mr-8">
        <p class="font-bold text-center mb-2">Most Common Words of Interest</p>
        <p class="italic mb-4 text-center text-sm">
          The distribution of the most common words identified as
          <span class="italic">of interest</span> by the system.
        </p>

        <div class="relative mx-auto xl:h-96">
          <canvas id="popular-words"></canvas>
        </div>
      </div>

      <div class="mb-6 p-6 bg-grey-200 rounded-md shadow-md w-full xl:w-1/2">
        <p class="font-bold text-center mb-2">Most Mentioned Persons</p>

        <p class="italic mb-4 text-sm text-center">
          The distribution of persons that were mentioned most often in responses.
        </p>

        <div class="relative mx-auto xl:h-96">
          <canvas id="popular-persons"></canvas>
        </div>
      </div>
    </div>

    <div class="px-4 sm:px-6 lg:px-8 flex flex-wrap xl:flex-nowrap">
      <div class="mb-6 p-6 bg-grey-200 rounded-md shadow-md w-full xl:w-1/2 xl:mr-8">
        <p class="font-bold text-center mb-2">Popular Word Pairs</p>

        <p class="italic mb-4 text-sm text-center">
          The most frequently detected pairs of important words by the sytem.
        </p>

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
            <tr v-for="keyword in popularWordPairs(submissions)" :key="keyword.word">
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

      <div class="mb-6 p-6 bg-grey-200 rounded-md shadow-md w-full xl:w-1/2">
        <p class="font-bold text-center mb2">Similar Word Groupings</p>

        <p class="italic mb-4 text-sm text-center">
          A principle component analysis of words across all responses.
        </p>

        <div class="text-center">
          <div id="pca" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mixins, Prop } from 'nuxt-property-decorator';
import { Component, Watch } from 'vue-property-decorator';

import Chart from 'chart.js';
import embed from 'vega-embed';

import ProgressButton from '~/components/common/ProgressButton.vue';

import { Event } from '~/types/models/event';
import { UserMixin } from '~/mixins/user';
import { ResultsMixin } from '~/mixins/results';

@Component({ components: { ProgressButton } })
export default class Sentiment extends mixins(UserMixin, ResultsMixin) {
  @Prop({ type: Object, required: true })
  event!: Event;

  @Watch('submissions', { immediate: true })
  async onSubmissionsChanged() {
    this.$nextTick(function () {
      const charts = [
        ['mood-time', this.moodGraphConfig],
        ['mood-person', this.moodByPersonConfig],
        ['popular-words', this.commonWordsConfig],
        ['urgency-time', this.urgencyGraphConfig],
        ['mood-subject', this.moodBySubjectConfig],
        ['popular-persons', this.popularPersonsConfig],
      ];

      const renderedCharts: any = {};

      // Render each chart with chart.js
      for (const chart of charts) {
        const ctx = (document?.getElementById(chart[0] as string) as any)?.getContext('2d');
        renderedCharts[chart[0] as string] = new Chart(ctx as any, chart[1] as any);
      }
    });

    // Fetch the PCA graph
    const response = await this.$axios.get(
      `${process.env.NUXT_ENV_API_ROUTE}/events/${this.event.id}/analytics`,
    );

    // Render the graph
    const pcaGraph = JSON.parse(response.data.pca_graph);
    embed('#pca', pcaGraph);
  }

  get submissions() {
    return this.submissionsProcessed(this.event);
  }

  get commonWordsConfig() {
    const popularKeywords = this.popularKeywords(this.submissions);

    return {
      type: 'pie',
      data: {
        datasets: [
          {
            data: popularKeywords.map((keyword) => keyword.occurrences),
            backgroundColor: ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51']
              .sort(() => 0.5 - Math.random())
              .slice(0, popularKeywords.length),
            label: '',
          },
        ],
        labels: popularKeywords.map(
          (keyword) => keyword.word.charAt(0).toUpperCase() + keyword.word.slice(1),
        ),
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Chart.js Polar Area Chart',
          },
        },
        animation: {
          animateRotate: false,
          animateScale: true,
        },
      },
    };
  }

  get popularPersonsConfig() {
    const popularPersons = this.popularPersons(this.submissionsProcessed(this.event));

    return {
      type: 'pie',
      data: {
        datasets: [
          {
            data: popularPersons.map((person) => person.occurrences),
            backgroundColor: ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51']
              .sort(() => 0.5 - Math.random())
              .slice(0, popularPersons.length),
            label: 'DS1',
          },
        ],
        labels: popularPersons.map((person) => person.person),
      },
      options: {
        responsive: true,
        animation: {
          animateRotate: false,
          animateScale: true,
        },
      },
    };
  }

  get moodByPersonConfig() {
    const popularPersons = this.popularPersons(this.submissions);

    return {
      type: 'radar',
      data: {
        labels: popularPersons.map((person) => person.person),
        datasets: [
          {
            label: 'Explicit Mood',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            borderColor: 'red',
            pointBackgroundColor: 'red',
            data: popularPersons.map((person) => person.explicitSentiment),
          },
          {
            label: 'Implicit Mood',
            backgroundColor: 'rgba(0, 0, 255, 0.5)',
            borderColor: 'blue',
            pointBackgroundColor: 'blue',
            data: popularPersons.map((person) => person.implicitSentiment),
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Radar Chart',
          },
        },
        scales: {
          r: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: 100,
          },
          ticks: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
      },
    };
  }

  get moodBySubjectConfig() {
    const popularSubjects = this.popularSubjects(this.submissions);

    return {
      type: 'radar',
      data: {
        labels: popularSubjects.map((subject) => subject.subject),
        datasets: [
          {
            label: 'Explicit Mood',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            borderColor: 'red',
            pointBackgroundColor: 'red',
            data: popularSubjects.map((subject) => subject.explicitSentiment),
          },
          {
            label: 'Implicit Mood',
            backgroundColor: 'rgba(0, 0, 255, 0.5)',
            borderColor: 'blue',
            pointBackgroundColor: 'blue',
            data: popularSubjects.map((subject) => subject.implicitSentiment),
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Radar Chart',
          },
        },
        scales: {
          r: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: 100,
          },
          ticks: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
      },
    };
  }

  get moodGraphConfig() {
    return {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Explicit Mood',
            backgroundColor: '#4c51bf',
            borderColor: '#4c51bf',
            cubicInterpolationMode: 'monotone',

            data: this.scaleResponses(
              this.submissions.map((submission) => {
                return {
                  x: submission.updated_at,
                  y: submission.mood,
                };
              }),
            ),
            fill: false,
          },
          {
            label: 'Implicit Mood',
            fill: false,
            backgroundColor: '#ed64a6',
            borderColor: '#ed64a6',
            cubicInterpolationMode: 'monotone',
            data: this.scaleResponses(
              this.submissions.map((submission) => {
                return {
                  x: submission.updated_at,
                  y: this.calculateSubmissionImplicitMood(submission),
                };
              }),
            ),
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
        },
        legend: {
          labels: {
            fontColor: 'black',
          },
          align: 'end',
          position: 'bottom',
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true,
        },
        scales: {
          xAxes: [
            {
              type: 'time',
              ticks: {
                autoSkip: true,
                maxTicksLimit: 6,
                fontColor: 'black',
              },
              display: true,
              scaleLabel: {
                display: false,
                labelString: 'Month',
                fontColor: 'white',
              },
              gridLines: {
                display: false,
                borderDash: [2],
                borderDashOffset: [2],
                color: 'rgba(0, 0, 0, 0.3)',
                zeroLineColor: 'rgba(0, 0, 0, 0)',
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontColor: 'black',
                beginAtZero: true,
                suggestedMin: 0,
                suggestedMax: 100,
              },
              display: true,
              scaleLabel: {
                display: false,
                labelString: 'Mood (%)',
                fontColor: 'white',
              },
              gridLines: {
                borderDash: [3],
                borderDashOffset: [3],
                drawBorder: false,
                color: 'rgba(0, 0, 0, 0.15)',
                zeroLineColor: 'rgba(33, 37, 41, 0)',
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
        },
      },
    };
  }

  get urgencyGraphConfig() {
    return {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Urgency',
            fill: false,
            backgroundColor: '#ed64a6',
            borderColor: '#ed64a6',
            cubicInterpolationMode: 'monotone',
            data: this.scaleResponses(
              this.submissions
                .filter((submission) => this.calculateSubmissionUrgency(submission))
                .map((submission) => {
                  return {
                    x: submission.updated_at,
                    y: this.calculateSubmissionUrgency(submission),
                  };
                }),
            ),
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
        },
        legend: {
          labels: {
            fontColor: 'black',
          },
          align: 'end',
          position: 'bottom',
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true,
        },
        scales: {
          xAxes: [
            {
              type: 'time',
              ticks: {
                autoSkip: true,
                maxTicksLimit: 6,
                fontColor: 'black',
              },
              display: true,
              scaleLabel: {
                display: false,
                labelString: 'Month',
                fontColor: 'white',
              },
              gridLines: {
                display: false,
                borderDash: [2],
                borderDashOffset: [2],
                color: 'rgba(0, 0, 0, 0.3)',
                zeroLineColor: 'rgba(0, 0, 0, 0)',
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontColor: 'black',
              },
              display: true,
              scaleLabel: {
                display: false,
                labelString: 'Mood (%)',
                fontColor: 'white',
              },
              gridLines: {
                borderDash: [3],
                borderDashOffset: [3],
                drawBorder: false,
                color: 'rgba(0, 0, 0, 0.15)',
                zeroLineColor: 'rgba(33, 37, 41, 0)',
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
        },
      },
    };
  }
}
</script>
