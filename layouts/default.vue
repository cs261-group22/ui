<template>
  <div id="app">
    <Nuxt />
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
