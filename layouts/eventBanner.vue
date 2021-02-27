<template>
  <div id="app">
    <nav class="bg-primary">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <div class="hidden md:block">
              <div class="flex items-baseline space-x-4">
                <span class="text-white rounded-md text-sm text-3xl font-medium tracking-wider">EVENT FEEDBACK</span>
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
                    <span class="text-white mx-4 hover:font-bold hover:text-gray-200">{{ userName }}</span>
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
