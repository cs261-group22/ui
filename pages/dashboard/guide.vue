<template>
  <div>
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-5 px-6 lg:px-8 flex items-center justify-between w-full">
        <h1 class="text-xl font-bold text-primary font-serif">User Guide</h1>
      </div>
    </header>
    <main>
      <div class="max-w-7xl mx-auto py-4 px-6 lg:px-8">
        <div class="py-2">
          <h2 class="text-xl font-semibold">Setting up an event</h2>
          <ul class="list-disc ml-6 mb-4">
            <li>
              An event can be created by visiting the events tab located at the top of this page,
              and selecting the 'Create New Event' button.
            </li>
            <li>Give the event an appropriate name and description.</li>
            <li>The draft event will then appear in the events table.</li>
          </ul>

          <h2 class="text-xl font-semibold">Configuring and publishing an event</h2>
          <ul class="list-disc text-justify ml-6 mb-4">
            <li>
              To configure an event, navigate to the events tab and locate the event you wish to
              configure in the table of events, and select 'Configure Event' under the 'Actions'
              column of the table.
            </li>
            <li>
              The event's data, such as its name, description, start time and end time can be
              modified by selecting the 'Settings' tab on the sidebar menu.
            </li>
            <li>Hosts may be added or removed by visiting the 'Hosts' tab on the sidebar menu.</li>
            <li>
              To create a form for an event, visit the 'Questions' tab on the sidebar menu.
              Different types of questions (e.g., free text or multiple choice) can be or removed.
              Multiple choice questions must have at least two responses before the event can be
              published.
            </li>
            <li>
              To make a draft event live, visit the 'Publish' tab on the sidebar menu. Please ensure
              that the checklist on this tab is complete, then click publish to make the event live.
            </li>
          </ul>

          <h2 class="text-xl font-semibold">Deleting an event</h2>
          <ul class="list-disc text-justify ml-6 mb-4">
            <li>
              To delete an event, locate the event in the events table and select 'Delete' under the
              'Actions' column of the table.
            </li>
          </ul>

          <h2 class="text-xl font-semibold">Providing feedback for an event</h2>
          <ul class="list-disc text-justify ml-6 mb-4">
            <li>
              To receive feedback for a live event, instruct your attendees to visit the application
              home page and enter the event's unique code.
            </li>
            <li>
              An event's code can be found under the 'Code' column for the event in the events
              table.
            </li>
            <li>
              Joining an event as an employee will link the provided feedback with their account on
              the results page.
            </li>
            <li>
              Joining an event as a guest will ensure that all provided responses are anonymous.
            </li>
          </ul>

          <h2 class="text-xl font-semibold">Viewing event responses</h2>
          <ul class="list-disc text-justify ml-6 mb-4">
            <li>To view event responses and analytics, navigate to the events tab.</li>
            <li>
              Locate the event you wish to view in the events table and select 'View Responses'.
            </li>
          </ul>

          <h2 class="text-xl font-semibold">Managing teams</h2>
          <ul class="list-disc text-justify ml-6 mb-4">
            <li>
              To manage teams for which you are a leader, navigate to the teams tab at the top of
              this page.
            </li>
            <li>Members can be promoted/demoted to team leader by clicking the adjacent link.</li>
            <li>
              New teams can be created by selecting the 'Add new team' button at the top of the
              teams tab page.
            </li>
            <li>
              Teams can be removed by selecting 'Delete' in the 'Actions' column of the teams table.
            </li>
            <li>
              Please note: Admins will be able to view and manage
              <span class="font-semibold">all</span>
              teams, regardless of their role as a leader of the team.
            </li>
          </ul>

          <h2 class="text-xl font-semibold">Inviting new users</h2>
          <ul class="list-disc text-justify ml-6 mb-4">
            <li>
              Team leaders can invite new users to the system by entering their email address on the
              manage team page.
            </li>
            <li>
              An email will then be sent to the provided address, inviting the user to verify their
              account and set a password.
            </li>
          </ul>

          <h2 class="text-xl font-semibold">Admin actions</h2>
          <ul class="list-disc text-justify ml-6 mb-4">
            <li>
              To add a new admin member, enter the admin member's email in the input box at the top
              of the page and select 'Add user'.
            </li>
            <li>
              This will send an email to invite the new user to be an admin.
              <span class="font-semibold"
                >The invitee must accept this email to become an admin</span
              >.
            </li>
            <li>
              To remove an admin, locate the admin in the table of admin users and select 'Delete'
              under the 'Actions' column.
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  layout: 'dashboard',
  middleware: ['auth'],
})
export default class Index extends Vue {}
</script>
