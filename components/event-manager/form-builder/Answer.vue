<template>
  <div class="bg-white mb-2 text-black rounded-md">
    <div class="flex">
      <div class="flex-grow">
        <input
          v-model="answer.value"
          class="w-full ml-2 p-2 outline-none text-black rounded-md"
          required
          @keydown="updateAnswerDebounced()"
        />
      </div>

      <div class="flex items-center">
        <div
          class="rounded-full bg-primary p-1 mr-2 flex items-center justify-center cursor-pointer"
          @click="moveAnswerUp()"
        >
          <img src="~/assets/icons/up-sm.svg" />
        </div>

        <div
          class="rounded-full bg-primary p-1 mr-2 flex items-center justify-center cursor-pointer"
          @click="moveAnswerDown()"
        >
          <img src="~/assets/icons/down-sm.svg" />
        </div>

        <div
          class="rounded-full bg-primary p-1 mr-2 flex items-center justify-center cursor-pointer"
          @click="deleteAnswer()"
        >
          <img src="~/assets/icons/delete-sm.svg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop } from 'nuxt-property-decorator';
import { Component, Vue } from 'vue-property-decorator';

import _ from 'lodash';

import { Answer } from '~/types/models/answer';
import { Question } from '~/types/models/question';

@Component
export default class FormBuilderAnswer extends Vue {
  @Prop({ type: Object, required: true })
  value!: Answer;

  @Prop({ type: Object, required: true })
  question!: Question;

  updateAnswerDebounced = _.debounce(this.updateAnswer, 500);

  updateAnswer() {
    this.$axios.put(`${process.env.NUXT_ENV_API_ROUTE}/answers/${this.answer.id}`, {
      ...this.answer,
      question_id: this.question.id,
    });
  }

  async deleteAnswer() {
    await this.$axios.delete(`${process.env.NUXT_ENV_API_ROUTE}/answers/${this.answer.id}`);

    this.$emit('remove');
  }

  moveAnswerUp() {
    this.$emit('moveUp');
  }

  moveAnswerDown() {
    this.$emit('moveDown');
  }

  get answer() {
    return this.value;
  }

  set answer(answer: Answer) {
    this.$emit('input', answer);
  }
}
</script>
