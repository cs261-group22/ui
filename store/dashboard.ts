import { Module, VuexModule, MutationAction } from 'vuex-module-decorators';

@Module({
  name: 'dashboard',
  stateFactory: true,
  namespaced: true,
})
export default class DashboardModule extends VuexModule {
  pageName: string = 'Dashboard';

  get currentPageName() {
    return this.pageName;
  }

  @MutationAction({ mutate: ['pageName'] })
  async setPageName(payload: string) {
    return {
      pageName: payload,
    };
  }
}
