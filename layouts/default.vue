<template>
  <div id="app">
    <Nuxt />

    <transition name="fade">
      <div v-if="showErrorPopup" class="absolute right-0 bottom-0 m-5 z-100">
        <div
          class="flex items-center bg-red-500 border-l-4 border-red-700 py-2 px-3 shadow-md mb-2"
        >
          <div class="text-red-500 rounded-full bg-white mr-3">
            <svg
              width="1.8em"
              height="1.8em"
              viewBox="0 0 16 16"
              class="bi bi-x"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"
              />
              <path
                fill-rule="evenodd"
                d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"
              />
            </svg>
          </div>

          <div class="text-white max-w-xs">{{ errorMessage }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { errorsStore, initialiseStores } from '~/utils/store-accessor';

@Component
export default class Default extends Vue {
  created() {
    initialiseStores(this.$store);
  }

  head() {
    return {
      bodyAttrs: {
        class: 'leading-normal tracking-normal text-gray-900',
        style: "font-family: 'Inter', sans-serif",
      },
    };
  }

  get showErrorPopup() {
    return errorsStore.showError;
  }

  get errorMessage() {
    return errorsStore.errorMessage;
  }
}
</script>
