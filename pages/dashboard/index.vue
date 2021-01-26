<template>
  <div>
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between w-full">
        <h1 class="text-3xl font-bold leading-tight text-primary">Host Dashboard</h1>
      </div>
    </header>
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <p class="mb-4">
            Donec sodales sagittis magna. Vestibulum ante ipsum primis in faucibus orci luctus et
            ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat
            euismod orci, ac placerat dolor lectus quis orci. Pellentesque libero tortor, tincidunt
            et, tincidunt eget, semper nec, quam. Proin sapien ipsum, porta a, auctor quis, euismod
            ut, mi. Quisque rutrum.
          </p>

          <p class="mb-4">
            Morbi vestibulum volutpat enim. Praesent metus tellus, elementum eu, semper a,
            adipiscing nec, purus. Maecenas nec odio et ante tincidunt tempus. Pellentesque posuere.
            Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Nunc sed
            turpis. Suspendisse eu ligula. In dui magna, posuere eget, vestibulum et, tempor auctor,
            justo. Nam commodo suscipit
          </p>

          <p class="mb-4">
            quam. Curabitur blandit mollis lacus. In enim justo, rhoncus ut, imperdiet a, venenatis
            vitae, justo. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem.
            Curabitur turpis. Aliquam erat volutpat. Quisque id odio. Quisque rutrum. Cras non
            dolor. Curabitur suscipit suscipit tellus. Proin faucibus arcu quis ante. Fusce vel dui.
          </p>
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
export default class Index extends Vue {
  created() {
    dashboardStore.setPageName('Dashboard');
  }
}
</script>
