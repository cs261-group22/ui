<template>
  <div
    class="mb-8 px-6 py-8 bg-lightgrey rounded-md text-black border-dotted border-4 border-primary border-opacity-30"
  >
    <div class="flex items-center w-full">
      <div class="mr-6">
        <div
          class="rounded-full bg-primary p-1 flex items-center justify-center mb-4 cursor-pointer"
          @click="moveQuestionUp()"
        >
          <img src="~/assets/icons/up-md.svg" />
        </div>

        <div
          class="rounded-full bg-primary p-1 flex items-center justify-center mb-4 cursor-pointer"
          @click="moveQuestionDown()"
        >
          <img src="~/assets/icons/down-md.svg" />
        </div>

        <div
          class="rounded-full bg-primary p-1 flex items-center justify-center cursor-pointer"
          @click="deleteQuestion()"
        >
          <img src="~/assets/icons/delete-md.svg" />
        </div>
      </div>

      <div class="w-full mr-2">
        <p class="font-bold text-xl mb-2">
          {{ isMultipleChoice ? 'Multiple Choice' : 'Free Text' }}
        </p>

        <div class="w-full" :class="{ 'mb-4': isMultipleChoice }">
          <label :for="`prompt_${question.id}`" class="block text-sm font-medium text-black"
            >Prompt</label
          >
          <textarea
            v-model="question.prompt"
            :name="`prompt_${question.id}`"
            type="text"
            rows="2"
            class="mt-1 text-black block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            required
            @keyup="updateQuestionDebounced()"
          />
        </div>

        <template v-if="isMultipleChoice">
          <div class="flex mb-4">
            <div class="w-1/2 mr-4">
              <label
                :for="`min_responses_${question.id}`"
                class="block text-sm font-medium text-black"
                >Minimum Reponses</label
              >
              <input
                v-model.number="question.min_responses"
                type="number"
                :name="`min_responses_${question.id}`"
                placeholder="1"
                class="mt-1 w-full text-black block shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
                @keyup="updateQuestionDebounced()"
              />
            </div>

            <div class="w-1/2">
              <label
                :for="`max_responses_${question.id}`"
                class="block text-sm font-medium text-black"
                >Maximum Responses</label
              >
              <input
                v-model.number="question.max_responses"
                type="number"
                :name="`max_responses${question.id}`"
                placeholder="1"
                class="mt-1 w-full text-black block shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
                @keyup="updateQuestionDebounced()"
              />
            </div>
          </div>

          <p class="text-sm font-500">Manage Answers</p>

          <transition-group name="flip-list" tag="div" class="mt-1">
            <answer
              v-for="(answer, index) in question.answers"
              :key="answer.id"
              v-model="question.answers[index]"
              :question="question"
              @remove="removeAnswer(index)"
              @moveUp="moveAnswerUp(index)"
              @moveDown="moveAnswerDown(index)"
            />
          </transition-group>

          <div class="flex items-center justify-center mt-4">
            <div
              class="rounded-full bg-primary p-1 flex items-center justify-center cursor-pointer"
              @click="addAnswer()"
            >
              <img src="~/assets/icons/add-md.svg" />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop } from 'nuxt-property-decorator';
import { Component, Vue } from 'vue-property-decorator';

import _ from 'lodash';

import Answer from '~/components/event-manager/form-builder/Question.vue';
import { Question, QuestionType } from '~/types/models/question';
import { Event } from '~/types/models/event';

@Component({ components: { Answer } })
export default class FormBuilderQuestion extends Vue {
  @Prop({ type: Object, required: true })
  value!: Question;

  @Prop({ type: Object, required: true })
  event!: Event;

  updateQuestionDebounced = _.debounce(this.updateQuestion, 500);

  updateQuestion() {
    this.$axios.put(`${process.env.NUXT_ENV_API_ROUTE}/questions/${this.question.id}`, {
      ...this.question,
      event_id: this.event?.id,
    });
  }

  async deleteQuestion() {
    await this.$axios.delete(`${process.env.NUXT_ENV_API_ROUTE}/questions/${this.question.id}`);

    this.$emit('remove');
  }

  async addAnswer() {
    const response = await this.$axios.post(`${process.env.NUXT_ENV_API_ROUTE}/answers`, {
      question_id: this.question.id,
    });

    this.question.answers?.push(response.data.data);
  }

  removeAnswer(index: number) {
    const updatedAnswers = this.question.answers.filter((_, answerIndex) => answerIndex !== index);

    Vue.set(this.question, 'answers', updatedAnswers);
  }

  moveQuestionUp() {
    this.$emit('moveUp');
  }

  moveQuestionDown() {
    this.$emit('moveDown');
  }

  async moveAnswerUp(index: number) {
    if (index === 0 || this.question.answers.length === 1) {
      return;
    }

    const answer = this.question.answers[index];

    // Inform the API of the action
    await this.$axios.patch(`${process.env.NUXT_ENV_API_ROUTE}/answers/${answer.id}/move`, {
      direction: 'up',
    });

    // Swap the answers
    const updatedAnswers = [...this.question.answers];
    updatedAnswers[index] = updatedAnswers[index - 1];
    updatedAnswers[index - 1] = answer;

    Vue.set(this.question, 'answers', updatedAnswers);
  }

  async moveAnswerDown(index: number) {
    if (index === this.question.answers.length - 1) {
      return;
    }

    const answer = this.question.answers[index];

    // Inform the API of the action
    await this.$axios.patch(`${process.env.NUXT_ENV_API_ROUTE}/answers/${answer.id}/move`, {
      direction: 'down',
    });

    // Swap the answers
    const updatedAnswers = [...this.question.answers];
    updatedAnswers[index] = updatedAnswers[index + 1];
    updatedAnswers[index + 1] = answer;

    Vue.set(this.question, 'answers', updatedAnswers);
  }

  get isMultipleChoice() {
    return this.question.type === QuestionType.MULTIPLE_CHOICE;
  }

  get question() {
    return this.value;
  }

  set question(question: Question) {
    this.$emit('input', question);
  }
}
</script>
