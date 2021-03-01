<template>
  <div>
    <div class="bg-primary text-white mb-4 py-8">
      <div v-if="event" class="mx-auto max-w-6xl px-4 sm:px-8 xl:px-0">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-4xl font-extrabold">{{ event.name }}</p>

            <p>{{ event.description }}</p>
          </div>

          <div>
            <p>Responding as</p>
            <p class="font-bold">{{ isGuest ? 'Guest' : userName }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto max-w-6xl px-4 sm:px-8 xl:px-0">
      <loader :loading="loading" class="py-8 mb-8">
        <transition-group name="page">
          <div v-if="!loading && submitted" key="1">
            <p class="text-2xl mb-1">Questions</p>

            <p class="mb-8">
              To give feedback for the event organiser, please give responses to each of the
              questions below.
            </p>

            <div v-for="(question, questionIndex) in questions" :key="question.id" class="mb-8">
              <div class="flex mb-4">
                <p class="font-bold mr-2">{{ questionIndex + 1 }})</p>

                <div class="w-full">
                  <p
                    class="font-bold"
                    :class="{
                      'mb-4': question.type === QuestionType.FREE_TEXT,
                      'mb-1': question.type === QuestionType.MULTIPLE_CHOICE,
                    }"
                  >
                    {{ question.prompt }}
                  </p>

                  <template v-if="question.type === QuestionType.FREE_TEXT">
                    <textarea
                      class="w-full"
                      :value="getFreeTextResponse(question.id)"
                      @input="setFreeTextResponse(question.id, ...arguments)"
                    />
                  </template>

                  <template v-else>
                    <p v-if="getMultipleChoiceHint(question)" class="text-sm italic mb-2">
                      {{ getMultipleChoiceHint(question) }}
                    </p>

                    <div v-for="answer in question.answers" :key="answer.id">
                      <label>
                        <template v-if="getAnswerType(question) === 'radio'">
                          <input
                            :id="answer.id"
                            :value="answer.id"
                            :name="`${questionIndex}`"
                            :checked="getMultipleChoiceRadioAnswer(question.id) === answer.id"
                            type="radio"
                            class="form-radio mr-2"
                            @change="setMultipleChoiceRadio(question.id, answer.id)"
                          />
                        </template>

                        <template v-else>
                          <input
                            :id="answer.id"
                            :name="`${questionIndex}`"
                            :checked="getMultipleChoiceCheckboxSelected(question.id, answer.id)"
                            type="checkbox"
                            class="mr-2"
                            @change="
                              setMultipleChoiceCheckbox(question.id, answer.id, ...arguments)
                            "
                          />
                        </template>

                        <span>{{ answer.value }}</span>
                      </label>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <hr class="mb-8" />

            <p class="text-2xl mb-1">Mood</p>

            <p class="mb-8">
              To provide the event organiser with context for your feedback, please adjust the
              slider to represent how you are currently feeling.
            </p>

            <div class="max-w-3xl mx-auto mb-8">
              <div class="flex mb-2 text-5xl justify-between">
                <p class="cursor-pointer" @click="session.mood = 0">😠</p>
                <p class="cursor-pointer" @click="session.mood = 25">🙁</p>
                <p class="cursor-pointer" @click="session.mood = 50">😐</p>
                <p class="cursor-pointer" @click="session.mood = 75">🙂</p>
                <p class="cursor-pointer" @click="session.mood = 100">😀</p>
              </div>

              <input
                v-model="session.mood"
                class="w-full mb-2"
                type="range"
                min="0"
                max="100"
                value="50"
              />

              <div class="flex justify-between">
                <p>Very Dissatisfied</p>
                <p class="-ml-5">Neutral</p>
                <p>Very Satisfied</p>
              </div>
            </div>

            <hr class="mb-8" />

            <p class="text-2xl mb-1">Submit</p>

            <div class="mb-6">
              <p class="mb-1">
                If you have finished the form, please submit your feedback to send it to the host.
              </p>

              <p>
                Alternatively if you are not ready to submit your feedback yet, please ensure you
                have saved your responses before leaving the page.
              </p>
            </div>

            <div class="flex">
              <button
                class="px-4 py-2 mr-4 rounded-md cursor-pointer"
                :class="{
                  'bg-quinary text-white cursor-pointer': allQuestionsCompleted,
                  'bg-lightgrey text-primary cursor-default': !allQuestionsCompleted,
                }"
                @click="submit"
              >
                Submit Feedback
              </button>

              <button
                class="px-4 py-2 rounded-md"
                :class="{
                  'bg-secondary text-white cursor-pointer': unsavedResponses,
                  'bg-lightgrey text-primary cursor-default': !unsavedResponses,
                }"
                @click="save"
              >
                Save Responses
              </button>
            </div>
          </div>

          <div v-if="!loading && !submitted" key="2" class="py-4 max-w-6xl mx-auto">
            <div class="flex flex-col sm:flex-row items-center">
              <div class="sm:mr-4 md:mr-8 lg:mr-12 mb-8 sm:mb-0">
                <svg
                  class="w-32 lg:w-40 mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="green"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div>
                <p class="text-3xl mb-1">Responses Submitted</p>

                <p class="mb-2">
                  Thank you for taking the time to provide feedback, your responses have been
                  recorded and sent to the event organiser. <br />
                  You can now safely close your browser window.
                </p>

                <p>
                  If you wish to fill out another survey, please
                  <router-link class="underline" to="/">click here</router-link> to return to the
                  homepage.
                </p>
              </div>
            </div>
          </div>
        </transition-group>
      </loader>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator';
