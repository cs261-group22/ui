<template>
  <div id="app">
    <nav class="bg-primary">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
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
                  :class="{ 'bg-primarydark': $route.name === 'dashboard-events' }"
                  class="text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Events
                </router-link>

                <router-link
                  v-if="leadsTeams"
                  to="/dashboard/teams"
                  :class="{ 'bg-primarydark': $route.name === 'dashboard-teams' }"
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
                    class="max-w-xs rounded-full flex items-center text-sm"
                    @click="toggleUserDropdown"
                  >
                    <span class="text-white font-bold mx-4 hover:underline">{{ userName }}</span>
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

      <!--
      Mobile menu, toggle classes based on menu state.

      Open: "block", closed: "hidden"
    -->
      <div class="hidden md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="#"
            class="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
            >Dashboard</a
          >

          <a
            href="#"
            class="text-white hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >Team</a
          >

          <a
            href="#"
            class="text-white hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >Projects</a
          >

          <a
            href="#"
            class="text-white hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >Calendar</a
          >

          <a
            href="#"
            class="text-white hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >Reports</a
          >
        </div>

        <div class="pt-4 pb-3 border-t border-gray-700">
          <div class="flex items-center px-5">
            <div class="flex-shrink-0">
              <img
                class="h-10 w-10 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
            <div class="ml-3">
              <div class="text-base font-medium leading-none text-white">Tom Cook</div>
              <div class="text-sm font-medium leading-none text-gray-400">tom@example.com</div>
            </div>
            <button
              class="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <svg
                class="h-6 w-6"
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
          </div>
          <div class="mt-3 px-2 space-y-1">
            <p
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
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

@Component
export default class Dashboard extends mixins(UserMixin, AuthMixin) {
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
