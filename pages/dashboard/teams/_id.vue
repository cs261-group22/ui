<template>
  <div>
    <header class="bg-white shadow">
      <div
        class="max-w-7xl mx-auto md:py-4 py-6 px-4 sm:px-6 lg:px-8 flex justify-between w-full md:items-center flex-col md:flex-row"
      >
        <h1
          v-if="!loadingTeam"
          class="text-xl font-bold leading-tight text-primary mb-2 md:mb-0 font-serif"
        >
          Manage {{ team.name }}
        </h1>

        <div class="flex">
          <input
            v-model="email"
            required
            type="text"
            name="email"
            placeholder="Email address"
            class="block shadow-sm sm:text-sm border-gray-300 rounded-md mr-6 w-96"
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
              <loader :loading="loadingTeam">
                <div
                  v-if="team"
                  class="overflow-hidden lg:border-b lg:border-gray-200 lg:shadow lg:rounded-lg"
                >
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
                          Role
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
                        v-for="user in team.users"
                        :key="user.id"
                        class="flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-6 lg:mb-0 border rounded-md bg-grey-200 lg:bg-white"
                      >
                        <td
                          class="px-6 py-2 lg:py-4 whitespace-nowrap text-right sm:text-center lg:text-left block w-full lg:w-auto lg:table-cell relative lg:static"
                        >
                          <span
                            class="lg:hidden absolute top-0 left-0 bg-primary text-center text-white w-20 px-2 py-3 text-xs font-bold uppercase rounded-tl-md"
                          >
                            Name
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
                          class="px-6 py-2 lg:py-4 whitespace-nowrap text-right sm:text-center lg:text-left block w-full lg:w-auto lg:table-cell relative lg:static"
                        >
                          <span
                            class="lg:hidden absolute top-0 left-0 bg-primary text-center text-white w-20 px-2 py-3 text-xs font-bold uppercase"
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
                          class="px-6 py-2 lg:py-4 whitespace-nowrap text-right sm:text-center lg:text-left block w-full lg:w-auto lg:table-cell relative lg:static"
                        >
                          <span
                            class="lg:hidden absolute top-0 left-0 bg-primary text-center text-white w-20 px-2 py-3 text-xs font-bold uppercase"
                          >
                            Role
                          </span>

                          <span
                            v-if="user.is_admin"
                            class="px-4 lg:px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                          >
                            Admin
                          </span>

                          <span
                            v-else-if="user.is_leader"
                            class="px-4 lg:px-2inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"
                          >
                            Team Leader
                          </span>

                          <span
                            v-else
                            class="px-4 lg:px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                          >
                            Employee
                          </span>
                        </td>

                        <td
                          class="px-6 py-2 lg:py-4 whitespace-nowrap text-right sm:text-center lg:text-left block w-full lg:w-auto lg:table-cell relative lg:static"
                        >
                          <span
                            class="lg:hidden absolute top-0 left-0 bg-primary text-center text-white w-20 px-2 py-3 text-xs font-bold uppercase rounded-bl-md"
                          >
                            Actions
                          </span>

                          <span
                            class="text-indigo-600 text-sm hover:text-indigo-900 mr-4 cursor-pointer"
                            @click="removeUser(user)"
                          >
                            Remove User
                          </span>

                          <template v-if="!user.is_admin && user.id !== userId">
                            <span class="-ml-2 mr-2 text-sm">|</span>

                            <span
                              v-if="!user.is_leader"
                              class="text-sm text-indigo-600 hover:text-indigo-900 mr-4 cursor-pointer"
                              @click="toggleLeader(user)"
                            >
                              Promote to leader
                            </span>

                            <span
                              v-else
                              class="text-sm text-indigo-600 hover:text-indigo-900 mr-4 cursor-pointer"
                              @click="toggleLeader(user)"
                            >
                              Demote to employee
                            </span>
                          </template>
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
import { Component } from 'nuxt-property-decorator';
import { UserMixin } from '~/mixins/user';
import { Team } from '~/types/models/team';
import { User } from '~/types/models/user';

import Loader from '~/components/common/Loader.vue';
import ProgressButon from '~/components/common/ProgressButton.vue';
import { errorsStore } from '~/utils/store-accessor';

@Component({
  layout: 'dashboard',
  components: { Loader, ProgressButon },
  middleware: ['auth'],
})
export default class Users extends UserMixin {
  email: string = '';
  team: Team | null = null;

  addingUser = false;
  loadingTeam = true;

  async created() {
    try {
      this.loadingTeam = true;

      const response = await this.$axios.get(
        `${process.env.NUXT_ENV_API_ROUTE}/teams/${this.$route.params.id}`,
      );

      this.team = response.data.data;
      this.loadingTeam = false;
    } catch {
      errorsStore.flashError('Sorry, an unknown error occurred while fetching the team members.');
    }
  }

  async removeUser(user: User) {
    if (!this.team) {
      return;
    }

    try {
      const updatedUsers = this.team.users.filter((existingUser) => existingUser.id !== user.id);

      await this.$axios.patch(
        `${process.env.NUXT_ENV_API_ROUTE}/teams/${this.$route.params.id}/users`,
        { users: updatedUsers },
      );

      this.team.users = updatedUsers;
    } catch {
      errorsStore.flashError('Sorry, an unknown error occurred while removing that team member.');
    }
  }

  async toggleLeader(user: User) {
    if (!this.team) {
      return;
    }

    try {
      const updatedUsers = [...this.team.users];
      const userIndex = updatedUsers.findIndex((existingUser) => existingUser.id === user.id);

      updatedUsers[userIndex].is_leader = !updatedUsers[userIndex].is_leader;

      await this.$axios.patch(
        `${process.env.NUXT_ENV_API_ROUTE}/teams/${this.$route.params.id}/users`,
        { users: updatedUsers },
      );

      this.team.users = updatedUsers;
    } catch {
      errorsStore.flashError('Sorry, an unknown error occurred while performing that action.');
    }
  }

  async addUser() {
    if (!this.team) {
      return;
    }

    try {
      this.addingUser = true;

      // Create the new user in the system
      const response = await this.$axios.post(`${process.env.NUXT_ENV_API_ROUTE}/user`, {
        name: '',
        is_admin: false,
        email: this.email,
      });

      this.team.users.push(response.data.data as User);

      // Ensure the new user is associated with this team
      await this.$axios.patch(
        `${process.env.NUXT_ENV_API_ROUTE}/teams/${this.$route.params.id}/users`,
        { users: this.team.users },
      );

      this.email = '';
      this.addingUser = false;
    } catch {
      errorsStore.flashError(
        'Sorry, an unknown error occurred while adding the member to the team.',
      );
    }
  }
}
</script>