import _ from 'lodash';

import { UserMixin } from '~/mixins/user';
import AuthMixin from '~/mixins/auth';

import { Event } from '~/types/models/event';
import { Question, QuestionType } from '~/types/models/question';

import Loader from '~/components/common/Loader.vue';
import { Session } from '~/types/models/session';
import { Response } from '~/types/models/response';

@Component({
  layout: 'default',
  components: { Loader },
})
export default class Attendee extends mixins(UserMixin, AuthMixin) {
  loading = true;
  submitted = false;
  showSavedMessage = false;

  event: Event | null = null;
  session: Session | null = null;
  responses: Map<number, Response[]> = new Map();
  persistedResponses: Response[] = [];

  QuestionType = QuestionType;

  async created() {
    // The user must be logged in
    if (!this.isLoggedIn) {
      this.$router.push('/');
    }

    try {
      // Fetch data for the event
      const eventResponse = await this.$axios.get(
        `${process.env.NUXT_ENV_API_ROUTE}/events/code/${this.$route.params.code}`,
      );

      this.event = eventResponse.data.data;

      // Start a session for the user
      const sessionResponse = await this.$axios.post(
        `${process.env.NUXT_ENV_API_ROUTE}/events/${this.event?.id}/sessions`,
      );

      this.session = sessionResponse.data.data;

      // Fetch any existing responses for the session
      const responsesResponse = await this.$axios.get(
        `${process.env.NUXT_ENV_API_ROUTE}/sessions/${this.session?.id}/responses`,
      );

      const responses = new Map();

      // Add empty response arrays to the responses map for each question
      this.event?.questions.forEach((question) => responses.set(question.id, []));

      // Set existing responses that are already submitted
      responsesResponse.data.data.forEach((response: Response) =>
        responses.get(response.question_id).push({
          value: response.value,
          answer_id: response.answer_id,
          question_id: response.question_id,
        }),
      );

      this.persistedResponses = responsesResponse.data.data;
      this.responses = responses;
      this.loading = false;

      // Add event listner to warn user if they have unsaved responses
      window.onbeforeunload = (event: any) => {
        if (this.unsavedResponses) {
          const message = 'You currently have unsaved responses';

          event.returnValue = message;
          event.preventDefault();

          return message;
        }
      };
    } catch {
      // todo: show error message
    }
  }

  async save() {
    if (!this.unsavedResponses) {
      return;
    }

    try {
      const responses = [...this.responses.values()].flat();

      await this.$axios.patch(
        `${process.env.NUXT_ENV_API_ROUTE}/sessions/${this.session?.id}/responses`,
        { responses: responses.map((response) => _.omitBy(response, _.isNil)) },
      );

      this.persistedResponses = responses;
    } catch {
      // todo: show error message
    }
  }

  async submit() {
    try {
      await this.save();

      await this.$axios.post(
        `${process.env.NUXT_ENV_API_ROUTE}/sessions/${this.session?.id}/submit`,
        { mood: this.session?.mood || 50 },
      );

      // Log the user out after submission to prevent them from starting a new session when refreshing the page
      this.$auth.reset();

      this.submitted = true;
    } catch {
      // todo: show error message
    }
  }

