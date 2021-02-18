<template>
  <div class="flex-grow">
    <header class="bg-white shadow">
      <div class="h-20 py-6 px-4 sm:px-6 lg:px-8 w-full">
        <div class="flex justify-between">
          <p class="text-2xl font-bold">Manage Questions</p>

          <div class="flex items-center">
            <span class="mr-4">Add new question</span>

            <button
              title="Free text"
              class="p-2 mr-2 bg-primary rounded-full text-white"
              @click="addFreeTextQuestion()"
            >
              <img src="~/assets/icons/free-text-md.svg" />
            </button>

            <button
              title="Multiple choice"
              class="p-2 bg-primary rounded-full text-white"
              @click="addMultipleChoiceQuestion()"
            >
              <img src="~/assets/icons/multiple-choice-md.svg" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="py-6 px-4 sm:px-6 lg:px-8">
      <div class="flex-grow ml-5 lg:ml-0">
        <transition-group name="flip-list" tag="div">
          <question
            v-for="(question, index) in event.questions"
            :key="question.id"
            v-model="event.questions[index]"
            :event="event"
            @remove="removeQuestion(index)"
            @moveUp="moveQuestionUp(index)"
            @moveDown="moveQuestionDown(index)"
          />
        </transition-group>

        <p v-if="event.questions.length === 0" class="py-8 px-24 mx-auto text-center">
          You haven't added any questions to this event yet. Use the buttons in the top right to
          start building the template.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop } from 'nuxt-property-decorator';
import { Component, Vue } from 'vue-property-decorator';

import QuestionComponent from '~/components/event-manager/form-builder/Question.vue';

import { Event } from '~/types/models/event';
import { QuestionType } from '~/types/models/question';

@Component({ components: { question: QuestionComponent } })
export default class EventQuestions extends Vue {
  @Prop({ type: Object, required: true })
  value!: Event;

  async addFreeTextQuestion() {
    const response = await this.$axios.post(`${process.env.NUXT_ENV_API_ROUTE}/questions`, {
      type: QuestionType.FREE_TEXT,
      event_id: this.event?.id,
    });

    this.event.questions.push(response.data.data);
  }

  async addMultipleChoiceQuestion() {
    const response = await this.$axios.post(`${process.env.NUXT_ENV_API_ROUTE}/questions`, {
      type: QuestionType.MULTIPLE_CHOICE,
      event_id: this.event?.id,
    });

    this.event.questions.push({ ...response.data.data, ...{ answers: [] } });
  }

  async moveQuestionUp(index: number) {
    if (index === 0 || this.event.questions.length === 1) {
      return;
    }

    const question = this.event.questions[index];

    await this.$axios.patch(`${process.env.NUXT_ENV_API_ROUTE}/questions/${question.id}/move`, {
      direction: 'up',
    });

    // Swap the questions
    const updatedQuestions = [...this.event.questions];
    updatedQuestions[index] = updatedQuestions[index - 1];
    updatedQuestions[index - 1] = question;

    Vue.set(this.event, 'questions', updatedQuestions);
  }

  async moveQuestionDown(index: number) {
    if (index === this.event.questions.length - 1) {
      return;
    }

    const question = this.event.questions[index];

    await this.$axios.patch(`${process.env.NUXT_ENV_API_ROUTE}/questions/${question.id}/move`, {
      direction: 'down',
    });

    // Swap the questions
    const updatedQuestions = [...this.event.questions];
    updatedQuestions[index] = updatedQuestions[index + 1];
    updatedQuestions[index + 1] = question;

    Vue.set(this.event, 'questions', updatedQuestions);
  }

  removeQuestion(index: number) {
    const updatedQuestions = this.event.questions.filter(
      (_, questionIndex) => questionIndex !== index,
    );

    Vue.set(this.event, 'questions', updatedQuestions);
  }

  get event() {
    return this.value;
  }

  set event(event: Event) {
    this.$emit('input', event);
  }
}
</script>
