<template>
  <div id="app">
    <div class="h-full bg-right bg-cover flex flex-col">
      <div class="bg-primary px-6 sm:px-12 md:px-18 lg:px-24 xl:px-32">
        <div class="w-full container mx-auto py-6">
          <div class="w-full flex flex-wrap items-center justify-between">
            <nuxt-link
              to="/"
              class="flex items-center no-underline hover:no-underline font-bold text-2xl lg:text-3xl text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="w-7 mr-3"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                />
              </svg>
              <span>FeedBank</span>
            </nuxt-link>

            <div class="flex w-1/2 justify-end content-center">
              <nuxt-link
                :to="{ name: 'sign-in', query: { target: 'dashboard' } }"
                class="gradient-button ml-8"
              >
                Host Dashboard
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-grow flex flex-col">
        <div
          class="w-full px-6 sm:px-12 md:px-18 lg:px-24 xl:px-32 lg:mb-8 bg-primary pt-8 md:pt-16 lg:pt-32 pb-32 lg:pb-56 relative"
          style="transition all 1s"
        >
          <div
            class="container mx-auto content transition-all duration-300"
            :class="{ expanded: !isHome }"
          >
            <Nuxt class="z-10" />

            <div class="z-0 shape-divider">
              <svg
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                  opacity=".25"
                  class="shape-fill"
                ></path>
                <path
                  d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                  opacity=".5"
                  class="shape-fill"
                ></path>
                <path
                  d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                  class="shape-fill"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div
          class="flex-grow flex flex-col justify-between px-6 sm:px-12 md:px-18 lg:px-24 xl:px-32 bg-white w-full text-sm text-left fade-in py-12"
        >
          <PortalTarget name="landing-footer" />

          <a class="text-gray-500 no-underline hover:no-underline text-center" href="#"
            >&copy; 2021 FeedBank
          </a>
        </div>
      </div>
    </div>

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

  get isHome() {
    return this.$route.name === 'index';
  }

  get showErrorPopup() {
    return errorsStore.showError;
  }

  get errorMessage() {
    return errorsStore.errorMessage;
  }
}
</script>

<style lang="scss" scoped>
.content {
  height: 30vh;

  @media (min-width: 640px) {
    height: 16vh;
  }

  &.expanded {
    height: 90vh;

    @media (min-width: 640px) {
      height: 55vh;
    }
  }
}
</style>
