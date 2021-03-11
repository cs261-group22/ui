<template>
  <div class="flex-grow">
    <header class="bg-white shadow">
      <div class="md:h-24 flex items-center lg:h-20 max-w-7xl py-6 px-6 lg:px-8 w-full">
        <h1 class="text-xl font-bold font-serif">Publish Event</h1>
      </div>
    </header>

    <div class="py-6 px-6 lg:px-8 max-w-6xl">
      <p class="font-bold mb-2">Event Requirement Checklist:</p>

      <div class="flex ml-2 mb-4">
        <div class="mr-3">
          <p :class="{ 'text-green-600': hasName, 'text-red-400': !hasName }">
            {{ hasName ? '✓' : '✗' }}
          </p>

          <p :class="{ 'text-green-600': hasValidStart, 'text-red-400': !hasValidStart }">
            {{ hasValidStart ? '✓' : '✗' }}
          </p>

          <p :class="{ 'text-green-600': hasQuestions, 'text-red-400': !hasQuestions }">
            {{ hasQuestions ? '✓' : '✗' }}
          </p>

          <p :class="{ 'text-green-600': hasQuestionPrompts, 'text-red-400': !hasQuestionPrompts }">
            {{ hasQuestionPrompts ? '✓' : '✗' }}
          </p>

          <p :class="{ 'text-green-600': hasAnswers, 'text-red-400': !hasAnswers }">
            {{ hasAnswers ? '✓' : '✗' }}
          </p>

          <p :class="{ 'text-green-600': hasAnswerValues, 'text-red-400': !hasAnswerValues }">
            {{ hasAnswers ? '✓' : '✗' }}
          </p>
        </div>

        <div>
          <p :class="{ 'text-green-600': hasName, 'text-red-400': !hasName }">
            Event has a name set
          </p>

          <p :class="{ 'text-green-600': hasValidStart, 'text-red-400': !hasValidStart }">
            Event start is before end
          </p>

          <p :class="{ 'text-green-600': hasQuestions, 'text-red-400': !hasQuestions }">
            Event has at least one question
          </p>

          <p :class="{ 'text-green-600': hasQuestionPrompts, 'text-red-400': !hasQuestionPrompts }">
            All questions have a prompt
          </p>

          <p :class="{ 'text-green-600': hasAnswers, 'text-red-400': !hasAnswers }">
            All multiple choice questions have at least two answers
          </p>

          <p :class="{ 'text-green-600': hasAnswerValues, 'text-red-400': !hasAnswerValues }">
            All multiple choice answers are not empty
          </p>
        </div>
      </div>

      <div v-if="allChecksPass">
        <p>
          All event requirements have been met, please click the button below to publish it, so you
          can start receiving feedback.
        </p>

        <p class="mb-4">
          <span class="font-bold">Please note:</span> when the event has been published, you will no
          longer be able to edit the questions.
        </p>

        <progress-button :loading="publishing" @click="publish">Publish Event</progress-button>
      </div>

      <div v-else>
        Sorry, this event cannot be published yet, due to one or more failed requirement checks.
        <br />
        Please make the suggested corrections, and try again.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop } from 'nuxt-property-decorator';
import { Component, Vue } from 'vue-property-decorator';

import ProgressButton from '~/components/common/ProgressButton.vue';

import { Event } from '~/types/models/event';
import { QuestionType } from '~/types/models/question';
import { errorsStore } from '~/utils/store-accessor';

@Component({ components: { ProgressButton } })
export default class EventPublish extends Vue {
  @Prop({ type: Object, required: true })
  event!: Event;

  publishing = false;

  async publish() {
    this.publishing = true;

    try {
      await this.$axios.post(`${process.env.NUXT_ENV_API_ROUTE}/events/${this.event.id}/publish`);

      this.$router.push('/dashboard/events');
    } catch {
      errorsStore.flashError('Sorry, an unknown error occurred while publishing the event.');
    }
  }

  get allChecksPass() {
    return [
      this.hasName,
      this.hasValidStart,
      this.hasQuestions,
      this.hasQuestionPrompts,
      this.hasAnswers,
      this.hasAnswerValues,
    ].reduce((carry, current) => carry && current);
  }

  get hasName() {
    return this.event.name !== '';
  }

  get hasValidStart() {
    if (!this.event.starts_at || !this.event.ends_at) {
      return true;
    }

    return new Date(this.event.starts_at) < new Date(this.event.ends_at);
  }

  get hasQuestions() {
    return this.event.questions.length > 0;
  }

  get hasQuestionPrompts() {
    return !this.event.questions.some((question) => !question.prompt);
  }

  get hasAnswers() {
    return !this.event.questions.some(
      (question) => question.type === QuestionType.MULTIPLE_CHOICE && question.answers.length < 2,
    );
  }

  get hasAnswerValues() {
    return !this.event.questions.some(
      (question) =>
        question.type === QuestionType.MULTIPLE_CHOICE &&
        question.answers.some((answer) => !answer.value),
    );
  }
}
</script>
