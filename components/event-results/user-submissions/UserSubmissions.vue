<template>
  <div>
    <submission-view v-if="selectedSubmission" :submission="selectedSubmission" :event="event" />
    <submission-list v-else :event="event" />
  </div>
</template>

<script lang="ts">
import { Prop } from 'nuxt-property-decorator';
import { Component, Watch } from 'vue-property-decorator';

import ProgressButton from '~/components/common/ProgressButton.vue';
import SubmissionList from '~/components/event-results/user-submissions/partials/List.vue';
import SubmissionView from '~/components/event-results/user-submissions/partials/View.vue';

import { Event } from '~/types/models/event';
import { UserMixin } from '~/mixins/user';
import { Session } from '~/types/models/session';

@Component({ components: { ProgressButton, SubmissionList, SubmissionView } })
export default class Responses extends UserMixin {
  @Prop({ type: Object, required: true })
  event!: Event;

  selectedSubmission: Session | null = null;

  @Watch('$route', { immediate: true })
  onRouteChange(route: any) {
    if (!route.query.submission) {
      this.selectedSubmission = null;
      return;
    }

    const submissionId = parseInt(this.$route.query.submission as string);

    if (!submissionId) {
      this.selectedSubmission = null;
      return;
    }

    this.selectedSubmission =
      this.event.sessions.find((session) => session.id === submissionId) || null;
  }
}
</script>
