<template>
  <div>
    <header class="bg-white shadow">
      <div
        class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between w-full flex-col lg:flex-row"
      >
        <h1 class="text-3xl font-bold leading-tight text-primary mb-2 lg:mb-0">
          Manage Admin Users
        </h1>

        <div class="flex">
          <input
            v-model="email"
            type="text"
            name="email"
            placeholder="Email address"
            class="block shadow-sm sm:text-sm border-gray-300 rounded-md mr-6 w-96"
          />

          <progress-buton :loading="addingUser" @click="addUser"> Add user </progress-buton>
        </div>
      </div>
    </header>

    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="flex flex-col">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <loader :loading="loadingUsers">
                  <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Name
                          </th>

                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>

                          <th
                            scope="col"
                            class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="user in users" :key="user.id">
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                              <div>
                                <div class="text-sm font-medium text-gray-900">
                                  {{ user.email }}
                                </div>
                                <div class="text-sm text-gray-500">{{ user.name }}</div>
                              </div>
                            </div>
                          </td>

                          <td class="px-6 py-4 whitespace-nowrap">
                            <span
                              v-if="user.email_verified_at"
                              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                            >
                              Active
                            </span>

                            <span
                              v-else
                              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                            >
                              Invited
                            </span>
                          </td>

                          <td class="px-3 py-4 whitespace-nowrap text-sm font-medium">
                            <span
                              class="text-indigo-600 hover:text-indigo-900 mr-4 cursor-pointer"
                              @click="removePrivileges(user)"
                            >
                              Remove admin privileges
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </loader>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { User } from '~/types/models/user';

import Loader from '~/components/common/Loader.vue';
import ProgressButon from '~/components/common/ProgressButton.vue';

@Component({
  layout: 'dashboard',
  components: { Loader, ProgressButon },
  middleware: ['auth'],
})
export default class Users extends Vue {
  email: string = '';
  users: User[] = [];

  addingUser = false;
  loadingUsers = true;

  async created() {
    this.loadingUsers = true;

    const response = await this.$axios.get(`${process.env.NUXT_ENV_API_ROUTE}/users?is_admin=1`);

    this.users = response.data.data;
    this.loadingUsers = false;
  }

  async addUser() {
    if (this.users.some((user) => user.email === this.email)) {
      // todo: show a message
      return;
    }

    try {
      this.addingUser = true;

      const response = await this.$axios.post(`${process.env.NUXT_ENV_API_ROUTE}/user`, {
        name: '',
        is_admin: true,
        email: this.email,
      });

      this.email = '';
      this.users.push(response.data.data as User);

      this.addingUser = false;
    } catch {
      // todo: display an error message
    }
  }

  async removePrivileges(user: User) {
    user.is_admin = false;

    try {
      await this.$axios.patch(`${process.env.NUXT_ENV_API_ROUTE}/user/${user.id}`, user);

      this.users = this.users.filter((existingUser) => user.id !== existingUser.id);
    } catch {
      // todo: display an error message
    }
  }
}
</script>
