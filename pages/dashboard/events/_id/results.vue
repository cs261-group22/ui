<template>
  <div>
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between w-full">
        <h1 class="text-3xl font-bold leading-tight text-primary">View Event Results</h1>
      </div>
    </header>
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <!-- todo -->
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { dashboardStore } from '~/store';

@Component({
  layout: 'dashboard',
  middleware: ['auth'],
})
export default class Results extends Vue {
  created() {
    dashboardStore.setPageName('Dashboard');
  }
}
</script>
