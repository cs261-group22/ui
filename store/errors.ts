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
    const expiry = new Date();
    expiry.setSeconds(expiry.getSeconds() + 10);

    this.context.commit('setErrorMessage', payload);

    const originalMessage = payload.valueOf();

    setTimeout(() => {
      if (this.errorMessage === originalMessage) {
        this.context.commit('setErrorMessage', null);
      }
    }, 7500);
  }
}
