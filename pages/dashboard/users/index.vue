<template>
  <div>
    <header class="bg-white shadow">
      <div
        class="max-w-7xl mx-auto py-6 md:py-4 px-6 lg:px-8 flex justify-between md:items-center flex-col md:flex-row w-full"
      >
        <h1 class="text-xl font-bold font-serif leading-tight text-primary mb-2 md:mb-0">
          Manage Admin Users
        </h1>

        <div class="flex">
          <input
            v-model="email"
            type="text"
            name="email"
            placeholder="Email address"
            class="block shadow-sm sm:text-sm border-gray-300 rounded-md mr-2 md:mr-6 w-96"
          />

          <progress-buton :loading="addingUser" :compact="true" @click="addUser">
            Add user
          </progress-buton>
        </div>
      </div>
    </header>

    <main>
      <div class="max-w-7xl mx-auto py-6 lg:px-8">
        <div class="flex flex-col">
          <div class="-my-2 overflow-x-auto lg:-mx-8">
            <div class="py-2 px-6 align-middle inline-block min-w-full lg:px-8">
              <loader :loading="loadingUsers">
                <div class="overflow-hidden lg:border-b lg:border-gray-200 lg:shadow lg:rounded-lg">
                  <table class="min-w-full lg:divide-y lg:divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                        >
                          Name
                        </th>

                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                        >
                          Status
                        </th>

                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr
                        v-for="user in users"
                        :key="user.id"
                        class="flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-6 lg:mb-0 border rounded-md bg-grey-200 lg:bg-white"
                      >
                        <td
                          class="px-6 py-2 lg:py-4 whitespace-nowrap text-right sm:text-center lg:text-left block w-full lg:w-auto lg:table-cell relative lg:static"
                        >
                          <span
                            class="lg:hidden absolute top-0 left-0 bg-primary text-center text-white w-22 px-2 py-3 text-xs font-bold uppercase rounded-tl-md"
                          >
                            Actions
                          </span>

                          <div class="flex flex-row lg:flex-col justify-end sm:justify-center">
                            <div class="text-sm font-medium text-gray-900">
                              {{ user.email }}
                            </div>

                            <span v-if="user.name" class="lg:hidden text-sm text-gray-500 ml-2">
                              (
                            </span>

                            <div class="text-sm text-gray-500">{{ user.name }}</div>
                            <span v-if="user.name" class="lg:hidden text-sm text-gray-500">)</span>
                          </div>
                        </td>

                        <td
                          class="px-6 py-2 whitespace-nowrap text-right sm:text-center lg:text-left block w-full lg:w-auto lg:table-cell relative lg:static"
                        >
                          <span
                            class="lg:hidden absolute top-0 left-0 bg-primary text-center text-white w-22 px-2 py-3 text-xs font-bold uppercase"
                          >
                            Status
                          </span>

                          <span
                            v-if="user.email_verified_at"
                            class="px-4 lg:px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                          >
                            Active
                          </span>

                          <span
                            v-else
                            class="px-4 lg:px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                          >
                            Invited
                          </span>
                        </td>

                        <td
                          class="px-6 py-2 whitespace-nowrap text-right sm:text-center lg:text-left block w-full lg:w-auto lg:table-cell relative lg:static"
                        >
                          <span
                            class="lg:hidden absolute top-0 left-0 bg-primary text-center text-white w-22 px-2 py-3 text-xs font-bold uppercase rounded-bl-md"
                          >
                            Actions
                          </span>

                          <span
                            class="text-sm text-indigo-600 hover:text-indigo-900 mr-4 cursor-pointer"
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
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { User } from '~/types/models/user';

import Loader from '~/components/common/Loader.vue';
import ProgressButon from '~/components/common/ProgressButton.vue';
import { errorsStore } from '~/utils/store-accessor';

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
      this.email = '';
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
      errorsStore.flashError('Sorry, an unknown error occurred while inviting the user.');
    } finally {
      this.addingUser = false;
    }
  }

  async removePrivileges(user: User) {
    user.is_admin = false;

    try {
      await this.$axios.patch(`${process.env.NUXT_ENV_API_ROUTE}/user/${user.id}`, user);

      this.users = this.users.filter((existingUser) => user.id !== existingUser.id);
    } catch {
      errorsStore.flashError('Sorry, an unknown error occurred performing that action.');
    }
  }
}
</script>
