<template>
  <div id="app">
    <nav class="bg-primary md:flex justify-center transition-all duration-300 sticky top-0 z-10">
      <div
        class="px-6 lg:px-8 dashboard-heading transition-all duration-300"
        :class="{ 'is-compact': !navbarFullWidth }"
      >
        <div class="flex items-center justify-between h-20">
          <nuxt-link
            to="/dashboard/events"
            class="flex items-center no-underline hover:no-underline font-bold text-lg lg:text-xl text-white"
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

          <div class="flex items-center">
            <div class="hidden md:block">
              <div class="flex items-baseline space-x-4">
                <router-link
                  to="/dashboard/events"
                  :class="{ 'bg-primarydark': $route.name.startsWith('dashboard-events') }"
                  class="text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Events
                </router-link>

                <router-link
                  v-if="leadsTeams"
                  to="/dashboard/teams"
                  :class="{ 'bg-primarydark': $route.name.startsWith('dashboard-teams') }"
                  class="text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Teams
                </router-link>

                <router-link
                  v-if="isAdmin"
                  to="/dashboard/users"
                  :class="{ 'bg-primarydark': $route.name === 'dashboard-users' }"
                  class="text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin Users
                </router-link>

                <router-link
                  to="/dashboard/guide"
                  :class="{ 'bg-primarydark': $route.name === 'dashboard-guide' }"
                  class="text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  User Guide
                </router-link>
              </div>
            </div>
          </div>

          <div class="hidden md:block">
            <div class="ml-4 flex items-center md:ml-6">
              <div class="ml-3 relative">
                <div>
                  <button
                    class="max-w-xs rounded-md flex items-center text-sm bg-primarydark"
                    @click="toggleUserDropdown"
                  >
                    <span class="text-white font-bold ml-4 mr-2 py-2">
                      {{ userName }}
                    </span>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      class="w-5 mr-2"
                      viewBox="0 0 24 24"
                      stroke="#fff"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>

                <div
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                  :class="{ hidden: !userDropdownVisible }"
                >
                  <button
                    class="block px-4 py-2 w-full text-sm text-left text-gray-700 hover:bg-gray-100"
                    @click="logoutUser"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex md:hidden">
            <button
              class="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              @click="mobileMenuOpen = !mobileMenuOpen"
            >
              <span class="sr-only">Open main menu</span>

              <svg
                class="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>

              <svg
                class="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div :class="{ block: mobileMenuOpen, hidden: !mobileMenuOpen }" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3" @click="mobileMenuOpen = !mobileMenuOpen">
          <router-link
            to="/dashboard/events"
            :class="{ 'bg-gray-900': $route.name.startsWith('dashboard-events') }"
            class="text-white hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Events
          </router-link>

          <router-link
            v-if="leadsTeams"
            to="/dashboard/teams"
            :class="{ 'bg-gray-900': $route.name.startsWith('dashboard-teams') }"
            class="text-white hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Teams
          </router-link>

          <router-link
            v-if="isAdmin"
            to="/dashboard/users"
            :class="{ 'bg-gray-900': $route.name === 'dashboard-users' }"
            class="text-white hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Admin Users
          </router-link>

          <router-link
            to="/dashboard/guide"
            :class="{ 'bg-gray-900': $route.name === 'dashboard-guide' }"
            class="text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            User Guide
          </router-link>
        </div>

        <div class="pt-2 pb-3 border-t border-grey-400">
          <div class="px-2">
            <p
              class="block cursor-pointer px-3 py-2 rounded-md text-base font-medium text-white hover:text-white hover:bg-gray-700"
              @click="logoutUser"
            >
              Sign out
            </p>
          </div>
        </div>
      </div>
    </nav>

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
import { mixins } from 'nuxt-property-decorator';
import { Component } from 'vue-property-decorator';
import { UserMixin } from '~/mixins/user';
import AuthMixin from '~/mixins/auth';
import { errorsStore, initialiseStores } from '~/utils/store-accessor';

@Component({
  middleware: ['auth', 'require-employee'],
})
export default class Dashboard extends mixins(UserMixin, AuthMixin) {
  mobileMenuOpen = false;
  userDropdownVisible = false;

  created() {
    initialiseStores(this.$store);

    if (!this.isLoggedIn) {
      this.$router.push('/sign-in?target=dashboard');
    }

    if (this.isGuest) {
      this.logoutUser();
      this.$router.push('/sign-in?target=dashboard');
    }
  }

  head() {
    return {
      bodyAttrs: {
        class: 'leading-normal tracking-normal text-gray-900',
        style: "font-family: 'Inter', sans-serif",
        meta: [{ name: 'theme-color', content: '#264653' }],
      },
    };
  }

  toggleUserDropdown() {
    this.userDropdownVisible = !this.userDropdownVisible;
  }

  logoutUser() {
    this.logout();
    this.$router.push('/');
  }

  get navbarFullWidth() {
    return ['dashboard-events-id-modify', 'dashboard-events-id-results'].includes(
      this.$route.name as string,
    );
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
.dashboard-heading {
  width: 100%;
  max-width: 100%;
  margin-left: 0;
  margin-right: 0;

  &.is-compact {
    max-width: 80rem;
  }
}
</style>
