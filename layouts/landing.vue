<template>
  <div id="app">
    <div class="h-screen pb-14 bg-right bg-cover bg-landing">
      <div class="w-full container mx-auto p-6">
        <div class="w-full flex items-center justify-between">
          <nuxt-link
            to="/"
            class="flex items-center text-primary no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
          >
            CS261
          </nuxt-link>

          <div class="flex w-1/2 justify-end content-center">
            <nuxt-link
              :to="{ name: 'sign-in', query: { target: 'dashboard' } }"
              class="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-quinary"
            >
              Host Dashboard
            </nuxt-link>
          </div>
        </div>
      </div>

      <Nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { initialiseStores } from '~/utils/store-accessor';

@Component
export default class Default extends Vue {
  created() {
    initialiseStores(this.$store);
  }

  head() {
    return {
      bodyAttrs: {
        class: 'leading-normal tracking-normal text-gray-900',
        style: "font-family: 'Source Sans Pro', sans-serif",
      },
    };
  }
}
</script>
