<template>
  <div class="bg-gray-100 pb-8 px-6 h-full overflow-auto">
    <div class="bg-primary text-white -mx-6 mb-4 pt-16 pb-32">
      <div v-if="event" class="mx-auto max-w-6xl px-4 sm:px-8 xl:px-0 text-center">
        <p class="text-4xl font-bold font-serif">{{ event.name }}</p>

        <p class="font-serif">{{ event.description }}</p>
      </div>
    </div>

    <div
      class="container mx-auto max-w-6xl px-8 py-8 md:px-12 md:py-10 lg:px-16 lg:py-12 bg-white -mt-28 rounded-xl shadow-md"
    >
      <loader :loading="loading">
        <transition name="fade">
          <div v-if="!loading && !submitted && !exceededSessionLimit">
            <p class="text-xl md:text-2xl font-bold font-serif">Questions</p>
            <p class="mb-8">Please provide a responses to all of the questions below.</p>

            <div class="mb-12">
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
                        class="w-full rounded-md shadow-sm sm:text-sm border-gray-300"
                        :value="getFreeTextResponse(question.id)"
                        rows="3"
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
            </div>

            <hr class="block -mx-8 md:-mx-12 lg:-mx-16 mb-12" />

            <div class="mb-12">
              <p class="text-xl md:text-2xl font-bold font-serif">Mood</p>

              <p class="mb-8">
                To provide context for your feedback, please adjust the slider to represent how you
                are currently feeling.
              </p>

              <div class="">
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
                  min="1"
                  max="100"
                  value="50"
                />

                <div class="flex justify-between">
                  <p>Very Dissatisfied</p>
                  <p class="-ml-5">Neutral</p>
                  <p class="text-right md:text-left">Very Satisfied</p>
                </div>
              </div>
            </div>

            <hr class="block -mx-8 md:-mx-12 lg:-mx-16 mb-12" />

            <div>
              <p class="text-xl md:text-2xl font-bold font-serif">Submit</p>

              <div class="mb-6">
                <p class="mb-2 md:mb-0">
                  If you have finished the form, please submit your feedback to send it to the host.
                </p>

                <p>
                  If you are not ready to submit your feedback yet, please save your responses
                  before leaving the page.
                </p>
              </div>

              <div class="flex flex-col md:flex-row">
                <button
                  class="px-4 py-2 mr-4 gradient-button is-dark w-full md:w-min mb-2 md:mb-0"
                  :class="{
                    'bg-lightgrey text-primary no-gradient disabled': !allQuestionsCompleted,
                  }"
                  :disabled="!allQuestionsCompleted"
                  @click="submit"
                >
                  Submit Feedback
                </button>

                <button
                  class="px-4 py-2 gradient-button w-full md:w-min"
                  :class="{
                    'bg-lightgrey text-primary no-gradient  disabled': !unsavedResponses,
                  }"
                  :disabled="!unsavedResponses"
                  @click="save"
                >
                  Save Responses
                </button>
              </div>
            </div>
          </div>
        </transition>

        <transition name="delayed-fade">
          <div v-if="!loading && submitted">
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
                <p class="text-3xl mb-1 font-serif">Responses Submitted</p>

                <p class="mb-2">
                  Thank you for taking the time to provide feedback, your responses have been
                  recorded and sent to the event organiser. <br />
                  You can now safely close your browser window.
                </p>

                <p class="mb-4">
                  If you wish to fill out another survey, please click the button below to return to
                  the homepage.
                </p>

                <router-link to="/">
                  <button
                    class="px-4 py-2 mr-4 rounded-md cursor-pointer bg-lightgrey text-black cursor-pointer"
                  >
                    Return to homepage
                  </button>
                </router-link>
              </div>
            </div>
          </div>
        </transition>

        <transition name="delayed-fade">
          <div v-if="exceededSessionLimit">
            <p class="text-xl font-bold font-serif">Sorry!</p>
            <p class="mb-4">
              You have exceeded the limit for the maximum number of submissions for this event.
              Please click the button below to return to the homepage.
            </p>

            <router-link to="/">
              <button
                class="px-4 py-2 mr-4 rounded-md cursor-pointer bg-lightgrey text-black cursor-pointer"
              >
                Return to homepage
              </button>
            </router-link>
          </div>
        </transition>
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
import { errorsStore } from '~/utils/store-accessor';

@Component({
  layout: 'default',
  components: { Loader },
})
export default class Attendee extends mixins(UserMixin, AuthMixin) {
  loading = true;
  submitted = false;
  showSavedMessage = false;
  exceededSessionLimit = false;

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

      // Join the events presence channel
      (this as any).$echo.join(`attendee-presence.${this.event?.id}`);

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
    } catch (error) {
      if (error?.response?.status === 422) {
        this.$auth.reset();

        this.exceededSessionLimit = true;
        this.loading = false;
      } else {
        errorsStore.flashError(
          'Sorry, an unknown error occurred while joining the event, please try again later.',
        );
      }
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
      errorsStore.flashError(
        'Sorry, an unknown error occurred while saving your responses, please try again later.',
      );
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
      (this as any).$echo.leave(`attendee-presence.${this.event?.id}`);

      this.submitted = true;
    } catch {
      errorsStore.flashError(
        'Sorry, an unknown error occurred while submitting your responses, please try again later.',
      );
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
