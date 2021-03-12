<template>
  <div>
    <div class="mb-8 max-w-2xl">
      <h1
        class="mb-1 text-4xl md:text-5xl text-white font-bold leading-tight fade-in font-serif font-serif"
      >
        Welcome to FeedBank.
      </h1>

      <p class="leading-normal text-secondarylight md:text-xl mb-4 md:mb-8 fade-in font-semibold">
        To join an event, please enter the invite code provided by your host.
      </p>

      <label for="event_code" class="fade-in block mb-1 text-sm font-medium text-gray-700"
        >Invite code</label
      >

      <div class="flex w-full fade-in">
        <input
          v-model="surveyCode"
          type="text"
          name="event_code"
          placeholder="e.g a1ZnL"
          class="flex-grow focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md mr-4"
        />

        <router-link
          :to="{ name: 'join-code', params: { code: surveyCode || ' ' } }"
          :disabled="!surveyCode.length"
          class="gradient-button"
        >
          Join Event
        </router-link>
      </div>

      <Portal to="landing-footer">
        <div class="flex flex-col items-center lg:flex-row">
          <div class="w-full lg:w-1/2 lg:mr-12 mb-8 lg:mb-0">
            <p class="text-3xl font-bold font-serif mb-2">FeedBank for Event Hosts</p>

            <p class="text-lg text-justify mb-6">
              FeedBank allows you to collect actionable feedback for your events in realtime,
              helping to identify and correct issues for your attendees.
            </p>

            <ul class="list-disc text-lg ml-8 mb-6">
              <li>Build custom feedback questionaires to gather feedback from users</li>
              <li>View feedback in real-time, as it is submitted by attendees</li>
              <li>Collate responses by question or attendee</li>
              <li>Perform advanced analysis of attendee mood over the course of the event</li>
              <li>Export received feedback as a spreadsheet for external usage</li>
            </ul>

            <p class="text-lg">
              <span class="font-bold">Interested?</span> Ask your team leader to send you an invite
              to get started.
            </p>
          </div>

          <div class="w-full flex justify-center lg:block lg:w-1/2 lg:ml-12 mb-8 lg:mb-0"></div>
        </div>
      </Portal>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  layout: 'landing',
})
export default class Index extends Vue {
  surveyCode = '';
}
</script>