  getAnswerType(question: Question) {
    if (
      question.min_responses &&
      question.max_responses &&
      question.min_responses === 1 &&
      question.max_responses === 1
    ) {
      return 'radio';
    }

    return 'checkbox';
  }

  getMultipleChoiceHint(question: Question) {
    if (!question || (!question.min_responses && !question.max_responses)) {
      return null;
    }

    if (question.min_responses && !question.max_responses) {
      return `Please select at least ${question.min_responses} option${
        question.min_responses > 1 ? 's' : ''
      }.`;
    }

    if (!question.min_responses && question.max_responses) {
      return `Please select at most ${question.max_responses} option${
        question.max_responses > 1 ? 's' : ''
      }.`;
    }

    if (question.min_responses === question.max_responses) {
      return `Please select ${question.min_responses} option${
        question.min_responses && question.min_responses > 1 ? 's' : ''
      }.`;
    }

    return `Please select between ${question.min_responses} and ${question.max_responses} options.`;
  }

  getFreeTextResponse(questionId: number) {
    const responses = this.responses.get(questionId);

    return responses && responses.length ? responses[0].value : '';
  }

  setFreeTextResponse(questionId: number, event: any) {
    const updatedResponses = new Map(this.responses);
    updatedResponses.set(questionId, [{ question_id: questionId, value: event.target.value }]);

    this.responses = updatedResponses;
  }

  getMultipleChoiceRadioAnswer(questionId: number) {
    const responses = this.responses.get(questionId);

    return responses && responses.length ? responses[0].answer_id : null;
  }

  getMultipleChoiceCheckboxSelected(questionId: number, answerId: number) {
    const responses = this.responses.get(questionId);

    return responses ? responses.some((response) => response.answer_id === answerId) : false;
  }

  setMultipleChoiceRadio(questionId: number, answerId: number) {
    const updatedResponses = new Map(this.responses);
    updatedResponses.set(questionId, [{ question_id: questionId, answer_id: answerId }]);

    this.responses = updatedResponses;
  }

  setMultipleChoiceCheckbox(questionId: number, answerId: number, event: any) {
    const updatedResponses = new Map(this.responses);

    // Remove existing respones with the same question and answer id
    updatedResponses.set(
      questionId,
      this.responses
        .get(questionId)
        ?.filter(
          (response) => !(response.question_id === questionId && response.answer_id === answerId),
        ) || [],
    );

    // If the answer was checked, add a new response for it
    if (event.target.checked) {
      updatedResponses.get(questionId)?.push({
        question_id: questionId,
        answer_id: answerId,
      });
    }

    this.responses = updatedResponses;
  }

  get questions() {
    return this.event?.questions || [];
  }

  get allQuestionsCompleted() {
    for (const question of this.event?.questions || []) {
      const responses = this.responses.get(question.id as number);

      // Free text responses must not be empty
      if (question.type === QuestionType.FREE_TEXT && (!responses || !responses[0]?.value)) {
        return false;
      }

      // Multiple choice answers must have the expected number of responses
      if (
        question.type === QuestionType.MULTIPLE_CHOICE &&
        (!responses ||
          responses.length < (question.min_responses || 0) ||
          responses.length > (question.max_responses || Number.MAX_SAFE_INTEGER))
      ) {
        return false;
      }
    }

    return true;
  }

  get unsavedResponses() {
    const allResponses = [...this.responses.values()].flat();

    if (this.persistedResponses.length !== allResponses.length) {
      return true;
    }

    for (const response of allResponses) {
      const question = this.questions.find((question) => question.id === response.question_id);

      if (!question) {
        continue;
      }

      const foundMatchingResponse = this.persistedResponses.some((persistedResponse) => {
        if (persistedResponse.question_id !== question.id) {
          return false;
        }

        if (question.type === QuestionType.FREE_TEXT) {
          return persistedResponse.value === response.value;
        }

        if (question.type === QuestionType.MULTIPLE_CHOICE) {
          return persistedResponse.answer_id === response.answer_id;
        }
      });

      if (!foundMatchingResponse) {
        return true;
      }
    }

    return false;
  }
}
</script>
