import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';

@Module({
  name: 'errors',
  stateFactory: true,
  namespaced: true,
})
export default class ErrorsModule extends VuexModule {
  errorMessage: string | null = null;

  get showError() {
    return this.errorMessage;
  }

  @Mutation
  setErrorMessage(payload: string | null) {
    this.errorMessage = payload;
  }

  @Action
  flashError(payload: string) {
    this.context.commit('setErrorMessage', payload);

    const originalMessage = payload.valueOf();

    // Hide the message after 7.5s, unless the message is now different
    setTimeout(() => {
      if (this.errorMessage === originalMessage) {
        this.context.commit('setErrorMessage', null);
      }
    }, 7500);
  }
}
