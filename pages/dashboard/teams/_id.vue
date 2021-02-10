<template>
  <div>
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between w-full">
        <h1 v-if="!loadingTeam" class="text-3xl font-bold leading-tight text-primary">
          Manage {{ team.name }} Members
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
                <loader :loading="loadingTeam">
                  <div
                    v-if="team"
                    class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
                  >
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
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Role
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
                        <tr v-for="user in team.users" :key="user.id">
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

                          <td class="px-6 py-4 whitespace-nowrap">
                            <span
                              v-if="user.is_admin"
                              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                            >
                              Admin
                            </span>

                            <span
                              v-else-if="user.is_leader"
                              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"
                            >
                              Team Leader
                            </span>

                            <span
                              v-else
                              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                            >
                              Employee
                            </span>
                          </td>

                          <td class="px-3 py-4 whitespace-nowrap text-sm font-medium">
                            <span
                              class="text-indigo-600 hover:text-indigo-900 mr-4 cursor-pointer"
                              @click="removeUser(user)"
                            >
                              Remove User
                            </span>

                            <template v-if="!user.is_admin && user.id !== userId">
                              <span class="-ml-2 mr-2">|</span>

                              <span
                                v-if="!user.is_leader"
                                class="text-indigo-600 hover:text-indigo-900 mr-4 cursor-pointer"
                                @click="toggleLeader(user)"
                              >
                                Promote to leader
                              </span>

                              <span
                                v-else
                                class="text-indigo-600 hover:text-indigo-900 mr-4 cursor-pointer"
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
    // todo: store teams in vuex so we don't have to request them again

    try {
      this.loadingTeam = true;

      const response = await this.$axios.get(
        `${process.env.NUXT_ENV_API_ROUTE}/teams/${this.$route.params.id}`,
      );

      this.team = response.data.data;
      this.loadingTeam = false;
    } catch {
      // todo: show error message
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
      // todo: show error message
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
      // todo: show error message
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
      // todo: display an error message
    }
  }
}
</script>
