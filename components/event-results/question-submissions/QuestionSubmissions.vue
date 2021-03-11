<template>
  <div>
    <submission-view v-if="selectedQuestion" :question="selectedQuestion" :event="event" />
    <submission-list v-else :event="event" />
  </div>
</template>

<script lang="ts">
import { Prop } from 'nuxt-property-decorator';
import { Component, Watch } from 'vue-property-decorator';

import ProgressButton from '~/components/common/ProgressButton.vue';
import SubmissionList from '~/components/event-results/question-submissions/partials/List.vue';
import SubmissionView from '~/components/event-results/question-submissions/partials/View.vue';

import { Event } from '~/types/models/event';
import { UserMixin } from '~/mixins/user';
import { Question } from '~/types/models/question';

@Component({ components: { ProgressButton, SubmissionList, SubmissionView } })
export default class QuestionSubmissions extends UserMixin {
  @Prop({ type: Object, required: true })
  event!: Event;

  selectedQuestion: Question | null = null;

  @Watch('$route', { immediate: true })
  onRouteChange(route: any) {
    if (!route.query.question) {
      this.selectedQuestion = null;
      return;
    }

    const questionId = parseInt(this.$route.query.question as string);

    if (!questionId) {
      this.selectedQuestion = null;
      return;
    }

    this.selectedQuestion =
      this.event.questions.find((question) => question.id === questionId) || null;
  }
}
</script>
