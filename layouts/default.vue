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
}
</script>
