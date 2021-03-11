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
      <div
        class="max-w-7xl mx-auto py-6 md:py-4 px-6 lg:px-8 flex justify-between w-full md:items-center flex-col md:flex-row"
      >
        <h1 class="text-xl font-bold leading-tight text-primary font-serif mb-2 md:mb-0">
          Manage Your Teams
        </h1>

        <div>
          <button v-if="isAdmin" class="gradient-button is-compact" @click="creatingTeam = true">
            Add new team
          </button>
        </div>
      </div>
    </header>

    <main>
      <div class="max-w-7xl mx-auto py-6 lg:px-8">
        <div class="flex flex-col">
          <div class="-my-2 overflow-x-auto lg:-mx-8">
            <div class="py-2 px-6 align-middle inline-block min-w-full md:px-6 lg:px-8">
              <loader :loading="loadingTeams">
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
                          Department
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
                        v-for="team in teams"
                        :key="team.id"
                        class="flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-6 lg:mb-0 border rounded-md bg-grey-200 lg:bg-white"
                      >
                        <td
                          class="px-6 py-2 lg:py-4 whitespace-nowrap text-right sm:text-center lg:text-left block w-full lg:w-auto lg:table-cell relative lg:static"
                        >
                          <span
                            class="lg:hidden absolute top-0 left-0 bg-primary text-center text-white w-24 px-2 py-3 text-xs font-bold uppercase rounded-tl-md"
                          >
                            Name
                          </span>

                          <span class="text-sm font-medium text-gray-900">
                            {{ team.name }}
                          </span>
                        </td>

                        <td
                          class="px-6 py-2 lg:py-4 whitespace-nowrap text-right sm:text-center lg:text-left block w-full lg:w-auto lg:table-cell relative lg:static"
                        >
                          <span
                            class="lg:hidden absolute top-0 left-0 bg-primary text-center text-white w-24 px-2 py-3 text-xs font-bold uppercase"
                          >
                            Department
                          </span>

                          <span class="text-sm font-medium text-gray-900">
                            {{ team.department }}
                          </span>
                        </td>

                        <td
                          class="px-6 py-2 lg:py-4 whitespace-nowrap text-right sm:text-center lg:text-left block w-full lg:w-auto lg:table-cell relative lg:static"
                        >
                          <span
                            class="lg:hidden absolute top-0 left-0 bg-primary text-center text-white w-24 px-2 py-3 text-xs font-bold uppercase rounded-bl-md"
                          >
                            Actions
                          </span>

                          <router-link
                            :to="{ name: 'dashboard-teams-id', params: { id: team.id } }"
                            class="text-indigo-600 hover:text-indigo-900 text-sm mr-1 lg:mr-2"
                          >
                            Manage Members
                          </router-link>

                          <template v-if="isAdmin">
                            <span class="text-sm lg:text-md">|</span>

                            <button
                              class="text-indigo-600 hover:text-indigo-900 text-sm ml-1 lg:ml-2"
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
    </main>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator';
import { UserMixin } from '~/mixins/user';
import { Team } from '~/types/models/team';

import Loader from '~/components/common/Loader.vue';
import FormModal from '~/components/common/FormModal.vue';
import ProgressButon from '~/components/common/ProgressButton.vue';
import ConfirmationModal from '~/components/common/ConfirmationModal.vue';
import { errorsStore } from '~/utils/store-accessor';

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
      errorsStore.flashError('Sorry, an unknown error occurred while creating the team.');
    }
  }

  async deleteTeam() {
    try {
      await this.$axios.delete(`${process.env.NUXT_ENV_API_ROUTE}/teams/${this.teamToDelete}`);

      this.teams = this.teams.filter((teams) => teams.id !== this.teamToDelete);
      this.teamToDelete = null;
    } catch {
      errorsStore.flashError('Sorry, an unknown error occurred while deleting the team.');
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
