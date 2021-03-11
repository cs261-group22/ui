<template>
  <div class="flex-grow">
    <header class="bg-white shadow">
      <div class="lg:h-20 py-6 px-4 sm:px-6 lg:px-8 w-full flex items-center">
        <p class="text-xl font-bold font-serif">Export Feedback</p>
      </div>
    </header>

    <div class="py-6 px-4 sm:px-6 lg:px-8 max-w-4xl">
      <div class="p-6 w-full bg-grey-200 rounded-md shadow-md text-black">
        <p class="mb-4">Use the options below to export all feedback collected for this event.</p>

        <select
          v-model="selectedExportType"
          class="w-full rounded-md shadow-sm sm:text-sm border-gray-300 mb-6"
        >
          <option :value="ExportType.FULL">Full Export (Feedback + Analysis)</option>
          <option :value="ExportType.FEEDBACK">Feedback Only</option>
        </select>

        <div class="flex flex-col md:flex-row">
          <p
            class="gradient-button mr-4 mb-2 md:mb-0 w-full md:w-auto"
            @click="exportFeedback('xlsx')"
          >
            Export as Excel Spreadsheet
          </p>
          <p class="gradient-button w-full md:w-auto" @click="exportFeedback('csv')">
            Export as CSV
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop } from 'nuxt-property-decorator';
import { Component } from 'vue-property-decorator';

import moment from 'moment';

import ProgressButton from '~/components/common/ProgressButton.vue';

import { Event } from '~/types/models/event';
import { UserMixin } from '~/mixins/user';

enum ExportType {
  FULL = 'full',
  FEEDBACK = 'feedback',
}

@Component({ components: { ProgressButton } })
export default class Export extends UserMixin {
  @Prop({ type: Object, required: true })
  event!: Event;

  ExportType = ExportType;
  selectedExportType = ExportType.FULL;

  exportFeedback(format: string) {
    this.$axios({
      url: `${process.env.NUXT_ENV_API_ROUTE}/events/${this.event.id}/export?format=${format}&type=${this.selectedExportType}`,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      // Initialise a html element from the response data
      const feedbackData = window.URL.createObjectURL(new Blob([response.data]));
      const feedbackLink = document.createElement('a');
      feedbackLink.href = feedbackData;

      // Set the file name to download
      feedbackLink.setAttribute(
        'download',
        `feedback-${
          this.selectedExportType === ExportType.FULL ? 'full' : 'limited'
        }-export-${this.event.name.toLowerCase().replaceAll(' ', '-')}-${moment().format(
          'YYYY-MM-DD-HH-mm-ss',
        )}.${format === 'xlsx' ? 'xlsx' : 'csv'}`,
      );

      // Create the element and download the file
      document.body.appendChild(feedbackLink);
      feedbackLink.click();
    });
  }
}
</script>
