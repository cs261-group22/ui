<template>
  <div
    class="container pt-24 md:pt-48 px-6 mx-auto flex flex-wrap flex-col md:flex-row items-center"
  >
    <div
      class="flex flex-col w-full xl:w-2/5 mb-16 justify-center lg:items-start overflow-y-hidden"
    >
      <h1 class="my-4 text-4xl md:text-5xl text-primary font-bold leading-tight fade-in">
        Welcome to CS261.
      </h1>

      <p class="leading-normal text-secondary md:text-2xl mb-8 fade-in">
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
          :to="{ name: 'join-code', params: { code: surveyCode } }"
          class="flex-none whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white font-medium bg-quinary"
        >
          Join Event
        </router-link>
      </div>
    </div>

    <div class="w-full xl:w-3/5 py-6 overflow-y-hidden">
      <img class="w-5/6 mx-auto lg:mr-0 fade-in" src="/devices.svg" />
    </div>

    <div class="w-full pt-16 pb-6 text-sm text-center md:text-left fade-in">
      <a class="text-gray-500 no-underline hover:no-underline" href="#">&copy; CS261 Group 22 </a>
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
