<template>
  <div class="w-full mb-12 px-4">
    <div
      class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-gray-900"
    >
      <div class="rounded-t mb-0 p-8 bg-transparent">
        <div class="flex flex-wrap items-center">
          <div class="relative w-full max-w-full flex-grow flex-1">
            <h6 class="uppercase text-gray-500 text-xs font-semibold">At a glance</h6>

            <h2 class="text-white text-xl font-semibold">Key Feedback Metrics</h2>
          </div>
        </div>
      </div>

      <div class="relative px-8" style="height: 350px">
        <canvas id="line-chart"></canvas>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop } from 'nuxt-property-decorator';
import { Component, Watch } from 'vue-property-decorator';

import Chart from 'chart.js';

import { ResultsMixin } from '~/mixins/results';
import { Session } from '~/types/models/session';

@Component
export default class Summary extends ResultsMixin {
  @Prop({ type: Array, required: true })
  submissions!: Session[];

  @Watch('submissions', { immediate: true })
  onSubmissionsChanged(submissions: Session[]) {
    this.$nextTick(function () {
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Explicit Mood',
              backgroundColor: '#4c51bf',
              borderColor: '#4c51bf',
              cubicInterpolationMode: 'monotone',

              data: this.scaleResponses(
                submissions.map((submission) => {
                  return {
                    x: submission.started_at,
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
                submissions.map((submission) => {
                  return {
                    x: submission.started_at,
                    y: this.calculateSubmissionImplicitMood(submission),
                  };
                }),
              ),
            },
            {
              label: 'Urgency',
              fill: false,
              backgroundColor: '#e76f51',
              borderColor: '#e76f51',
              cubicInterpolationMode: 'monotone',

              data: this.scaleResponses(
                submissions.map((submission) => {
                  return {
                    x: submission.started_at,
                    y: this.calculateSubmissionUrgency(submission) || 0,
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
              fontColor: 'white',
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
                  fontColor: 'rgba(255,255,255,.7)',
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
                  color: 'rgba(33, 37, 41, 0.3)',
                  zeroLineColor: 'rgba(0, 0, 0, 0)',
                  zeroLineBorderDash: [2],
                  zeroLineBorderDashOffset: [2],
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  fontColor: 'rgba(255,255,255,.7)',
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
                  color: 'rgba(255, 255, 255, 0.15)',
                  zeroLineColor: 'rgba(33, 37, 41, 0)',
                  zeroLineBorderDash: [2],
                  zeroLineBorderDashOffset: [2],
                },
              },
            ],
          },
        },
      };

      const ctx = (document?.getElementById('line-chart') as HTMLCanvasElement)?.getContext('2d');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _ = new Chart(ctx as any, config as any);
    });
  }
}
</script>
