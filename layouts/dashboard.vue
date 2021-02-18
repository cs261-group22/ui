<template>
  <div id="app">
    <nav class="bg-primary">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <p class="text-white font-bold">CS261 Host Dashboard</p>
          <div class="flex items-center">
            <div class="hidden md:block">
              <div class="flex items-baseline space-x-4">
                <router-link
                  to="/dashboard"
                  :class="{ 'bg-primarydark': $route.name === 'dashboard' }"
                  class="text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </router-link>

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
                    <span class="text-white font-bold mx-4 py-2 hover:underline">{{
                      userName
                    }}</span>
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

          <div class="-mr-2 flex md:hidden">
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
            to="/dashboard"
            :class="{ 'bg-gray-900': $route.name === 'dashboard' }"
            class="text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Dashboard
          </router-link>

          <router-link
            to="/dashboard/events"
            :class="{ 'bg-gray-900': $route.name === 'dashboard-events' }"
            class="text-white hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Events
          </router-link>

          <router-link
            v-if="leadsTeams"
            to="/dashboard/teams"
            :class="{ 'bg-gray-900': $route.name === 'dashboard-teams' }"
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
        </div>

        <div class="pt-2 pb-3 border-t border-gray-700">
          <div class="px-2">
            <p
              class="block cursor-pointer px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
              @click="logoutUser"
            >
              Sign out
            </p>
          </div>
        </div>
      </div>
    </nav>

    <Nuxt />
  </div>
</template>

<script lang="ts">
import { mixins } from 'nuxt-property-decorator';
import { Component } from 'vue-property-decorator';
import { UserMixin } from '~/mixins/user';
import AuthMixin from '~/mixins/auth';

import { dashboardStore, initialiseStores } from '~/utils/store-accessor';

@Component({
  middleware: ['auth', 'require-employee'],
})
export default class Dashboard extends mixins(UserMixin, AuthMixin) {
  mobileMenuOpen = false;
  userDropdownVisible = false;

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

  toggleUserDropdown() {
    this.userDropdownVisible = !this.userDropdownVisible;
  }

  logoutUser() {
    this.logout();
  }

  get pageName() {
    return dashboardStore.currentPageName;
  }
}
</script>
