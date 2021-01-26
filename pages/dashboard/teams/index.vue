<template>
  <div>
    <form-modal
      v-if="creatingTeam"
      title="Create new team"
      action="Create"
      @cancelled="creatingTeam = false"
      @confirmed="createTeam"
    >
      <p class="mb-4">Enter a name and department below to create the team.</p>

      <input
        v-model="teamName"
        type="text"
        name="name"
        placeholder="Team name"
        class="block shadow-sm sm:text-sm border-gray-300 rounded-md w-full mb-2"
      />

      <input
        v-model="teamDepartment"
        type="text"
        name="department"
        placeholder="Department name"
        class="block shadow-sm sm:text-sm border-gray-300 rounded-md w-full"
      />
    </form-modal>

    <confirmation-modal
      v-if="teamToDelete"
      title="Are you sure?"
      description="Deleting this team will also remove all statistics associated with it."
      action="Delete"
      @confirmed="deleteTeam"
      @cancelled="cancelDeleteTeam"
    />

    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between w-full">
        <h1 class="text-3xl font-bold leading-tight text-primary">Manage Your Teams</h1>

        <button
          v-if="isAdmin"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-quinary"
          @click="creatingTeam = true"
        >
          Add new team
        </button>
      </div>
    </header>

    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="flex flex-col">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <loader :loading="loadingTeams">
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
                            Department
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
                        <tr v-for="team in teams" :key="team.id">
                          <td class="px-6 py-4 whitespace-nowrap">
                            <span class="text-sm font-medium text-gray-900">
                              {{ team.name }}
                            </span>
                          </td>

                          <td class="px-6 py-4 whitespace-nowrap">
                            <span class="text-sm font-medium text-gray-900">
                              {{ team.department }}
                            </span>
                          </td>

                          <td class="px-3 py-4 whitespace-nowrap text-sm font-medium">
                            <router-link
                              :to="{ name: 'dashboard-teams-id', params: { id: team.id } }"
                              class="text-indigo-600 hover:text-indigo-900 mr-2"
                            >
                              Manage Members
                            </router-link>

                            <template v-if="isAdmin">
                              <span>|</span>

                              <button
                                class="text-indigo-600 hover:text-indigo-900 ml-2"
                                @click="confirmDeletion(team.id)"
                              >
                                Delete
                              </button>
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
import { Team } from '~/types/team';

import Loader from '~/components/common/Loader.vue';
import FormModal from '~/components/common/FormModal.vue';
import ProgressButon from '~/components/common/ProgressButton.vue';
import ConfirmationModal from '~/components/common/ConfirmationModal.vue';

@Component({
  layout: 'dashboard',
  components: { Loader, ProgressButon, ConfirmationModal, FormModal },
  middleware: ['auth'],
})
export default class Teams extends UserMixin {
  teams: Team[] = [];
  loadingTeams = true;
  creatingTeam = false;

  teamName = '';
  teamDepartment = '';
  teamToDelete: number | null = null;

  async created() {
    this.loadingTeams = true;

    const response = await this.$axios.get(`${process.env.NUXT_ENV_API_ROUTE}/teams`);

    this.teams = response.data.data;
    this.loadingTeams = false;
  }

  async createTeam() {
    try {
      const response = await this.$axios.post(`${process.env.NUXT_ENV_API_ROUTE}/teams`, {
        name: this.teamName,
        department: this.teamDepartment,
      });

      this.teams.push(response.data.data as Team);

      this.creatingTeam = false;
      this.teamName = '';
      this.teamDepartment = '';
    } catch {
      // todo: show error message
    }
  }

  async deleteTeam() {
    try {
      await this.$axios.delete(`${process.env.NUXT_ENV_API_ROUTE}/teams/${this.teamToDelete}`);

      this.teams = this.teams.filter((teams) => teams.id !== this.teamToDelete);
      this.teamToDelete = null;
    } catch {
      // todo: show error message
    }
  }

  confirmDeletion(teamId: number) {
    this.teamToDelete = teamId;
  }

  cancelDeleteTeam() {
    this.teamToDelete = null;
  }
}
</script>
